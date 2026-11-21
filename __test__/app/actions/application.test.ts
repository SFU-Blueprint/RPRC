import { beforeEach, describe, expect, it, vi } from 'vitest';

// Checkout and payment activation treat payments created after `finalized_at` as paying for
// the current approval round, so every approval (including after a renewal) must move it.

type Call = {
  table: string;
  op: string;
  payload?: unknown;
  filters: [string, unknown][];
};
const calls: Call[] = [];
let responses: Record<string, { data: unknown; error: unknown }[]> = {};

function from(table: string) {
  const call: Call = { table, op: 'select', filters: [] };
  calls.push(call);
  const respond = () =>
    Promise.resolve(responses[table]?.shift() ?? { data: null, error: null });
  const builder = {
    select: () => builder,
    insert: (payload: unknown) =>
      Object.assign(call, { op: 'insert', payload }) && builder,
    update: (payload: unknown) =>
      Object.assign(call, { op: 'update', payload }) && builder,
    delete: () => Object.assign(call, { op: 'delete' }) && builder,
    eq: (column: string, value: unknown) => (
      call.filters.push([column, value]),
      builder
    ),
    single: respond,
    maybeSingle: respond,
    then: (
      resolve: (value: unknown) => unknown,
      reject: (reason: unknown) => unknown,
    ) => respond().then(resolve, reject),
  };
  return builder;
}

vi.mock('@/lib/supabase/server', () => ({
  createClient: async () => ({
    auth: { getUser: async () => ({ data: { user: { id: 'admin_1' } } }) },
    from,
  }),
}));
vi.mock('@/lib/helpers/auth-helper', () => ({ isAdmin: async () => true }));
vi.mock('next/cache', () => ({ revalidatePath: vi.fn() }));
vi.mock('next/navigation', () => ({ redirect: vi.fn() }));

const { submitApplicationReview } = await import('@/app/actions/application');
const { ReviewErrorMessage } =
  await import('@/lib/constants/application-errors');

const review = {
  appId: 'app_1',
  reviewerName: 'Reviewer',
  reviewDate: '2026-11-14',
  decision: 'approve',
  reason: 'Looks good',
} as Parameters<typeof submitApplicationReview>[0];

const ok = { data: null, error: null };
const inserted = { data: { id: 'rev_new' }, error: null };
const recount = (n: number) => ({
  data: Array.from({ length: n }, (_, i) => ({ id: `rev_${i}` })),
  error: null,
});
const statusUpdated = { data: [{ id: 'app_1' }], error: null };
const statusNotUpdated = { data: [], error: null };

const applicationUpdate = () =>
  calls.find((c) => c.table === 'applications' && c.op === 'update') as
    | (Call & { payload: { status: string; finalized_at: string | null } })
    | undefined;
const deletedReview = () =>
  calls.find((c) => c.table === 'application_reviews' && c.op === 'delete');

beforeEach(() => {
  calls.length = 0;
  responses = {};
});

describe('submitApplicationReview finalized_at', () => {
  it('sets finalized_at to now on the approval that moves the application to payment_pending', async () => {
    // A renewal: the application was approved last year, and its old reviews were
    // cleared when the member resubmitted, so this round has one approval so far.
    responses.applications = [
      { data: { status: 'to_review' }, error: null },
      statusUpdated,
    ];
    responses.application_reviews = [
      { data: [{ decision: 'approve', waiver_decision: null }], error: null },
      inserted,
      recount(2),
    ];
    const before = Date.now();

    const result = await submitApplicationReview(review);

    expect(result).toEqual({ success: true });
    const update = applicationUpdate()!;
    expect(update.payload.status).toBe('payment_pending');
    expect(
      new Date(update.payload.finalized_at!).getTime(),
    ).toBeGreaterThanOrEqual(before);
  });

  it('leaves the application untouched when a first review keeps it in to_review', async () => {
    // Also means this review is never withdrawn because another admin's request, which
    // already counted it, changed the status first.
    responses.applications = [{ data: { status: 'to_review' }, error: null }];
    responses.application_reviews = [
      { data: [], error: null },
      inserted,
      recount(1),
    ];

    const result = await submitApplicationReview(review);

    expect(result).toEqual({ success: true });
    expect(applicationUpdate()).toBeUndefined();
    expect(deletedReview()).toBeUndefined();
  });
});

describe('submitApplicationReview fee waiver', () => {
  it('activates an approved application whose waiver the first reviewer granted', async () => {
    responses.applications = [
      { data: { status: 'to_review' }, error: null },
      statusUpdated,
    ];
    responses.application_reviews = [
      {
        data: [{ decision: 'approve', waiver_decision: 'approve' }],
        error: null,
      },
      inserted,
      recount(2),
    ];
    responses.individual_application_details = [
      { data: { fee_waiver: true }, error: null },
    ];

    const result = await submitApplicationReview(review);

    expect(result).toEqual({ success: true });
    expect(applicationUpdate()?.payload.status).toBe('active');
  });
});

describe('submitApplicationReview guards', () => {
  it.each(['payment_pending', 'rejected', 'active', 'expires_soon', 'expired'])(
    'refuses to review an application that is %s',
    async (status) => {
      responses.applications = [{ data: { status }, error: null }];

      const result = await submitApplicationReview(review);

      expect(result).toEqual({
        success: false,
        error: ReviewErrorMessage.ALREADY_FINALIZED,
      });
      expect(calls.some((c) => c.op === 'insert')).toBe(false);
    },
  );

  it('withdraws the review when another review landed at the same time', async () => {
    // Two first reviews at once: both read no reviews, but there are two after inserting.
    responses.applications = [{ data: { status: 'to_review' }, error: null }];
    responses.application_reviews = [
      { data: [], error: null },
      inserted,
      recount(2),
      ok, // delete
    ];

    const result = await submitApplicationReview(review);

    expect(result).toEqual({
      success: false,
      error: ReviewErrorMessage.CONCURRENT_REVIEW,
    });
    expect(deletedReview()?.filters).toContainEqual(['id', 'rev_new']);
    expect(applicationUpdate()).toBeUndefined();
  });

  it('withdraws the review when the status changed before the update', async () => {
    responses.applications = [
      { data: { status: 'to_review' }, error: null },
      statusNotUpdated,
    ];
    responses.application_reviews = [
      { data: [{ decision: 'approve', waiver_decision: null }], error: null },
      inserted,
      recount(2),
      ok, // delete
    ];

    const result = await submitApplicationReview(review);

    expect(result.success).toBe(false);
    expect(applicationUpdate()?.filters).toContainEqual([
      'status',
      'to_review',
    ]);
    expect(deletedReview()?.filters).toContainEqual(['id', 'rev_new']);
  });

  it('warns not to retry when the review could not be withdrawn', async () => {
    responses.applications = [{ data: { status: 'to_review' }, error: null }];
    responses.application_reviews = [
      { data: [], error: null },
      inserted,
      recount(2),
      { data: null, error: { message: 'connection reset' } }, // delete fails
    ];

    const result = await submitApplicationReview(review);

    expect(result.success).toBe(false);
    expect(result.error).toBe(
      ReviewErrorMessage.CONCURRENT_REVIEW_NOT_WITHDRAWN,
    );
  });
});

describe('submitApplicationReview review_date', () => {
  it('stores the chosen date in review_date and leaves created_at to the database', async () => {
    responses.applications = [{ data: { status: 'to_review' }, error: null }];
    responses.application_reviews = [
      { data: [], error: null },
      { data: null, error: null },
    ];

    await submitApplicationReview(review);

    const insert = calls.find(
      (c) => c.table === 'application_reviews' && c.op === 'insert',
    )?.payload as Record<string, unknown>;
    expect(insert.review_date).toBe('2026-11-14');
    expect(insert).not.toHaveProperty('created_at');
  });

  it('rejects a review date that is not a real YYYY-MM-DD date', async () => {
    const result = await submitApplicationReview({
      ...review,
      reviewDate: 'today',
    });

    expect(result).toEqual({
      success: false,
      error: ReviewErrorMessage.INVALID_REVIEW_DATE,
    });
    expect(calls.some((c) => c.op === 'insert')).toBe(false);
  });
});

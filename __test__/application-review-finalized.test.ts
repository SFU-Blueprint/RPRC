import { beforeEach, describe, expect, it, vi } from 'vitest';

// Checkout and payment activation treat payments created after `finalized_at` as paying for
// the current approval round, so every approval (including after a renewal) must move it.

type Call = { table: string; op: string; payload?: unknown };
const calls: Call[] = [];
let responses: Record<string, { data: unknown; error: unknown }[]> = {};

function from(table: string) {
  const call: Call = { table, op: 'select' };
  calls.push(call);
  const respond = () =>
    Promise.resolve(responses[table]?.shift() ?? { data: null, error: null });
  const builder = {
    select: () => builder,
    insert: (payload: unknown) =>
      Object.assign(call, { op: 'insert', payload }) && builder,
    update: (payload: unknown) =>
      Object.assign(call, { op: 'update', payload }) && builder,
    eq: () => builder,
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

const review = {
  appId: 'app_1',
  reviewerName: 'Reviewer',
  reviewDate: '2026-11-14',
  decision: 'approve',
  reason: 'Looks good',
} as Parameters<typeof submitApplicationReview>[0];

const applicationUpdate = () =>
  calls.find((c) => c.table === 'applications' && c.op === 'update')
    ?.payload as { status: string; finalized_at: string | null };

beforeEach(() => {
  calls.length = 0;
  responses = {};
});

describe('submitApplicationReview finalized_at', () => {
  it('sets finalized_at to now on the approval that moves the application to payment_pending', async () => {
    // A renewal: the application was approved last year, and its old reviews were
    // cleared when the member resubmitted, so this round has one approval so far.
    responses.applications = [{ data: { status: 'to_review' }, error: null }];
    responses.application_reviews = [
      { data: [{ decision: 'approve' }], error: null },
      { data: null, error: null },
    ];
    const before = Date.now();

    const result = await submitApplicationReview(review);

    expect(result).toEqual({ success: true });
    const update = applicationUpdate();
    expect(update.status).toBe('payment_pending');
    expect(new Date(update.finalized_at!).getTime()).toBeGreaterThanOrEqual(
      before,
    );
  });

  it('clears finalized_at while the application is still being reviewed', async () => {
    responses.applications = [{ data: { status: 'to_review' }, error: null }];
    responses.application_reviews = [
      { data: [], error: null },
      { data: null, error: null },
    ];

    await submitApplicationReview(review);

    expect(applicationUpdate()).toEqual({
      status: 'to_review',
      finalized_at: null,
    });
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
      error: 'Review date must be a valid date',
    });
    expect(calls.some((c) => c.op === 'insert')).toBe(false);
  });
});

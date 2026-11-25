import { beforeEach, describe, expect, it, vi } from 'vitest';

// submitMembershipRenewal sends the "received" email once the application is back in
// review, with renewal wording only for an application that has been active before.

type Response = { data: unknown; error: unknown };
let responses: Record<string, Response[]> = {};

function from(table: string) {
  const respond = () =>
    Promise.resolve(responses[table]?.shift() ?? { data: null, error: null });
  const builder = {
    select: () => builder,
    update: () => builder,
    delete: () => builder,
    eq: () => builder,
    order: () => builder,
    limit: () => builder,
    maybeSingle: respond,
    then: (
      resolve: (value: Response) => unknown,
      reject: (reason: unknown) => unknown,
    ) => respond().then(resolve, reject),
  };
  return builder;
}

vi.mock('@/lib/supabase/server', () => ({
  createClient: async () => ({
    auth: { getUser: async () => ({ data: { user: { id: 'user_1' } } }) },
    from,
  }),
}));
vi.mock('next/cache', () => ({ revalidatePath: vi.fn() }));
const email = vi.hoisted(() => ({ queueStatusEmail: vi.fn() }));
vi.mock('@/lib/email/send-status-email', () => email);

const { submitMembershipRenewal } =
  await import('@/app/actions/member-dashboard');

const latest = (status: string, memberSince: string | null) => ({
  data: { id: 'app_1', status, type: 'individual', member_since: memberSince },
  error: null,
});
const ok = { data: null, error: null };
const updated = { data: [{ id: 'app_1' }], error: null };

beforeEach(() => {
  responses = {};
  email.queueStatusEmail.mockReset();
});

describe('submitMembershipRenewal email', () => {
  it('sends renewal wording when a lapsed member renews', async () => {
    responses.applications = [
      latest('expired', '2025-01-15T00:00:00Z'),
      updated,
    ];
    responses.application_reviews = [ok];

    const result = await submitMembershipRenewal();

    expect(result).toEqual({ success: true });
    expect(email.queueStatusEmail).toHaveBeenCalledTimes(1);
    expect(email.queueStatusEmail).toHaveBeenCalledWith('app_1', {
      template: 'application_received',
      renewal: true,
    });
  });

  it('sends first-time wording when a rejected first application re-applies', async () => {
    responses.applications = [latest('rejected', null), updated];
    responses.application_reviews = [ok];

    await submitMembershipRenewal();

    expect(email.queueStatusEmail).toHaveBeenCalledWith('app_1', {
      template: 'application_received',
      renewal: false,
    });
  });

  it('sends nothing when the status update did not apply', async () => {
    responses.applications = [
      latest('expired', '2025-01-15T00:00:00Z'),
      { data: [], error: null },
    ];
    responses.application_reviews = [ok];

    const result = await submitMembershipRenewal();

    expect(result.success).toBe(false);
    expect(email.queueStatusEmail).not.toHaveBeenCalled();
  });
});

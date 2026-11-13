import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { StripeCheckoutSession } from '@/lib/stripe/server';

type Call = {
  table: string;
  op: string;
  payload?: unknown;
  filters: [string, string, unknown][];
};
type Response = { data: unknown; error: { message: string } | null };

// Minimal stand-in for the supabase-js query builder: records every call and answers
// each query from a per-table queue of responses.
const calls: Call[] = [];
let responses: Record<string, Response[]> = {};

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
    eq: (column: string, value: unknown) => (
      call.filters.push([column, 'eq', value]),
      builder
    ),
    gte: (column: string, value: unknown) => (
      call.filters.push([column, 'gte', value]),
      builder
    ),
    order: () => builder,
    limit: () => builder,
    single: respond,
    maybeSingle: respond,
    then: (
      resolve: (value: Response) => unknown,
      reject: (reason: unknown) => unknown,
    ) => respond().then(resolve, reject),
  };
  return builder;
}

vi.mock('@/lib/supabase/admin', () => ({
  createAdminClient: () => ({ from }),
}));

const {
  fulfillCheckoutSession,
  getPaymentStatusForSession,
  startMembershipCheckout,
} = await import('./payment-service');

const payment = {
  id: 'pay_1',
  user_id: 'user_1',
  application_id: 'app_1',
  amount: 5,
  currency: 'CAD',
  status: 'requires_payment_method',
  stripe_session_id: 'cs_1',
};

const paidSession: StripeCheckoutSession = {
  id: 'cs_1',
  url: null,
  status: 'complete',
  payment_status: 'paid',
  amount_total: 500,
  currency: 'cad',
  payment_intent: 'pi_1',
  metadata: { payment_id: 'pay_1', user_id: 'user_1', application_id: 'app_1' },
};

beforeEach(() => {
  calls.length = 0;
  responses = {};
});

describe('getPaymentStatusForSession', () => {
  it('maps Checkout Session outcomes to payment_transaction_status values', () => {
    expect(
      getPaymentStatusForSession({
        status: 'complete',
        payment_status: 'paid',
      }),
    ).toBe('succeeded');
    expect(
      getPaymentStatusForSession({
        status: 'complete',
        payment_status: 'unpaid',
      }),
    ).toBe('processing');
    expect(
      getPaymentStatusForSession({
        status: 'expired',
        payment_status: 'unpaid',
      }),
    ).toBe('canceled');
    expect(
      getPaymentStatusForSession(
        { status: 'complete', payment_status: 'unpaid' },
        'checkout.session.async_payment_failed',
      ),
    ).toBe('failed');
    expect(
      getPaymentStatusForSession({ status: 'open', payment_status: 'unpaid' }),
    ).toBeNull();
  });
});

describe('fulfillCheckoutSession', () => {
  it('marks the payment succeeded and activates the payment-pending application', async () => {
    responses.payments = [
      { data: payment, error: null },
      { data: null, error: null },
    ];

    const result = await fulfillCheckoutSession(
      paidSession,
      'checkout.session.completed',
    );

    expect(result).toMatchObject({ outcome: 'updated', status: 'succeeded' });
    const paymentUpdate = calls.find(
      (c) => c.table === 'payments' && c.op === 'update',
    );
    expect(paymentUpdate?.payload).toMatchObject({
      status: 'succeeded',
      stripe_payment_intent_id: 'pi_1',
    });
    const activation = calls.find(
      (c) => c.table === 'applications' && c.op === 'update',
    );
    expect(activation?.payload).toEqual({ status: 'active' });
    expect(activation?.filters).toEqual([
      ['id', 'eq', 'app_1'],
      ['status', 'eq', 'payment_pending'],
    ]);
  });

  it('ignores a paid session whose amount does not match the payment record', async () => {
    responses.payments = [{ data: payment, error: null }];

    const result = await fulfillCheckoutSession({
      ...paidSession,
      amount_total: 100,
    });

    expect(result.outcome).toBe('ignored');
    expect(calls.some((c) => c.op === 'update')).toBe(false);
  });

  it('never downgrades a succeeded payment but still finishes activation', async () => {
    responses.payments = [
      { data: { ...payment, status: 'succeeded' }, error: null },
    ];

    const result = await fulfillCheckoutSession(
      { ...paidSession, status: 'expired' },
      'checkout.session.expired',
    );

    expect(result).toMatchObject({ outcome: 'unchanged', status: 'succeeded' });
    expect(calls.some((c) => c.table === 'payments' && c.op === 'update')).toBe(
      false,
    );
    expect(
      calls.some((c) => c.table === 'applications' && c.op === 'update'),
    ).toBe(true);
  });

  it('ignores sessions that point at a different payment record', async () => {
    responses.payments = [
      { data: { ...payment, stripe_session_id: 'cs_other' }, error: null },
    ];

    const result = await fulfillCheckoutSession(paidSession);

    expect(result.outcome).toBe('ignored');
  });

  it('throws on database errors so the webhook returns 5xx and Stripe retries', async () => {
    responses.payments = [
      { data: null, error: { message: 'connection reset' } },
    ];

    await expect(fulfillCheckoutSession(paidSession)).rejects.toThrow(
      'connection reset',
    );
  });
});

describe('startMembershipCheckout', () => {
  it('refuses when the member has no payment-pending application', async () => {
    responses.applications = [
      {
        data: {
          id: 'app_1',
          type: 'individual',
          status: 'active',
          finalized_at: null,
        },
        error: null,
      },
    ];

    const result = await startMembershipCheckout({ userId: 'user_1' });

    expect(result).toEqual({
      ok: false,
      status: 409,
      error: 'There is no membership payment due on your account.',
    });
    expect(calls.some((c) => c.table === 'payments')).toBe(false);
  });

  it('refuses a second payment after one succeeded since the latest approval', async () => {
    responses.applications = [
      {
        data: {
          id: 'app_1',
          type: 'individual',
          status: 'payment_pending',
          finalized_at: '2026-11-01T00:00:00Z',
        },
        error: null,
      },
    ];
    responses.payments = [
      { data: [{ ...payment, status: 'succeeded' }], error: null },
    ];

    const result = await startMembershipCheckout({ userId: 'user_1' });

    expect(result).toMatchObject({ ok: false, status: 409 });
    const lookup = calls.find((c) => c.table === 'payments');
    expect(lookup?.filters).toContainEqual([
      'created_at',
      'gte',
      '2026-11-01T00:00:00Z',
    ]);
  });
});

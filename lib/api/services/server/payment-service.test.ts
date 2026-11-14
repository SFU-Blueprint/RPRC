import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { StripeCheckoutSession } from '@/lib/stripe/server';

type Call = {
  table: string;
  op: string;
  payload?: unknown;
  filters: [string, string, unknown][];
};
type Response = {
  data: unknown;
  error: { message: string; code?: string } | null;
};

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
    in: (column: string, value: unknown) => (
      call.filters.push([column, 'in', value]),
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

const stripe = vi.hoisted(() => ({
  createStripeCheckoutSession: vi.fn(),
  getStripeCheckoutSession: vi.fn(),
  expireStripeCheckoutSession: vi.fn(),
}));
vi.mock('@/lib/stripe/server', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/lib/stripe/server')>()),
  ...stripe,
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
  vi.clearAllMocks();
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

  const pendingApplication = {
    data: {
      id: 'app_1',
      type: 'individual',
      status: 'payment_pending',
      finalized_at: '2026-11-01T00:00:00Z',
    },
    error: null,
  };
  const openPayment = {
    ...payment,
    created_at: '2026-11-02T00:00:00Z',
  };
  const openSession = {
    id: 'cs_1',
    url: 'https://checkout.stripe.com/c/pay/cs_1',
    status: 'open' as const,
  };

  it('refuses a second payment after one succeeded since the latest approval', async () => {
    responses.applications = [pendingApplication];
    responses.payments = [
      {
        data: [{ ...openPayment, status: 'succeeded' }],
        error: null,
      },
    ];

    const result = await startMembershipCheckout({ userId: 'user_1' });

    expect(result).toMatchObject({ ok: false, status: 409 });
    expect(calls.some((c) => c.op === 'insert')).toBe(false);
  });

  it('allows a renewal payment when the only succeeded payment is from before the latest approval', async () => {
    responses.applications = [pendingApplication];
    responses.payments = [
      {
        data: [
          {
            ...openPayment,
            status: 'succeeded',
            created_at: '2025-11-02T00:00:00Z',
          },
        ],
        error: null,
      },
      { data: { ...openPayment, id: 'pay_2' }, error: null },
    ];
    stripe.createStripeCheckoutSession.mockResolvedValue(openSession);

    const result = await startMembershipCheckout({ userId: 'user_1' });

    expect(result).toEqual({ ok: true, url: openSession.url });
    expect(stripe.createStripeCheckoutSession).toHaveBeenCalledWith(
      expect.objectContaining({ paymentId: 'pay_2', amountMinor: 500 }),
    );
  });

  it('reuses the open Checkout Session on a repeat click', async () => {
    responses.applications = [pendingApplication];
    responses.payments = [{ data: [openPayment], error: null }];
    stripe.getStripeCheckoutSession.mockResolvedValue(openSession);

    const result = await startMembershipCheckout({ userId: 'user_1' });

    expect(result).toEqual({ ok: true, url: openSession.url });
    expect(calls.some((c) => c.op === 'insert')).toBe(false);
    expect(stripe.createStripeCheckoutSession).not.toHaveBeenCalled();
  });

  it('cancels an open payment from before the latest approval and starts a new one', async () => {
    responses.applications = [pendingApplication];
    responses.payments = [
      {
        data: [{ ...openPayment, created_at: '2025-11-02T00:00:00Z' }],
        error: null,
      },
      { data: null, error: null }, // cancel
      { data: { ...openPayment, id: 'pay_2' }, error: null }, // insert
    ];
    stripe.createStripeCheckoutSession.mockResolvedValue(openSession);

    const result = await startMembershipCheckout({ userId: 'user_1' });

    expect(result).toMatchObject({ ok: true });
    expect(stripe.expireStripeCheckoutSession).toHaveBeenCalledWith('cs_1');
    const cancel = calls.find(
      (c) => c.op === 'update' && c.filters.some(([, , v]) => v === 'pay_1'),
    );
    expect(cancel?.payload).toMatchObject({ status: 'canceled' });
    expect(calls.some((c) => c.op === 'insert')).toBe(true);
  });

  it('cancels an open payment for a different fee instead of reusing it', async () => {
    responses.applications = [pendingApplication];
    responses.payments = [
      { data: [{ ...openPayment, amount: 4 }], error: null },
      { data: null, error: null }, // cancel
      { data: { ...openPayment, id: 'pay_2' }, error: null }, // insert
    ];
    stripe.createStripeCheckoutSession.mockResolvedValue(openSession);

    const result = await startMembershipCheckout({ userId: 'user_1' });

    expect(result).toMatchObject({ ok: true });
    expect(stripe.getStripeCheckoutSession).not.toHaveBeenCalled();
    expect(stripe.expireStripeCheckoutSession).toHaveBeenCalledWith('cs_1');
    expect(stripe.createStripeCheckoutSession).toHaveBeenCalledWith(
      expect.objectContaining({ paymentId: 'pay_2' }),
    );
  });

  it('refuses while a payment is still processing, even from an earlier round', async () => {
    responses.applications = [pendingApplication];
    responses.payments = [
      {
        data: [
          {
            ...openPayment,
            status: 'processing',
            created_at: '2025-11-02T00:00:00Z',
          },
        ],
        error: null,
      },
    ];

    const result = await startMembershipCheckout({ userId: 'user_1' });

    expect(result).toMatchObject({ ok: false, status: 409 });
  });

  it('uses the payment created by a simultaneous request instead of making a second one', async () => {
    responses.applications = [pendingApplication];
    responses.payments = [
      { data: [], error: null },
      {
        data: null,
        error: { message: 'duplicate key value', code: '23505' },
      },
      { data: openPayment, error: null },
    ];
    stripe.getStripeCheckoutSession.mockResolvedValue(openSession);

    const result = await startMembershipCheckout({ userId: 'user_1' });

    expect(result).toEqual({ ok: true, url: openSession.url });
    expect(stripe.createStripeCheckoutSession).not.toHaveBeenCalled();
    const winnerLookup = calls[calls.length - 1];
    expect(winnerLookup.filters).toContainEqual([
      'status',
      'in',
      ['requires_payment_method', 'processing'],
    ]);
  });

  it('waits for the winning request to store its session before reusing it', async () => {
    responses.applications = [pendingApplication];
    responses.payments = [
      { data: [], error: null },
      { data: null, error: { message: 'duplicate', code: '23505' } },
      { data: { ...openPayment, stripe_session_id: null }, error: null },
      {
        data: { status: 'requires_payment_method', stripe_session_id: 'cs_1' },
        error: null,
      },
    ];
    stripe.getStripeCheckoutSession.mockResolvedValue(openSession);

    const result = await startMembershipCheckout({ userId: 'user_1' });

    expect(result).toEqual({ ok: true, url: openSession.url });
    expect(stripe.getStripeCheckoutSession).toHaveBeenCalledWith('cs_1');
    expect(stripe.createStripeCheckoutSession).not.toHaveBeenCalled();
  });

  it('records a completed session it finds instead of charging again', async () => {
    responses.applications = [pendingApplication];
    responses.payments = [
      { data: [openPayment], error: null },
      { data: payment, error: null }, // fulfillment lookup
      { data: null, error: null }, // fulfillment update
    ];
    stripe.getStripeCheckoutSession.mockResolvedValue(paidSession);

    const result = await startMembershipCheckout({ userId: 'user_1' });

    expect(result).toMatchObject({ ok: false, status: 409 });
    expect(
      calls.some((c) => c.table === 'applications' && c.op === 'update'),
    ).toBe(true);
    expect(calls.some((c) => c.op === 'insert')).toBe(false);
  });

  it('does not start a second payment when the open session cannot be loaded', async () => {
    responses.applications = [pendingApplication];
    responses.payments = [{ data: [openPayment], error: null }];
    stripe.getStripeCheckoutSession.mockRejectedValue(new Error('timeout'));

    const result = await startMembershipCheckout({ userId: 'user_1' });

    expect(result).toMatchObject({ ok: false, status: 502 });
    expect(calls.some((c) => c.op === 'insert')).toBe(false);
  });
});

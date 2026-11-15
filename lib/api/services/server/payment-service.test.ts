import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { StripeCheckoutSession } from '@/types/payment.types';

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
  const filter = (op: string) => (column: string, value: unknown) => (
    call.filters.push([column, op, value]),
    builder
  );
  const builder = {
    select: () => builder,
    insert: (payload: unknown) =>
      Object.assign(call, { op: 'insert', payload }) && builder,
    update: (payload: unknown) =>
      Object.assign(call, { op: 'update', payload }) && builder,
    eq: filter('eq'),
    neq: filter('neq'),
    gte: filter('gte'),
    in: filter('in'),
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

const APPROVED_AT = '2026-11-01T00:00:00Z';
const THIS_ROUND = '2026-11-02T00:00:00Z';
const LAST_ROUND = '2025-11-02T00:00:00Z';

// A payments row as fulfillment reads it.
const payment = {
  id: 'pay_1',
  user_id: 'user_1',
  application_id: 'app_1',
  amount: 5,
  currency: 'CAD',
  status: 'requires_payment_method',
  stripe_session_id: 'cs_1',
  created_at: THIS_ROUND,
};

// A payments row as checkout reads it.
const openPayment = {
  id: 'pay_1',
  status: 'requires_payment_method',
  stripe_session_id: 'cs_1',
  amount: 5,
  created_at: THIS_ROUND,
};

const metadata = {
  payment_id: 'pay_1',
  user_id: 'user_1',
  application_id: 'app_1',
};

const paidSession: StripeCheckoutSession = {
  id: 'cs_1',
  url: null,
  status: 'complete',
  payment_status: 'paid',
  amount_total: 500,
  currency: 'cad',
  payment_intent: 'pi_1',
  metadata,
};

const settlingSession: StripeCheckoutSession = {
  ...paidSession,
  payment_status: 'unpaid',
};

const openSession: StripeCheckoutSession = {
  id: 'cs_1',
  url: 'https://checkout.stripe.com/c/pay/cs_1',
  status: 'open',
  metadata,
};

const pendingApplication = {
  data: {
    id: 'app_1',
    type: 'individual',
    status: 'payment_pending',
    finalized_at: APPROVED_AT,
  },
  error: null,
};

// What activation reads before updating the application.
const activationLookup = {
  data: { status: 'payment_pending', finalized_at: APPROVED_AT },
  error: null,
};

const ok = { data: null, error: null };
const uniqueViolation = {
  data: null,
  error: { message: 'duplicate key value', code: '23505' },
};

const updates = (table: string) =>
  calls.filter((c) => c.table === table && c.op === 'update');
const inserted = () => calls.some((c) => c.op === 'insert');
const activated = () =>
  updates('applications').some(
    (c) => (c.payload as { status?: string })?.status === 'active',
  );

beforeEach(() => {
  calls.length = 0;
  responses = {};
  vi.resetAllMocks();
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
    responses.payments = [{ data: payment, error: null }, ok];
    responses.applications = [activationLookup, ok];

    const result = await fulfillCheckoutSession(
      paidSession,
      'checkout.session.completed',
    );

    expect(result).toMatchObject({ outcome: 'updated', status: 'succeeded' });
    expect(updates('payments')[0]?.payload).toMatchObject({
      status: 'succeeded',
      stripe_payment_intent_id: 'pi_1',
    });
    const activation = updates('applications')[0];
    expect(activation?.payload).toEqual({ status: 'active' });
    expect(activation?.filters).toEqual([
      ['id', 'eq', 'app_1'],
      ['status', 'eq', 'payment_pending'],
    ]);
  });

  it('records but does not activate a payment from an earlier approval round', async () => {
    responses.payments = [
      { data: { ...payment, created_at: LAST_ROUND }, error: null },
      ok,
    ];
    responses.applications = [activationLookup];

    const result = await fulfillCheckoutSession(paidSession);

    expect(result).toMatchObject({ status: 'succeeded' });
    expect(updates('payments')).toHaveLength(1);
    expect(activated()).toBe(false);
  });

  it('activates a payment made at an older fee in the current round', async () => {
    // The fee went up after the member paid; they paid the amount they were quoted.
    responses.payments = [{ data: { ...payment, amount: 4 }, error: null }, ok];
    responses.applications = [activationLookup, ok];

    const result = await fulfillCheckoutSession({
      ...paidSession,
      amount_total: 400,
    });

    expect(result).toMatchObject({ status: 'succeeded' });
    expect(activated()).toBe(true);
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
    responses.applications = [activationLookup, ok];

    const result = await fulfillCheckoutSession(
      { ...paidSession, status: 'expired' },
      'checkout.session.expired',
    );

    expect(result).toMatchObject({ outcome: 'unchanged', status: 'succeeded' });
    expect(updates('payments')).toHaveLength(0);
    expect(activated()).toBe(true);
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

  it('retires a newer open payment when a retired bank debit starts settling', async () => {
    responses.payments = [
      { data: { ...payment, status: 'canceled' }, error: null }, // lookup
      uniqueViolation, // move to processing: a newer payment is open
      { data: { id: 'pay_2', stripe_session_id: 'cs_2' }, error: null }, // newer
      ok, // cancel newer
      ok, // retry move to processing
    ];
    stripe.getStripeCheckoutSession.mockResolvedValue({
      id: 'cs_2',
      url: 'https://checkout.stripe.com/c/pay/cs_2',
      status: 'open',
      metadata: { ...metadata, payment_id: 'pay_2' },
    });

    const result = await fulfillCheckoutSession(
      settlingSession,
      'checkout.session.completed',
    );

    expect(result).toMatchObject({ outcome: 'updated', status: 'processing' });
    expect(stripe.expireStripeCheckoutSession).toHaveBeenCalledWith('cs_2');
    const [, cancel, retry] = updates('payments');
    expect(cancel.payload).toMatchObject({ status: 'canceled' });
    expect(cancel.filters).toContainEqual(['id', 'eq', 'pay_2']);
    expect(retry.payload).toMatchObject({ status: 'processing' });
  });

  it('throws (so Stripe retries) when the newer open payment cannot be expired', async () => {
    responses.payments = [
      { data: { ...payment, status: 'canceled' }, error: null },
      uniqueViolation,
      { data: { id: 'pay_2', stripe_session_id: 'cs_2' }, error: null },
    ];
    stripe.getStripeCheckoutSession.mockResolvedValue({
      ...openSession,
      id: 'cs_2',
      metadata: { ...metadata, payment_id: 'pay_2' },
    });
    stripe.expireStripeCheckoutSession.mockRejectedValue(new Error('timeout'));

    await expect(
      fulfillCheckoutSession(settlingSession, 'checkout.session.completed'),
    ).rejects.toThrow('Stripe will retry');
    expect(updates('payments')).toHaveLength(1);
  });

  it('flags a refund instead of failing forever when both payments are in flight', async () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    responses.payments = [
      { data: { ...payment, status: 'canceled' }, error: null },
      uniqueViolation,
      { data: null, error: null }, // no requires_payment_method row: the other is processing
      uniqueViolation,
    ];

    const result = await fulfillCheckoutSession(
      settlingSession,
      'checkout.session.completed',
    );

    expect(result.outcome).toBe('ignored');
    expect(errorSpy).toHaveBeenCalledWith(
      expect.stringContaining('Refund one'),
      expect.objectContaining({ paymentId: 'pay_1' }),
    );
    errorSpy.mockRestore();
  });

  it('records both and flags a refund when the newer session in a processing conflict was already paid', async () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    responses.payments = [
      { data: { ...payment, status: 'canceled' }, error: null }, // pay_1 lookup
      uniqueViolation, // pay_1 → processing conflicts with the open pay_2
      { data: { id: 'pay_2', stripe_session_id: 'cs_2' }, error: null }, // newer
      {
        data: { ...payment, id: 'pay_2', stripe_session_id: 'cs_2' },
        error: null,
      }, // pay_2 lookup (nested fulfillment)
      ok, // pay_2 → succeeded
      { data: [], error: null }, // duplicate check while recording pay_2
      ok, // retry pay_1 → processing
    ];
    responses.applications = [activationLookup, ok];
    stripe.getStripeCheckoutSession.mockResolvedValue({
      ...paidSession,
      id: 'cs_2',
      metadata: { ...metadata, payment_id: 'pay_2' },
    });

    const result = await fulfillCheckoutSession(
      settlingSession,
      'checkout.session.completed',
    );

    expect(result).toMatchObject({ outcome: 'updated', status: 'processing' });
    expect(stripe.expireStripeCheckoutSession).not.toHaveBeenCalled();
    const [, newerPaid, retry] = updates('payments');
    expect(newerPaid.payload).toMatchObject({ status: 'succeeded' });
    expect(retry.payload).toMatchObject({ status: 'processing' });
    expect(errorSpy).toHaveBeenCalledWith(
      expect.stringContaining('Refund one'),
      { paymentId: 'pay_1', otherPaymentId: 'pay_2' },
    );
    errorSpy.mockRestore();
  });

  it('flags a refund when a second payment for the round succeeds after the membership activated', async () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    responses.payments = [
      { data: { ...payment, status: 'processing' }, error: null },
      ok, // → succeeded
      { data: [{ id: 'pay_2' }], error: null }, // pay_2 already succeeded this round
    ];
    responses.applications = [
      { data: { status: 'active', finalized_at: APPROVED_AT }, error: null },
    ];

    const result = await fulfillCheckoutSession(
      paidSession,
      'checkout.session.async_payment_succeeded',
    );

    expect(result).toMatchObject({ outcome: 'updated', status: 'succeeded' });
    expect(activated()).toBe(false);
    const duplicateCheck = calls.filter((c) => c.table === 'payments')[2];
    expect(duplicateCheck.filters).toEqual(
      expect.arrayContaining([
        ['status', 'eq', 'succeeded'],
        ['id', 'neq', 'pay_1'],
        ['created_at', 'gte', APPROVED_AT],
      ]),
    );
    expect(errorSpy).toHaveBeenCalledWith(
      expect.stringContaining('Refund one'),
      { paymentId: 'pay_1', otherPaymentIds: ['pay_2'] },
    );
    errorSpy.mockRestore();
  });

  it('does not repeat the refund flag when a retry finds the payment already recorded', async () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    responses.payments = [
      { data: { ...payment, status: 'succeeded' }, error: null },
    ];
    responses.applications = [
      { data: { status: 'active', finalized_at: APPROVED_AT }, error: null },
    ];

    await fulfillCheckoutSession(paidSession);

    expect(calls.filter((c) => c.table === 'payments')).toHaveLength(1);
    expect(errorSpy).not.toHaveBeenCalled();
    errorSpy.mockRestore();
  });
});

describe('startMembershipCheckout', () => {
  it('refuses when the member has no payment-pending application', async () => {
    responses.applications = [
      {
        data: { ...pendingApplication.data, status: 'active' },
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

  it('refuses a second payment after one succeeded this round, and finishes activation', async () => {
    responses.applications = [pendingApplication, activationLookup, ok];
    responses.payments = [
      { data: [{ ...openPayment, status: 'succeeded' }], error: null },
    ];

    const result = await startMembershipCheckout({ userId: 'user_1' });

    expect(result).toMatchObject({ ok: false, status: 409 });
    expect(inserted()).toBe(false);
    expect(activated()).toBe(true);
  });

  it('allows a renewal payment when the only succeeded payment is from an earlier round', async () => {
    responses.applications = [pendingApplication];
    responses.payments = [
      {
        data: [{ ...openPayment, status: 'succeeded', created_at: LAST_ROUND }],
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
    expect(inserted()).toBe(false);
    expect(stripe.createStripeCheckoutSession).not.toHaveBeenCalled();
  });

  it('retires an open payment from an earlier round and starts a new one', async () => {
    responses.applications = [pendingApplication];
    responses.payments = [
      { data: [{ ...openPayment, created_at: LAST_ROUND }], error: null },
      ok, // cancel
      { data: { ...openPayment, id: 'pay_2' }, error: null }, // insert
    ];
    stripe.getStripeCheckoutSession.mockResolvedValue(openSession);
    stripe.createStripeCheckoutSession.mockResolvedValue(openSession);

    const result = await startMembershipCheckout({ userId: 'user_1' });

    expect(result).toMatchObject({ ok: true });
    expect(stripe.expireStripeCheckoutSession).toHaveBeenCalledWith('cs_1');
    expect(updates('payments')[0]?.payload).toMatchObject({
      status: 'canceled',
    });
    expect(inserted()).toBe(true);
  });

  it('retires an open payment for a different fee instead of reusing it', async () => {
    responses.applications = [pendingApplication];
    responses.payments = [
      { data: [{ ...openPayment, amount: 4 }], error: null },
      ok, // cancel
      { data: { ...openPayment, id: 'pay_2' }, error: null }, // insert
    ];
    stripe.getStripeCheckoutSession.mockResolvedValue(openSession);
    stripe.createStripeCheckoutSession.mockResolvedValue(openSession);

    const result = await startMembershipCheckout({ userId: 'user_1' });

    expect(result).toMatchObject({ ok: true });
    expect(stripe.expireStripeCheckoutSession).toHaveBeenCalledWith('cs_1');
    expect(stripe.createStripeCheckoutSession).toHaveBeenCalledWith(
      expect.objectContaining({ paymentId: 'pay_2' }),
    );
  });

  it('does not charge again when the fee changed after paying and the webhook was missed', async () => {
    responses.applications = [pendingApplication, activationLookup, ok];
    responses.payments = [
      { data: [{ ...openPayment, amount: 4 }], error: null }, // checkout list
      { data: { ...payment, amount: 4 }, error: null }, // fulfillment lookup
      ok, // fulfillment update
    ];
    stripe.getStripeCheckoutSession.mockResolvedValue({
      ...paidSession,
      amount_total: 400,
    });

    const result = await startMembershipCheckout({ userId: 'user_1' });

    expect(result).toMatchObject({ ok: false, status: 409 });
    expect(stripe.expireStripeCheckoutSession).not.toHaveBeenCalled();
    expect(inserted()).toBe(false);
    expect(activated()).toBe(true);
  });

  it('does not start a new payment while an old bank debit is still settling', async () => {
    responses.applications = [pendingApplication];
    responses.payments = [
      { data: [{ ...openPayment, created_at: LAST_ROUND }], error: null },
      { data: { ...payment, created_at: LAST_ROUND }, error: null },
      ok, // fulfillment: move to processing
    ];
    stripe.getStripeCheckoutSession.mockResolvedValue(settlingSession);

    const result = await startMembershipCheckout({ userId: 'user_1' });

    expect(result).toMatchObject({ ok: false, status: 409 });
    expect(updates('payments')[0]?.payload).toMatchObject({
      status: 'processing',
    });
    expect(inserted()).toBe(false);
  });

  it('records an earlier round payment found paid, then charges for this round', async () => {
    responses.applications = [pendingApplication, activationLookup];
    responses.payments = [
      { data: [{ ...openPayment, created_at: LAST_ROUND }], error: null },
      { data: { ...payment, created_at: LAST_ROUND }, error: null },
      ok, // fulfillment: succeeded
      { data: { ...openPayment, id: 'pay_2' }, error: null }, // insert
    ];
    stripe.getStripeCheckoutSession.mockResolvedValue(paidSession);
    stripe.createStripeCheckoutSession.mockResolvedValue(openSession);

    const result = await startMembershipCheckout({ userId: 'user_1' });

    expect(result).toMatchObject({ ok: true });
    expect(activated()).toBe(false);
    expect(inserted()).toBe(true);
  });

  it('keeps the old payment open and refuses when its session cannot be expired', async () => {
    responses.applications = [pendingApplication];
    responses.payments = [
      { data: [{ ...openPayment, created_at: LAST_ROUND }], error: null },
    ];
    stripe.getStripeCheckoutSession.mockResolvedValue(openSession);
    stripe.expireStripeCheckoutSession.mockRejectedValue(new Error('timeout'));

    const result = await startMembershipCheckout({ userId: 'user_1' });

    expect(result).toMatchObject({ ok: false, status: 502 });
    expect(updates('payments')).toHaveLength(0);
    expect(inserted()).toBe(false);
  });

  it('refuses without cancelling when the old session cannot be loaded', async () => {
    responses.applications = [pendingApplication];
    responses.payments = [
      { data: [{ ...openPayment, created_at: LAST_ROUND }], error: null },
    ];
    stripe.getStripeCheckoutSession.mockRejectedValue(new Error('timeout'));

    const result = await startMembershipCheckout({ userId: 'user_1' });

    expect(result).toMatchObject({ ok: false, status: 502 });
    expect(stripe.expireStripeCheckoutSession).not.toHaveBeenCalled();
    expect(updates('payments')).toHaveLength(0);
  });

  it('refuses without cancelling when the session belongs to a different payment', async () => {
    responses.applications = [pendingApplication];
    responses.payments = [
      { data: [{ ...openPayment, created_at: LAST_ROUND }], error: null },
    ];
    stripe.getStripeCheckoutSession.mockResolvedValue({
      ...openSession,
      metadata: { ...metadata, payment_id: 'pay_other' },
    });

    const result = await startMembershipCheckout({ userId: 'user_1' });

    expect(result).toMatchObject({ ok: false, status: 502 });
    expect(stripe.expireStripeCheckoutSession).not.toHaveBeenCalled();
    expect(updates('payments')).toHaveLength(0);
  });

  it('refuses while a payment is still processing, even from an earlier round', async () => {
    responses.applications = [pendingApplication];
    responses.payments = [
      {
        data: [
          { ...openPayment, status: 'processing', created_at: LAST_ROUND },
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
      uniqueViolation,
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
      uniqueViolation,
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
    responses.applications = [pendingApplication, activationLookup, ok];
    responses.payments = [
      { data: [openPayment], error: null },
      { data: payment, error: null }, // fulfillment lookup
      ok, // fulfillment update
    ];
    stripe.getStripeCheckoutSession.mockResolvedValue(paidSession);

    const result = await startMembershipCheckout({ userId: 'user_1' });

    expect(result).toMatchObject({ ok: false, status: 409 });
    expect(activated()).toBe(true);
    expect(inserted()).toBe(false);
  });

  it('does not start a second payment when the open session cannot be loaded', async () => {
    responses.applications = [pendingApplication];
    responses.payments = [{ data: [openPayment], error: null }];
    stripe.getStripeCheckoutSession.mockRejectedValue(new Error('timeout'));

    const result = await startMembershipCheckout({ userId: 'user_1' });

    expect(result).toMatchObject({ ok: false, status: 502 });
    expect(inserted()).toBe(false);
  });

  it('shows members a generic message when Stripe refuses to create the session', async () => {
    responses.applications = [pendingApplication];
    responses.payments = [
      { data: [], error: null },
      { data: { ...openPayment, id: 'pay_2' }, error: null }, // insert
      ok, // mark failed
    ];
    stripe.createStripeCheckoutSession.mockRejectedValue(
      new Error('Invalid API Key provided'),
    );

    const result = await startMembershipCheckout({ userId: 'user_1' });

    expect(result).toEqual({
      ok: false,
      status: 502,
      error: 'Checkout could not be started. Please try again.',
    });
    expect(updates('payments')[0]?.payload).toMatchObject({
      status: 'failed',
    });
  });
});

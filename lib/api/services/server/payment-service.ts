import { createAdminClient } from '@/lib/supabase/admin';
import {
  createStripeCheckoutSession,
  expireStripeCheckoutSession,
  getMembershipFee,
  getStripeCheckoutSession,
  PAYMENT_CURRENCY,
  type StripeCheckoutSession,
} from '@/lib/stripe/server';
import {
  ApplicationStatus,
  PaymentTransactionStatus,
  type ApplicationType,
} from '@/lib/constants/enums';

type CheckoutResult =
  | { ok: true; url: string }
  | { ok: false; status: number; error: string };

type AdminClient = ReturnType<typeof createAdminClient>;

type PaymentRow = {
  id: string;
  status: PaymentTransactionStatus;
  stripe_session_id: string | null;
  amount: number;
  created_at: string;
};

type CheckoutContext = {
  admin: AdminClient;
  application: { id: string; type: ApplicationType };
  fee: number;
  userId: string;
  email?: string | null;
  requestOrigin?: string;
};

const PAYMENT_COLUMNS = 'id, status, stripe_session_id, amount, created_at';

// Postgres unique_violation: payments_one_open_per_application allows one open payment
// per application, so a second simultaneous insert fails with this code.
const UNIQUE_VIOLATION = '23505';

// How long a request that lost the insert race waits for the winner to store its
// Checkout Session id before creating (the same, idempotent) session itself.
const SESSION_WAIT_ATTEMPTS = 6;
const SESSION_WAIT_MS = 500;

const ALREADY_PAID: CheckoutResult = {
  ok: false,
  status: 409,
  error:
    'A payment for this membership has already been received or is still processing.',
};

const CHECKOUT_FAILED: CheckoutResult = {
  ok: false,
  status: 502,
  error: 'Checkout could not be started. Please try again.',
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Creates (or reuses) a Stripe Checkout Session for the member's payment-pending application
 * and records it in `payments`. The amount is derived server-side from the application type.
 *
 * An application has at most one open payment (enforced by a unique index), so repeat or
 * simultaneous clicks all end up on the same payments row and the same Checkout Session.
 */
export async function startMembershipCheckout(input: {
  userId: string;
  email?: string | null;
  requestOrigin?: string;
}): Promise<CheckoutResult> {
  const admin = createAdminClient();

  const { data: application, error: applicationError } = await admin
    .from('applications')
    .select('id, type, status, finalized_at')
    .eq('user_id', input.userId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (applicationError) {
    console.error(
      '[payments] application lookup failed:',
      applicationError.message,
    );
    return {
      ok: false,
      status: 500,
      error: 'Your membership could not be loaded. Please try again.',
    };
  }
  if (
    !application ||
    application.status !== ApplicationStatus.PAYMENT_PENDING
  ) {
    return {
      ok: false,
      status: 409,
      error: 'There is no membership payment due on your account.',
    };
  }

  const { data: payments, error: paymentsError } = await admin
    .from('payments')
    .select(PAYMENT_COLUMNS)
    .eq('application_id', application.id)
    .order('created_at', { ascending: false });
  if (paymentsError) {
    console.error('[payments] payment lookup failed:', paymentsError.message);
    return {
      ok: false,
      status: 500,
      error: 'Your payment history could not be loaded. Please try again.',
    };
  }

  // Applications are reused for renewals, so only payments since the latest approval
  // count as paying for this round.
  const approvedAt = application.finalized_at
    ? new Date(application.finalized_at).getTime()
    : null;
  const isCurrentRound = (payment: PaymentRow) =>
    approvedAt === null || new Date(payment.created_at).getTime() >= approvedAt;

  const rows = (payments ?? []) as PaymentRow[];
  if (
    rows.some(
      (payment) =>
        payment.status === PaymentTransactionStatus.PROCESSING ||
        (payment.status === PaymentTransactionStatus.SUCCEEDED &&
          isCurrentRound(payment)),
    )
  ) {
    return ALREADY_PAID;
  }

  const context: CheckoutContext = {
    admin,
    application: {
      id: application.id,
      type: application.type as ApplicationType,
    },
    fee: getMembershipFee(application.type as ApplicationType),
    userId: input.userId,
    email: input.email,
    requestOrigin: input.requestOrigin,
  };

  const open = rows.find(
    (payment) =>
      payment.status === PaymentTransactionStatus.REQUIRES_PAYMENT_METHOD,
  );
  if (open) {
    // An open payment from before the latest approval, or for a different fee, can't be
    // reused. Retire it so it stops blocking a new one.
    if (!isCurrentRound(open) || Number(open.amount) !== context.fee) {
      await retireOpenPayment(admin, open);
    } else {
      const reused = await reuseOpenPayment(context, open);
      if (reused) return reused;
    }
  }

  const { data: inserted, error: insertError } = await admin
    .from('payments')
    .insert({
      user_id: input.userId,
      application_id: application.id,
      amount: context.fee,
      currency: PAYMENT_CURRENCY.toUpperCase(),
      status: PaymentTransactionStatus.REQUIRES_PAYMENT_METHOD,
    })
    .select(PAYMENT_COLUMNS)
    .single();

  if (insertError?.code === UNIQUE_VIOLATION) {
    // Another request created the open payment first. Use that one.
    const { data: winner, error: winnerError } = await admin
      .from('payments')
      .select(PAYMENT_COLUMNS)
      .eq('application_id', application.id)
      .in('status', [
        PaymentTransactionStatus.REQUIRES_PAYMENT_METHOD,
        PaymentTransactionStatus.PROCESSING,
      ])
      .maybeSingle();
    if (winnerError || !winner) {
      console.error(
        '[payments] could not load the open payment after a conflict:',
        winnerError?.message,
      );
      return CHECKOUT_FAILED;
    }
    if (winner.status === PaymentTransactionStatus.PROCESSING)
      return ALREADY_PAID;
    return (
      (await reuseOpenPayment(context, winner as PaymentRow)) ?? CHECKOUT_FAILED
    );
  }

  if (insertError || !inserted) {
    console.error(
      '[payments] could not create payment record:',
      insertError?.message,
    );
    return {
      ok: false,
      status: 500,
      error: 'Checkout could not be started. Please try again.',
    };
  }

  return createSessionForPayment(context, inserted.id, { ownsPayment: true });
}

/**
 * Returns the Checkout Session URL for an open payment of the current round, creating the
 * session if it doesn't exist yet. Returns null if the payment turned out to be expired and
 * was canceled, so the caller can create a new one.
 */
async function reuseOpenPayment(
  context: CheckoutContext,
  payment: PaymentRow,
): Promise<CheckoutResult | null> {
  let sessionId = payment.stripe_session_id;

  // A payment without a session id is usually one another request is still setting up.
  // Give it a moment, then fall back to creating the session ourselves: the Stripe call
  // uses the payment id as its idempotency key, so both requests get the same session.
  for (
    let attempt = 0;
    !sessionId && attempt < SESSION_WAIT_ATTEMPTS;
    attempt++
  ) {
    await sleep(SESSION_WAIT_MS);
    const { data } = await context.admin
      .from('payments')
      .select('status, stripe_session_id')
      .eq('id', payment.id)
      .maybeSingle();
    if (!data) break;
    if (data.status === PaymentTransactionStatus.PROCESSING)
      return ALREADY_PAID;
    if (data.status !== PaymentTransactionStatus.REQUIRES_PAYMENT_METHOD)
      return null;
    sessionId = data.stripe_session_id;
  }

  if (!sessionId)
    return createSessionForPayment(context, payment.id, {
      ownsPayment: false,
    });

  try {
    const session = await getStripeCheckoutSession(sessionId);
    if (session.status === 'open' && session.url)
      return { ok: true, url: session.url };
    if (session.status === 'complete') {
      // Paid (or settling) but not recorded yet: record it now instead of charging again.
      await fulfillCheckoutSession(session);
      return ALREADY_PAID;
    }
    await markCanceled(context.admin, payment.id);
    return null;
  } catch (error) {
    // Don't fall through to a new payment: the open one may still be payable.
    console.error(
      '[payments] could not load the open Checkout Session:',
      error,
    );
    return CHECKOUT_FAILED;
  }
}

/** Expires an open payment's Checkout Session (if any) and marks the payment canceled. */
async function retireOpenPayment(admin: AdminClient, payment: PaymentRow) {
  if (payment.stripe_session_id) {
    try {
      await expireStripeCheckoutSession(payment.stripe_session_id);
    } catch (error) {
      // Usually means the session already expired or completed. If it was paid,
      // fulfillment still records it, because canceled payments can move to succeeded.
      console.warn('[payments] could not expire old Checkout Session:', error);
    }
  }
  await markCanceled(admin, payment.id);
}

async function markCanceled(admin: AdminClient, paymentId: string) {
  const { error } = await admin
    .from('payments')
    .update({
      status: PaymentTransactionStatus.CANCELED,
      updated_at: new Date().toISOString(),
    })
    .eq('id', paymentId)
    .eq('status', PaymentTransactionStatus.REQUIRES_PAYMENT_METHOD);
  if (error)
    console.error('[payments] could not cancel payment:', error.message);
}

async function createSessionForPayment(
  context: CheckoutContext,
  paymentId: string,
  { ownsPayment }: { ownsPayment: boolean },
): Promise<CheckoutResult> {
  try {
    const session = await createStripeCheckoutSession({
      paymentId,
      applicationId: context.application.id,
      userId: context.userId,
      membershipType: context.application.type,
      amountMinor: Math.round(context.fee * 100),
      customerEmail: context.email,
      requestOrigin: context.requestOrigin,
    });

    const { error: sessionUpdateError } = await context.admin
      .from('payments')
      .update({
        stripe_session_id: session.id,
        updated_at: new Date().toISOString(),
      })
      .eq('id', paymentId);
    if (sessionUpdateError) {
      // Fulfillment matches on metadata.payment_id and backfills the session id, so this is recoverable.
      console.error(
        '[payments] could not store Checkout Session id:',
        sessionUpdateError.message,
      );
    }

    return { ok: true, url: session.url! };
  } catch (error) {
    console.error('[payments] Stripe session creation failed:', error);
    // Only the request that created the payment marks it failed. Another request's
    // failure (for example Stripe refusing a simultaneous call with the same
    // idempotency key) says nothing about whether the payment itself is usable.
    if (ownsPayment) {
      await context.admin
        .from('payments')
        .update({
          status: PaymentTransactionStatus.FAILED,
          updated_at: new Date().toISOString(),
        })
        .eq('id', paymentId);
      return {
        ok: false,
        status: 502,
        error:
          'Stripe could not start checkout. Check the Stripe server key and site URL.',
      };
    }
    return CHECKOUT_FAILED;
  }
}

/**
 * Maps a Checkout Session (and optionally the webhook event that delivered it) to a
 * `payment_transaction_status`. Returns null when the session gives no new information.
 */
export function getPaymentStatusForSession(
  session: Pick<StripeCheckoutSession, 'status' | 'payment_status'>,
  eventType?: string,
): PaymentTransactionStatus | null {
  if (eventType === 'checkout.session.async_payment_failed')
    return PaymentTransactionStatus.FAILED;
  if (
    eventType === 'checkout.session.expired' ||
    session.status === 'expired'
  ) {
    return PaymentTransactionStatus.CANCELED;
  }
  if (
    session.payment_status === 'paid' ||
    session.payment_status === 'no_payment_required'
  ) {
    return PaymentTransactionStatus.SUCCEEDED;
  }
  // Completed but unpaid means a delayed payment method (e.g. bank debit) is still settling.
  if (session.status === 'complete') return PaymentTransactionStatus.PROCESSING;
  return null;
}

export type FulfillmentResult =
  | {
      outcome: 'updated' | 'unchanged';
      status: PaymentTransactionStatus;
      userId: string;
    }
  | { outcome: 'ignored'; reason: string };

/**
 * Records a Checkout Session's outcome on its `payments` row and, once paid, activates the
 * membership. Idempotent: safe to call from both the webhook and the return page, and on retries.
 * Throws on database errors so webhook callers can return a 5xx and let Stripe retry.
 */
export async function fulfillCheckoutSession(
  session: StripeCheckoutSession,
  eventType?: string,
): Promise<FulfillmentResult> {
  const paymentId = session.metadata?.payment_id ?? session.client_reference_id;
  if (!paymentId)
    return {
      outcome: 'ignored',
      reason: 'Checkout Session has no payment_id.',
    };

  const admin = createAdminClient();
  const { data: payment, error: paymentError } = await admin
    .from('payments')
    .select(
      'id, user_id, application_id, amount, currency, status, stripe_session_id',
    )
    .eq('id', paymentId)
    .maybeSingle();

  if (paymentError)
    throw new Error(`Payment lookup failed: ${paymentError.message}`);
  if (!payment)
    return { outcome: 'ignored', reason: `No payment ${paymentId}.` };
  if (payment.stripe_session_id && payment.stripe_session_id !== session.id) {
    return {
      outcome: 'ignored',
      reason: 'Checkout Session does not match the payment record.',
    };
  }

  const nextStatus = getPaymentStatusForSession(session, eventType);
  if (!nextStatus)
    return {
      outcome: 'unchanged',
      status: payment.status,
      userId: payment.user_id,
    };

  if (nextStatus === PaymentTransactionStatus.SUCCEEDED) {
    const expectedMinor = Math.round(Number(payment.amount) * 100);
    const currencyMatches =
      (session.currency ?? '').toLowerCase() === payment.currency.toLowerCase();
    if (session.amount_total !== expectedMinor || !currencyMatches) {
      console.error('[payments] amount mismatch', {
        paymentId,
        expected: `${expectedMinor} ${payment.currency}`,
        received: `${session.amount_total} ${session.currency}`,
      });
      return {
        outcome: 'ignored',
        reason: 'Paid amount does not match the payment record.',
      };
    }
  }

  // Never move a succeeded payment backwards (events can arrive out of order).
  const alreadySucceeded =
    payment.status === PaymentTransactionStatus.SUCCEEDED;
  const changed = !alreadySucceeded && payment.status !== nextStatus;

  if (changed || !payment.stripe_session_id) {
    const paymentIntentId =
      typeof session.payment_intent === 'string'
        ? session.payment_intent
        : session.payment_intent?.id;
    const { error: updateError } = await admin
      .from('payments')
      .update({
        status: alreadySucceeded ? payment.status : nextStatus,
        stripe_session_id: session.id,
        ...(paymentIntentId
          ? { stripe_payment_intent_id: paymentIntentId }
          : {}),
        updated_at: new Date().toISOString(),
      })
      .eq('id', payment.id);
    if (updateError)
      throw new Error(`Payment update failed: ${updateError.message}`);
  }

  const finalStatus = alreadySucceeded ? payment.status : nextStatus;
  if (
    finalStatus === PaymentTransactionStatus.SUCCEEDED &&
    payment.application_id
  ) {
    // Runs on every call (not only on change) so a retry can finish a half-applied fulfillment.
    const { error: activationError } = await admin
      .from('applications')
      .update({ status: ApplicationStatus.ACTIVE })
      .eq('id', payment.application_id)
      .eq('status', ApplicationStatus.PAYMENT_PENDING);
    if (activationError)
      throw new Error(
        `Membership activation failed: ${activationError.message}`,
      );
  }

  return {
    outcome: changed ? 'updated' : 'unchanged',
    status: finalStatus,
    userId: payment.user_id,
  };
}

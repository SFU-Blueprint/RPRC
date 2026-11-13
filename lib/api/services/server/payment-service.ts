import { createAdminClient } from '@/lib/supabase/admin';
import {
  createStripeCheckoutSession,
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

const FINAL_OR_IN_FLIGHT: PaymentTransactionStatus[] = [
  PaymentTransactionStatus.SUCCEEDED,
  PaymentTransactionStatus.PROCESSING,
];

/**
 * Creates (or reuses) a Stripe Checkout Session for the member's payment-pending application
 * and records it in `payments`. The amount is derived server-side from the application type.
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

  // Applications are reused for renewals, so only payments since the latest approval count.
  let paymentsQuery = admin
    .from('payments')
    .select('id, status, stripe_session_id, amount, created_at')
    .eq('application_id', application.id)
    .order('created_at', { ascending: false });
  if (application.finalized_at)
    paymentsQuery = paymentsQuery.gte('created_at', application.finalized_at);

  const { data: payments, error: paymentsError } = await paymentsQuery;
  if (paymentsError) {
    console.error('[payments] payment lookup failed:', paymentsError.message);
    return {
      ok: false,
      status: 500,
      error: 'Your payment history could not be loaded. Please try again.',
    };
  }

  if (
    payments?.some((payment) => FINAL_OR_IN_FLIGHT.includes(payment.status))
  ) {
    return {
      ok: false,
      status: 409,
      error:
        'A payment for this membership has already been received or is still processing.',
    };
  }

  const fee = getMembershipFee(application.type as ApplicationType);

  // Reuse a still-open Checkout Session instead of creating duplicates on repeat clicks.
  const pending = payments?.find(
    (payment) =>
      payment.status === PaymentTransactionStatus.REQUIRES_PAYMENT_METHOD &&
      payment.stripe_session_id &&
      Number(payment.amount) === fee,
  );
  if (pending?.stripe_session_id) {
    try {
      const existing = await getStripeCheckoutSession(
        pending.stripe_session_id,
      );
      if (existing.status === 'open' && existing.url)
        return { ok: true, url: existing.url };
      if (existing.status === 'expired') {
        await admin
          .from('payments')
          .update({
            status: PaymentTransactionStatus.CANCELED,
            updated_at: new Date().toISOString(),
          })
          .eq('id', pending.id)
          .eq('status', PaymentTransactionStatus.REQUIRES_PAYMENT_METHOD);
      }
    } catch (error) {
      console.warn(
        '[payments] could not reuse existing Checkout Session:',
        error,
      );
    }
  }

  const { data: payment, error: insertError } = await admin
    .from('payments')
    .insert({
      user_id: input.userId,
      application_id: application.id,
      amount: fee,
      currency: PAYMENT_CURRENCY.toUpperCase(),
      status: PaymentTransactionStatus.REQUIRES_PAYMENT_METHOD,
    })
    .select('id')
    .single();

  if (insertError || !payment) {
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

  try {
    const session = await createStripeCheckoutSession({
      paymentId: payment.id,
      applicationId: application.id,
      userId: input.userId,
      membershipType: application.type as ApplicationType,
      amountMinor: Math.round(fee * 100),
      customerEmail: input.email,
      requestOrigin: input.requestOrigin,
    });

    const { error: sessionUpdateError } = await admin
      .from('payments')
      .update({
        stripe_session_id: session.id,
        updated_at: new Date().toISOString(),
      })
      .eq('id', payment.id);
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
    await admin
      .from('payments')
      .update({
        status: PaymentTransactionStatus.FAILED,
        updated_at: new Date().toISOString(),
      })
      .eq('id', payment.id);
    return {
      ok: false,
      status: 502,
      error:
        'Stripe could not start checkout. Check the Stripe server key and site URL.',
    };
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

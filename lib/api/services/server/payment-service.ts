import {
  createAdminClient,
  type SupabaseAdminClient,
} from '@/lib/supabase/admin';
import {
  createStripeCheckoutSession,
  expireStripeCheckoutSession,
  getMembershipFee,
  getStripeCheckoutSession,
} from '@/lib/stripe/server';
import {
  ApplicationStatus,
  PaymentTransactionStatus,
  type ApplicationType,
} from '@/lib/constants/enums';
import { PaymentErrorMessage } from '@/lib/constants/payments';
import { PAYMENT_CURRENCY } from '@/lib/constants/processing-fees';
import type {
  CheckoutResult,
  FulfillmentResult,
  PaymentRow,
  StripeCheckoutSession,
} from '@/types/payment.types';

type CheckoutContext = {
  admin: SupabaseAdminClient;
  application: { id: string; type: ApplicationType };
  fee: number;
  userId: string;
  email?: string | null;
  requestOrigin?: string;
};

/** What happened when an open payment was retired. */
type RetireOutcome =
  /** The session was expired (or never existed) and the payment is now canceled. */
  | { kind: 'canceled' }
  /** The session had already been completed, so it was recorded instead. */
  | { kind: 'recorded'; result: FulfillmentResult }
  /** The session's state couldn't be confirmed or changed. The payment is left open. */
  | { kind: 'failed' };

const PAYMENT_COLUMNS = 'id, status, stripe_session_id, amount, created_at';

// Postgres unique_violation: payments_one_open_per_application allows one open payment
// (requires_payment_method or processing) per application.
const UNIQUE_VIOLATION = '23505';

// How long a request that lost the insert race waits for the winner to store its
// Checkout Session id before creating (the same, idempotent) session itself.
const SESSION_WAIT_ATTEMPTS = 6;
const SESSION_WAIT_MS = 500;

const ALREADY_PAID: CheckoutResult = {
  ok: false,
  status: 409,
  error: PaymentErrorMessage.ALREADY_PAID,
};

const CHECKOUT_FAILED: CheckoutResult = {
  ok: false,
  status: 502,
  error: PaymentErrorMessage.CHECKOUT_FAILED,
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const DOUBLE_PAYMENT_MESSAGE =
  '[payments] two payments for the same application and approval round were paid. Refund one.';

/**
 * A payment counts for the application's current approval round if it was created after
 * the latest approval. Applications are reused for renewals, so older payments paid for an
 * earlier round. The amount is deliberately not compared with the current fee: each payment
 * stores the fee the member was asked for, and paying that amount counts.
 */
function countsForCurrentRound(
  paymentCreatedAt: string,
  approvedAt: string | null,
) {
  return (
    approvedAt === null ||
    new Date(paymentCreatedAt).getTime() >= new Date(approvedAt).getTime()
  );
}

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
      error: PaymentErrorMessage.MEMBERSHIP_LOAD_FAILED,
    };
  }
  if (
    !application ||
    application.status !== ApplicationStatus.PAYMENT_PENDING
  ) {
    return {
      ok: false,
      status: 409,
      error: PaymentErrorMessage.NO_PAYMENT_DUE,
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
      error: PaymentErrorMessage.PAYMENTS_LOAD_FAILED,
    };
  }

  const isCurrentRound = (payment: PaymentRow) =>
    countsForCurrentRound(payment.created_at, application.finalized_at);
  const rows = (payments ?? []) as PaymentRow[];

  // Paid for this round but the membership never activated (for example the activation
  // write failed and no webhook retried it). Finish it instead of refusing forever.
  const paidThisRound = rows.find(
    (payment) =>
      payment.status === PaymentTransactionStatus.SUCCEEDED &&
      isCurrentRound(payment),
  );
  if (paidThisRound) {
    await activateForPayment(admin, application.id, paidThisRound);
    return ALREADY_PAID;
  }
  if (
    rows.some(
      (payment) => payment.status === PaymentTransactionStatus.PROCESSING,
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
    if (isCurrentRound(open) && Number(open.amount) === context.fee) {
      const reused = await reuseOpenPayment(context, open);
      if (reused) return reused;
    } else {
      // An open payment from before the latest approval, or for a different fee, can't be
      // reused. Retire it so it stops blocking a new one, unless it turns out to be paid.
      const outcome = await retireOpenPayment(admin, open);
      if (outcome.kind === 'failed') return CHECKOUT_FAILED;
      if (outcome.kind === 'recorded') {
        const { result } = outcome;
        if (result.outcome === 'ignored') return CHECKOUT_FAILED;
        if (result.status === PaymentTransactionStatus.PROCESSING)
          return ALREADY_PAID;
        if (
          result.status === PaymentTransactionStatus.SUCCEEDED &&
          isCurrentRound(open)
        )
          return ALREADY_PAID;
        // A paid payment from an earlier round, or a failed one: start a new payment.
      }
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
      error: PaymentErrorMessage.CHECKOUT_FAILED,
    };
  }

  return createSessionForPayment(context, inserted.id, { ownsPayment: true });
}

/**
 * Returns the Checkout Session URL for an open payment of the current round, creating the
 * session if it doesn't exist yet. Returns null when the payment can no longer be used
 * (its session expired, or it failed), so the caller can create a new one.
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

  let session: StripeCheckoutSession;
  try {
    session = await getStripeCheckoutSession(sessionId);
  } catch (error) {
    // Don't fall through to a new payment: the open one may still be payable.
    console.error(
      '[payments] could not load the open Checkout Session:',
      error,
    );
    return CHECKOUT_FAILED;
  }
  if (!sessionBelongsTo(session, payment.id)) return CHECKOUT_FAILED;

  if (session.status === 'open' && session.url)
    return { ok: true, url: session.url };
  if (session.status === 'complete') {
    // Paid (or settling) but not recorded yet: record it now instead of charging again.
    const result = await fulfillCheckoutSession(session);
    if (result.outcome === 'ignored') return CHECKOUT_FAILED;
    if (
      result.status === PaymentTransactionStatus.SUCCEEDED ||
      result.status === PaymentTransactionStatus.PROCESSING
    )
      return ALREADY_PAID;
    return null;
  }
  await markCanceled(context.admin, payment.id);
  return null;
}

/** Logs and returns false when a session's metadata points at a different payment. */
function sessionBelongsTo(session: StripeCheckoutSession, paymentId: string) {
  const sessionPaymentId =
    session.metadata?.payment_id ?? session.client_reference_id;
  if (sessionPaymentId === paymentId) return true;
  console.error('[payments] Checkout Session belongs to a different payment', {
    paymentId,
    sessionId: session.id,
    sessionPaymentId,
  });
  return false;
}

/**
 * Takes an open payment out of the way. Looks at its Checkout Session first and never cancels
 * blindly: an open session is expired (and the payment canceled only if that worked), an
 * expired one is canceled, and a completed one is recorded, because the member may already
 * have paid it.
 */
async function retireOpenPayment(
  admin: SupabaseAdminClient,
  payment: Pick<PaymentRow, 'id' | 'stripe_session_id'>,
): Promise<RetireOutcome> {
  if (!payment.stripe_session_id) {
    // No session was ever created for it, so there is nothing a member could pay.
    await markCanceled(admin, payment.id);
    return { kind: 'canceled' };
  }

  let session: StripeCheckoutSession;
  try {
    session = await getStripeCheckoutSession(payment.stripe_session_id);
  } catch (error) {
    console.error(
      '[payments] could not load Checkout Session to retire:',
      error,
    );
    return { kind: 'failed' };
  }
  if (!sessionBelongsTo(session, payment.id)) return { kind: 'failed' };

  if (session.status === 'complete') {
    return {
      kind: 'recorded',
      result: await fulfillCheckoutSession(session, undefined, {
        resolveConflicts: false,
      }),
    };
  }

  if (session.status === 'open') {
    try {
      await expireStripeCheckoutSession(session.id);
    } catch (error) {
      // Leave the payment open: the session may still be payable.
      console.error('[payments] could not expire Checkout Session:', error);
      return { kind: 'failed' };
    }
  }

  await markCanceled(admin, payment.id);
  return { kind: 'canceled' };
}

async function markCanceled(admin: SupabaseAdminClient, paymentId: string) {
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
    // The details (which may mention configuration) only go to the server log.
    console.error('[payments] Stripe session creation failed:', error);
    // Only the request that created the payment marks it failed, which frees the open-payment
    // slot for the next attempt. If Stripe did create a session despite the error, its URL
    // never reached the member, so it can't be paid. Another request's failure (for example
    // Stripe refusing a simultaneous call with the same idempotency key) says nothing about
    // whether the payment itself is usable.
    if (ownsPayment) {
      await context.admin
        .from('payments')
        .update({
          status: PaymentTransactionStatus.FAILED,
          updated_at: new Date().toISOString(),
        })
        .eq('id', paymentId);
    }
    return CHECKOUT_FAILED;
  }
}

/**
 * Moves the application from payment_pending to active, but only for a payment that counts
 * for the current approval round. The update is conditional on payment_pending, so the
 * webhook, the return page and checkout doing this at the same time is harmless.
 * Throws on database errors so webhook callers can return a 5xx and let Stripe retry.
 */
async function activateForPayment(
  admin: SupabaseAdminClient,
  applicationId: string,
  payment: { id: string; created_at: string },
  { flagDuplicates = false }: { flagDuplicates?: boolean } = {},
) {
  const { data: application, error: lookupError } = await admin
    .from('applications')
    .select('status, finalized_at')
    .eq('id', applicationId)
    .maybeSingle();
  if (lookupError)
    throw new Error(`Application lookup failed: ${lookupError.message}`);
  if (!application) return;

  const countsThisRound = countsForCurrentRound(
    payment.created_at,
    application.finalized_at,
  );

  // Checked before the status test: a second payment usually arrives after the first one
  // already activated the membership.
  if (flagDuplicates && countsThisRound)
    await flagIfAlreadyPaid(admin, applicationId, payment.id, application);

  if (application.status !== ApplicationStatus.PAYMENT_PENDING) return;

  if (!countsThisRound) {
    console.error(
      '[payments] a payment from an earlier approval round succeeded; not activating. Reconcile manually.',
      { paymentId: payment.id, applicationId },
    );
    return;
  }

  const { error: activationError } = await admin
    .from('applications')
    .update({ status: ApplicationStatus.ACTIVE })
    .eq('id', applicationId)
    .eq('status', ApplicationStatus.PAYMENT_PENDING);
  if (activationError)
    throw new Error(`Membership activation failed: ${activationError.message}`);
}

/**
 * Logs a refund flag when another payment for the same application already succeeded in the
 * current approval round. Catches every way a member can end up paying twice. Only logs:
 * a failed lookup here must not stop the payment being recorded.
 */
async function flagIfAlreadyPaid(
  admin: SupabaseAdminClient,
  applicationId: string,
  paymentId: string,
  application: { finalized_at: string | null },
) {
  let query = admin
    .from('payments')
    .select('id')
    .eq('application_id', applicationId)
    .eq('status', PaymentTransactionStatus.SUCCEEDED)
    .neq('id', paymentId);
  if (application.finalized_at)
    query = query.gte('created_at', application.finalized_at);

  const { data: others, error } = await query;
  if (error) {
    console.error(
      '[payments] could not check for a duplicate payment:',
      error.message,
    );
    return;
  }
  if (others?.length)
    console.error(DOUBLE_PAYMENT_MESSAGE, {
      paymentId,
      otherPaymentIds: others.map((other) => other.id),
    });
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

/**
 * Records a Checkout Session's outcome on its `payments` row and, once paid, activates the
 * membership if the payment counts for the current round. Idempotent: safe to call from both
 * the webhook and the return page, and on retries.
 * Throws on database errors so webhook callers can return a 5xx and let Stripe retry.
 */
export async function fulfillCheckoutSession(
  session: StripeCheckoutSession,
  eventType?: string,
  { resolveConflicts = true }: { resolveConflicts?: boolean } = {},
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
      'id, user_id, application_id, amount, currency, status, stripe_session_id, created_at',
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
    const update = () =>
      admin
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

    let { error: updateError } = await update();

    // Moving a payment to processing conflicts with the one-open-payment index when it was
    // retired and a newer payment is open. Money already on its way takes priority over an
    // unpaid session, so retire the newer payment (or record it, if it was paid) and retry.
    if (
      updateError?.code === UNIQUE_VIOLATION &&
      resolveConflicts &&
      payment.application_id
    ) {
      const { data: newer, error: newerError } = await admin
        .from('payments')
        .select('id, stripe_session_id')
        .eq('application_id', payment.application_id)
        .eq('status', PaymentTransactionStatus.REQUIRES_PAYMENT_METHOD)
        .neq('id', payment.id)
        .maybeSingle();
      if (newerError)
        throw new Error(`Open payment lookup failed: ${newerError.message}`);
      if (newer) {
        const outcome = await retireOpenPayment(admin, newer);
        if (outcome.kind === 'failed')
          throw new Error(
            'Could not retire the newer open payment; Stripe will retry.',
          );
        // The newer payment had already been paid (or is settling) too. Record both, since
        // the money moved either way, and flag one for a refund.
        if (
          outcome.kind === 'recorded' &&
          outcome.result.outcome !== 'ignored' &&
          (outcome.result.status === PaymentTransactionStatus.SUCCEEDED ||
            outcome.result.status === PaymentTransactionStatus.PROCESSING)
        ) {
          console.error(DOUBLE_PAYMENT_MESSAGE, {
            paymentId: payment.id,
            otherPaymentId: newer.id,
          });
        }
      }
      ({ error: updateError } = await update());
      if (updateError?.code === UNIQUE_VIOLATION) {
        // Both payments are paid or settling. Don't fail forever: leave this one as it is
        // (its later async_payment_succeeded event can still record it) and flag a refund.
        console.error(DOUBLE_PAYMENT_MESSAGE, {
          paymentId: payment.id,
          otherPaymentId: newer?.id,
        });
        return {
          outcome: 'ignored',
          reason: 'Another payment for this application is already in flight.',
        };
      }
    }

    if (updateError)
      throw new Error(`Payment update failed: ${updateError.message}`);
  }

  const finalStatus = alreadySucceeded ? payment.status : nextStatus;
  if (
    finalStatus === PaymentTransactionStatus.SUCCEEDED &&
    payment.application_id
  ) {
    // Runs on every call (not only on change) so a retry can finish a half-applied fulfillment.
    // Duplicate payments are only checked when this call recorded the success, so retries
    // don't log the same refund twice.
    await activateForPayment(admin, payment.application_id, payment, {
      flagDuplicates: changed,
    });
  }

  return {
    outcome: changed ? 'updated' : 'unchanged',
    status: finalStatus,
    userId: payment.user_id,
  };
}

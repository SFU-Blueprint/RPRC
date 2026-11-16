import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { getStripeCheckoutSession } from '@/lib/stripe/server';
import type { StripeCheckoutSession } from '@/types/payment.types';
import { fulfillCheckoutSession } from '@/lib/api/services/server/payment-service';
import { PaymentTransactionStatus } from '@/lib/constants/enums';
import { PAYMENT_RETURN_COPY as COPY } from '@/lib/constants/payments';
import { PAYMENT_CURRENCY } from '@/lib/constants/processing-fees';
import { ROUTES } from '@/lib/constants/routes';

type SearchParams = Promise<{ session_id?: string }>;

export default async function MembershipPaymentReturnPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { session_id: sessionId } = await searchParams;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let session: StripeCheckoutSession | null = null;
  let recordedStatus: PaymentTransactionStatus | null = null;

  if (sessionId && user) {
    try {
      const retrieved = await getStripeCheckoutSession(sessionId);
      // Only show sessions that belong to the signed-in member.
      if (retrieved.metadata?.user_id === user.id) {
        session = retrieved;
        // Record the result now as well as in the webhook, so the dashboard is current on return.
        const result = await fulfillCheckoutSession(retrieved);
        if (result.outcome !== 'ignored') recordedStatus = result.status;
      }
    } catch (error) {
      console.error(
        '[stripe return] could not confirm Checkout Session:',
        error,
      );
    }
  }

  const paid = recordedStatus === PaymentTransactionStatus.SUCCEEDED;
  const processing = recordedStatus === PaymentTransactionStatus.PROCESSING;
  const amount = session
    ? `${(session.currency ?? PAYMENT_CURRENCY).toUpperCase()} $${((session.amount_total ?? 0) / 100).toFixed(2)}`
    : '';

  const message = !sessionId
    ? COPY.NO_SESSION
    : !user
      ? COPY.SIGN_IN_REQUIRED
      : !session
        ? COPY.UNCONFIRMED
        : paid
          ? COPY.paid(amount)
          : processing
            ? COPY.processing(amount)
            : COPY.otherStatus(session.payment_status ?? 'unknown');

  return (
    <main className="mx-auto max-w-xl px-5 py-16">
      <section className="rounded-3xl border bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-semibold">
          {paid
            ? COPY.HEADING_PAID
            : processing
              ? COPY.HEADING_PROCESSING
              : COPY.HEADING_DEFAULT}
        </h1>
        <p className="mt-3 text-content-secondary">{message}</p>
        <Link
          className="mt-6 inline-block underline"
          href={ROUTES.MEMBERSHIP_DASHBOARD}
        >
          {COPY.BACK_TO_DASHBOARD}
        </Link>
      </section>
    </main>
  );
}

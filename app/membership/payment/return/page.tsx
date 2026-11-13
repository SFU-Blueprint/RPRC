import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import {
  getStripeCheckoutSession,
  type StripeCheckoutSession,
} from '@/lib/stripe/server';
import { fulfillCheckoutSession } from '@/lib/api/services/server/payment-service';
import { PaymentTransactionStatus } from '@/lib/constants/enums';
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
    ? `${session.currency?.toUpperCase() ?? 'CAD'} $${((session.amount_total ?? 0) / 100).toFixed(2)}`
    : '';

  const message = !sessionId
    ? 'No checkout session was provided.'
    : !user
      ? 'Please sign in to view your payment status.'
      : !session
        ? 'We could not confirm this payment. If you were charged, it will appear on your dashboard shortly. Otherwise, try again from your dashboard.'
        : paid
          ? `Your payment of ${amount} was received and your membership is now active.`
          : processing
            ? `Your payment of ${amount} is processing. Your membership will activate once it clears.`
            : `Stripe reports payment status “${session.payment_status ?? 'unknown'}”. No membership changes were made.`;

  return (
    <main className="mx-auto max-w-xl px-5 py-16">
      <section className="rounded-3xl border bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-semibold">
          {paid
            ? 'Payment received'
            : processing
              ? 'Payment processing'
              : 'Payment status'}
        </h1>
        <p className="mt-3 text-content-secondary">{message}</p>
        <Link
          className="mt-6 inline-block underline"
          href={ROUTES.MEMBERSHIP_DASHBOARD}
        >
          Return to membership dashboard
        </Link>
      </section>
    </main>
  );
}

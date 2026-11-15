import type { Tables } from '@/types/database';
import type { PaymentTransactionStatus } from '@/lib/constants/enums';

/** The fields of a Stripe Checkout Session this app reads. */
export type StripeCheckoutSession = {
  id: string;
  url: string | null;
  status?: 'open' | 'complete' | 'expired' | null;
  payment_status?: 'paid' | 'unpaid' | 'no_payment_required';
  amount_total?: number | null;
  currency?: string | null;
  client_reference_id?: string | null;
  payment_intent?: string | { id: string } | null;
  metadata?: Record<string, string> | null;
};

/** A Stripe webhook event carrying a Checkout Session. */
export type StripeEvent = {
  id: string;
  type: string;
  data?: { object?: StripeCheckoutSession };
};

/** The `payments` columns checkout reads when deciding whether to reuse a payment. */
export type PaymentRow = Pick<
  Tables<'payments'>,
  'id' | 'status' | 'stripe_session_id' | 'amount' | 'created_at'
>;

export type CheckoutResult =
  | { ok: true; url: string }
  | { ok: false; status: number; error: string };

export type FulfillmentResult =
  | {
      outcome: 'updated' | 'unchanged';
      status: PaymentTransactionStatus;
      userId: string;
    }
  | { outcome: 'ignored'; reason: string };

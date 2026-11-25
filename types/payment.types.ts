import type { Tables } from '@/types/database';
import type {
  ApplicationType,
  PaymentTransactionStatus,
} from '@/lib/constants/enums';
import { SupabaseAdminClient } from '@/lib/supabase/admin';

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

export type CheckoutContext = {
  admin: SupabaseAdminClient;
  application: { id: string; type: ApplicationType };
  fee: number;
  userId: string;
  email?: string | null;
  requestOrigin?: string;
};

export type RetireOutcome =
  /** The session was expired (or never existed) and the payment is now canceled. */
  | { kind: 'canceled' }
  /** The session had already been completed, so it was recorded instead. */
  | { kind: 'recorded'; result: FulfillmentResult }
  /** The session's state couldn't be confirmed or changed. The payment is left open. */
  | { kind: 'failed' };

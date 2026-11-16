/** Stripe Checkout events the webhook handles. `npm run stripe:listen` forwards the same list. */
export const STRIPE_CHECKOUT_EVENTS = [
  'checkout.session.completed',
  'checkout.session.async_payment_succeeded',
  'checkout.session.async_payment_failed',
  'checkout.session.expired',
] as const;

export type StripeCheckoutEvent = (typeof STRIPE_CHECKOUT_EVENTS)[number];

/** Messages shown to members when checkout can't start. */
export const PaymentErrorMessage = {
  SIGN_IN_REQUIRED: 'Please sign in to pay for your membership.',
  NO_PAYMENT_DUE: 'There is no membership payment due on your account.',
  ALREADY_PAID:
    'A payment for this membership has already been received or is still processing.',
  MEMBERSHIP_LOAD_FAILED:
    'Your membership could not be loaded. Please try again.',
  PAYMENTS_LOAD_FAILED:
    'Your payment history could not be loaded. Please try again.',
  CHECKOUT_FAILED: 'Checkout could not be started. Please try again.',
} as const;

/** Responses from the Stripe webhook route. Stripe reads these, not members. */
export const WebhookErrorMessage = {
  SECRET_NOT_CONFIGURED: 'Webhook signing secret is not configured.',
  INVALID_SIGNATURE: 'Invalid Stripe signature.',
  INVALID_PAYLOAD: 'Invalid event payload.',
  SESSION_MISSING: 'Checkout Session was missing.',
  RECORD_FAILED: 'The payment could not be recorded.',
} as const;

/** Text on the page Stripe returns members to after checkout. */
export const PAYMENT_RETURN_COPY = {
  NO_SESSION: 'No checkout session was provided.',
  SIGN_IN_REQUIRED: 'Please sign in to view your payment status.',
  UNCONFIRMED:
    'We could not confirm this payment. If you were charged, it will appear on your dashboard shortly. Otherwise, try again from your dashboard.',
  paid: (amount: string) =>
    `Your payment of ${amount} was received and your membership is now active.`,
  processing: (amount: string) =>
    `Your payment of ${amount} is processing. Your membership will activate once it clears.`,
  otherStatus: (status: string) =>
    `Stripe reports payment status “${status}”. No membership changes were made.`,
  HEADING_PAID: 'Payment received',
  HEADING_PROCESSING: 'Payment processing',
  HEADING_DEFAULT: 'Payment status',
  BACK_TO_DASHBOARD: 'Return to membership dashboard',
} as const;

/** Line-item description shown on Stripe Checkout. */
export const STRIPE_PRODUCT_DESCRIPTION = 'Annual membership dues';

/** How old (in seconds) a Stripe webhook signature may be. Stripe's own default. */
export const STRIPE_WEBHOOK_TOLERANCE_SECONDS = 300;

/** The `payments` columns checkout selects. Must match `PaymentRow` in `types/payment.types.ts`. */
export const PAYMENT_COLUMNS =
  'id, status, stripe_session_id, amount, created_at';

// How long a request that lost the insert race waits for the winner to store its
// Checkout Session id before creating (the same, idempotent) session itself.
export const SESSION_WAIT_ATTEMPTS = 6;
export const SESSION_WAIT_MS = 500;

/** Logged when one application was paid for twice in the same approval round. */
export const DOUBLE_PAYMENT_MESSAGE =
  '[payments] two payments for the same application and approval round were paid. Refund one.';

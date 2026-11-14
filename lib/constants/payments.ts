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
  STRIPE_NOT_CONFIGURED:
    'Stripe could not start checkout. Check the Stripe server key and site URL.',
} as const;

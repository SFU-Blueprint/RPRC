import {
  APPLICATION_FEES,
  PAYMENT_CURRENCY,
} from '@/lib/constants/processing-fees';
import { ApplicationType } from '@/lib/constants/enums';
import { ROUTES } from '@/lib/constants/routes';
import type { StripeCheckoutSession } from '@/types/payment.types';

/** Membership fee in whole dollars (CAD). */
export function getMembershipFee(type: ApplicationType): number {
  return type === ApplicationType.ORGANIZATION
    ? APPLICATION_FEES.ORGANIZATION
    : APPLICATION_FEES.INDIVIDUAL;
}

function getSiteUrl(requestOrigin?: string) {
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const siteUrl =
    configuredUrl ||
    (process.env.NODE_ENV === 'development' ? requestOrigin : undefined);
  if (!siteUrl) throw new Error('NEXT_PUBLIC_SITE_URL is not configured.');

  const url = new URL(siteUrl);
  if (url.protocol !== 'https:' && process.env.NODE_ENV !== 'development') {
    throw new Error(
      'NEXT_PUBLIC_SITE_URL must use HTTPS outside local development.',
    );
  }
  return url.origin;
}

function getSecretKey() {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) throw new Error('STRIPE_SECRET_KEY is not configured.');
  return secretKey;
}

type StripeErrorBody = { error?: { message?: string } };

export async function createStripeCheckoutSession(input: {
  paymentId: string;
  applicationId: string;
  userId: string;
  membershipType: ApplicationType;
  amountMinor: number;
  customerEmail?: string | null;
  requestOrigin?: string;
}) {
  const siteUrl = getSiteUrl(input.requestOrigin);
  const membershipLabel =
    input.membershipType === ApplicationType.ORGANIZATION
      ? 'Organization'
      : 'Individual';
  const body = new URLSearchParams({
    mode: 'payment',
    'line_items[0][quantity]': '1',
    'line_items[0][price_data][currency]': PAYMENT_CURRENCY,
    'line_items[0][price_data][unit_amount]': String(input.amountMinor),
    'line_items[0][price_data][product_data][name]': `RPRC ${membershipLabel} Membership`,
    'line_items[0][price_data][product_data][description]':
      'Annual membership dues',
    client_reference_id: input.paymentId,
    'metadata[payment_id]': input.paymentId,
    'metadata[application_id]': input.applicationId,
    'metadata[user_id]': input.userId,
    'payment_intent_data[metadata][payment_id]': input.paymentId,
    success_url: `${siteUrl}${ROUTES.MEMBERSHIP_PAYMENT_RETURN}?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${siteUrl}${ROUTES.MEMBERSHIP_DASHBOARD}`,
  });
  if (input.customerEmail) body.set('customer_email', input.customerEmail);

  const response = await fetch('https://api.stripe.com/v1/checkout/sessions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getSecretKey()}`,
      'Content-Type': 'application/x-www-form-urlencoded',
      'Idempotency-Key': `membership-payment-${input.paymentId}`,
    },
    body,
    cache: 'no-store',
  });

  const result = (await response.json()) as StripeCheckoutSession &
    StripeErrorBody;
  if (!response.ok || !result.id || !result.url) {
    throw new Error(
      result.error?.message || 'Stripe could not start checkout.',
    );
  }
  return result;
}

/** Expires an open Checkout Session so it can no longer be paid. */
export async function expireStripeCheckoutSession(sessionId: string) {
  const response = await fetch(
    `https://api.stripe.com/v1/checkout/sessions/${encodeURIComponent(sessionId)}/expire`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${getSecretKey()}` },
      cache: 'no-store',
    },
  );
  const result = (await response.json()) as StripeCheckoutSession &
    StripeErrorBody;
  if (!response.ok || !result.id) {
    throw new Error(
      result.error?.message || 'Stripe could not expire the Checkout Session.',
    );
  }
  return result;
}

export async function getStripeCheckoutSession(sessionId: string) {
  const response = await fetch(
    `https://api.stripe.com/v1/checkout/sessions/${encodeURIComponent(sessionId)}`,
    {
      headers: { Authorization: `Bearer ${getSecretKey()}` },
      cache: 'no-store',
    },
  );
  const result = (await response.json()) as StripeCheckoutSession &
    StripeErrorBody;
  if (!response.ok || !result.id) {
    throw new Error(
      result.error?.message || 'Stripe could not load the Checkout Session.',
    );
  }
  return result;
}

import { NextResponse } from 'next/server';
import { verifyStripeWebhookSignature } from '@/lib/stripe/webhook-signature';
import { fulfillCheckoutSession } from '@/lib/api/services/server/payment-service';
import {
  STRIPE_CHECKOUT_EVENTS,
  WebhookErrorMessage,
} from '@/lib/constants/payments';
import type { StripeEvent } from '@/types/payment.types';

export const runtime = 'nodejs';

const CHECKOUT_EVENTS = new Set<string>(STRIPE_CHECKOUT_EVENTS);

export async function POST(request: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret)
    return NextResponse.json(
      { error: WebhookErrorMessage.SECRET_NOT_CONFIGURED },
      { status: 503 },
    );

  const signature = request.headers.get('stripe-signature');
  const rawBody = await request.text();
  if (!signature || !verifyStripeWebhookSignature(rawBody, signature, secret)) {
    return NextResponse.json(
      { error: WebhookErrorMessage.INVALID_SIGNATURE },
      { status: 400 },
    );
  }

  let event: StripeEvent;
  try {
    event = JSON.parse(rawBody) as StripeEvent;
  } catch {
    return NextResponse.json(
      { error: WebhookErrorMessage.INVALID_PAYLOAD },
      { status: 400 },
    );
  }

  if (!event.id || !event.type)
    return NextResponse.json(
      { error: WebhookErrorMessage.INVALID_PAYLOAD },
      { status: 400 },
    );
  if (!CHECKOUT_EVENTS.has(event.type))
    return NextResponse.json({ received: true });

  const session = event.data?.object;
  if (!session?.id)
    return NextResponse.json(
      { error: WebhookErrorMessage.SESSION_MISSING },
      { status: 400 },
    );

  try {
    const result = await fulfillCheckoutSession(session, event.type);
    if (result.outcome === 'ignored') {
      console.warn('[stripe webhook] event ignored', {
        eventId: event.id,
        sessionId: session.id,
        reason: result.reason,
      });
    } else {
      console.info('[stripe webhook] payment recorded', {
        eventId: event.id,
        eventType: event.type,
        sessionId: session.id,
        status: result.status,
        outcome: result.outcome,
      });
    }
    return NextResponse.json({ received: true });
  } catch (error) {
    // A 5xx makes Stripe retry; fulfillment is idempotent.
    console.error('[stripe webhook] fulfillment failed:', {
      eventId: event.id,
      error,
    });
    return NextResponse.json(
      { error: WebhookErrorMessage.RECORD_FAILED },
      { status: 500 },
    );
  }
}

import { createHmac } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import { verifyStripeWebhookSignature } from './webhook-signature';

const secret = 'whsec_test_secret';
const timestamp = 1_800_000_000;
const payload = '{"id":"evt_test","type":"checkout.session.completed"}';

function stripeSignature(body: string, time: number) {
  return createHmac('sha256', secret)
    .update(`${time}.${body}`, 'utf8')
    .digest('hex');
}

describe('verifyStripeWebhookSignature', () => {
  it('accepts a valid signature for the raw request body', () => {
    const signature = stripeSignature(payload, timestamp);
    expect(
      verifyStripeWebhookSignature(
        payload,
        `t=${timestamp},v1=${signature}`,
        secret,
        timestamp,
      ),
    ).toBe(true);
  });

  it('rejects a payload changed after signing', () => {
    const signature = stripeSignature(payload, timestamp);
    expect(
      verifyStripeWebhookSignature(
        `${payload} `,
        `t=${timestamp},v1=${signature}`,
        secret,
        timestamp,
      ),
    ).toBe(false);
  });

  it('rejects an old signature outside the tolerance window', () => {
    const signature = stripeSignature(payload, timestamp);
    expect(
      verifyStripeWebhookSignature(
        payload,
        `t=${timestamp},v1=${signature}`,
        secret,
        timestamp + 301,
      ),
    ).toBe(false);
  });

  it('accepts any valid v1 signature when Stripe includes several', () => {
    const signature = stripeSignature(payload, timestamp);
    expect(
      verifyStripeWebhookSignature(
        payload,
        `t=${timestamp},v1=${'0'.repeat(64)},v1=${signature}`,
        secret,
        timestamp,
      ),
    ).toBe(true);
  });
});

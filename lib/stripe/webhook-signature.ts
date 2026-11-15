import { createHmac, timingSafeEqual } from 'node:crypto';

const DEFAULT_TOLERANCE_SECONDS = 300;

export function verifyStripeWebhookSignature(
  payload: string,
  signatureHeader: string,
  secret: string,
  nowSeconds = Math.floor(Date.now() / 1000),
  toleranceSeconds = DEFAULT_TOLERANCE_SECONDS,
) {
  const fields = signatureHeader
    .split(',')
    .map((part) => part.trim().split('='));
  const timestamp = fields.find(([key]) => key === 't')?.[1];
  const signatures = fields
    .filter(([key, value]) => key === 'v1' && Boolean(value))
    .map(([, value]) => value);

  if (!timestamp || !/^\d+$/.test(timestamp) || signatures.length === 0) {
    return false;
  }

  const timestampNumber = Number(timestamp);
  if (Math.abs(nowSeconds - timestampNumber) > toleranceSeconds) {
    return false;
  }

  const expected = createHmac('sha256', secret)
    .update(`${timestamp}.${payload}`, 'utf8')
    .digest();

  return signatures.some((signature) => {
    if (!/^[a-f\d]{64}$/i.test(signature)) return false;
    const actual = Buffer.from(signature, 'hex');
    return (
      actual.length === expected.length && timingSafeEqual(actual, expected)
    );
  });
}

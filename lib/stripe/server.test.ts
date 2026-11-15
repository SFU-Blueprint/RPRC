import { afterEach, describe, expect, it, vi } from 'vitest';
import { createStripeCheckoutSession } from './server';

afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

describe('createStripeCheckoutSession', () => {
  it('uses the local request origin when NEXT_PUBLIC_SITE_URL is unset in development', async () => {
    vi.stubEnv('NODE_ENV', 'development');
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', '');
    vi.stubEnv('STRIPE_SECRET_KEY', 'sk_test_example');

    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(
      new Response(
        JSON.stringify({
          id: 'cs_test_example',
          url: 'https://checkout.stripe.com/test',
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        },
      ),
    );
    vi.stubGlobal('fetch', fetchMock);

    await createStripeCheckoutSession({
      paymentId: 'payment-example',
      applicationId: 'application-example',
      userId: 'user-example',
      membershipType: 'individual',
      amountMinor: 500,
      requestOrigin: 'http://localhost:3000',
    });

    const requestBody = fetchMock.mock.calls[0]?.[1]?.body as URLSearchParams;
    expect(requestBody.get('success_url')).toBe(
      'http://localhost:3000/membership/payment/return?session_id={CHECKOUT_SESSION_ID}',
    );
    expect(requestBody.get('cancel_url')).toBe(
      'http://localhost:3000/membership/dashboard',
    );
    expect(requestBody.get('metadata[payment_id]')).toBe('payment-example');
    expect(requestBody.get('metadata[application_id]')).toBe(
      'application-example',
    );
    expect(requestBody.get('metadata[user_id]')).toBe('user-example');
    expect(fetchMock.mock.calls[0]?.[1]?.headers).toMatchObject({
      'Idempotency-Key': 'membership-payment-payment-example',
    });
  });
});

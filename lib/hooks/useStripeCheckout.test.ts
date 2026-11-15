import { act, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { useStripeCheckout } from './useStripeCheckout';

const CHECKOUT_FAILED = 'Checkout could not be started. Please try again.';

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('useStripeCheckout', () => {
  it('shows the generic message when the server returns a non-JSON error page', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(
        async () =>
          new Response('<html>Gateway Timeout</html>', {
            status: 504,
            headers: { 'Content-Type': 'text/html' },
          }),
      ),
    );
    const { result } = renderHook(() => useStripeCheckout());

    await act(() => result.current.startCheckout());

    expect(result.current.error).toBe(CHECKOUT_FAILED);
    expect(result.current.isStarting).toBe(false);
  });

  it("shows the server's message for an expected refusal", async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () =>
        Response.json(
          { error: 'There is no membership payment due on your account.' },
          { status: 409 },
        ),
      ),
    );
    const { result } = renderHook(() => useStripeCheckout());

    await act(() => result.current.startCheckout());

    expect(result.current.error).toBe(
      'There is no membership payment due on your account.',
    );
  });

  it('shows the generic message when the request itself fails', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => {
        throw new TypeError('Failed to fetch');
      }),
    );
    const { result } = renderHook(() => useStripeCheckout());

    await act(() => result.current.startCheckout());

    expect(result.current.error).toBe(CHECKOUT_FAILED);
    expect(result.current.isStarting).toBe(false);
  });

  it('resets the button when the page is restored from the back-forward cache', async () => {
    // Never resolves, like a page that navigated away to Stripe.
    vi.stubGlobal(
      'fetch',
      vi.fn(() => new Promise<Response>(() => {})),
    );
    const { result } = renderHook(() => useStripeCheckout());

    act(() => {
      void result.current.startCheckout();
    });
    expect(result.current.isStarting).toBe(true);

    act(() => {
      const event = new Event('pageshow') as PageTransitionEvent;
      Object.defineProperty(event, 'persisted', { value: true });
      window.dispatchEvent(event);
    });

    expect(result.current.isStarting).toBe(false);
  });
});

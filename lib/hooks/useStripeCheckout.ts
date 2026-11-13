'use client';

import { useCallback, useState } from 'react';

/** Starts Stripe Checkout for the signed-in member's payment-pending membership. */
export function useStripeCheckout() {
  const [isStarting, setIsStarting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startCheckout = useCallback(async () => {
    setIsStarting(true);
    setError(null);
    try {
      const response = await fetch('/api/stripe/checkout', { method: 'POST' });
      const result = (await response.json()) as {
        url?: string;
        error?: string;
      };
      if (!response.ok || !result.url) {
        throw new Error(
          result.error || 'Checkout could not be started. Please try again.',
        );
      }
      window.location.assign(result.url);
    } catch (checkoutError) {
      setError(
        checkoutError instanceof Error
          ? checkoutError.message
          : 'Checkout could not be started. Please try again.',
      );
      setIsStarting(false);
    }
  }, []);

  return { isStarting, error, startCheckout };
}

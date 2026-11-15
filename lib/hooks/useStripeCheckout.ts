'use client';

import { useCallback, useEffect, useState } from 'react';
import { PaymentErrorMessage } from '@/lib/constants/payments';
import { ROUTES } from '@/lib/constants/routes';

/** Starts Stripe Checkout for the signed-in member's payment-pending membership. */
export function useStripeCheckout() {
  const [isStarting, setIsStarting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Coming back from Stripe with the browser's Back button can restore this page from the
  // back-forward cache with its state intact, which would leave the button stuck loading.
  useEffect(() => {
    const onPageShow = (event: PageTransitionEvent) => {
      if (event.persisted) setIsStarting(false);
    };
    window.addEventListener('pageshow', onPageShow);
    return () => window.removeEventListener('pageshow', onPageShow);
  }, []);

  const startCheckout = useCallback(async () => {
    setIsStarting(true);
    setError(null);

    let response: Response;
    try {
      response = await fetch(ROUTES.API_STRIPE_CHECKOUT, { method: 'POST' });
    } catch {
      setError(PaymentErrorMessage.CHECKOUT_FAILED);
      setIsStarting(false);
      return;
    }

    // An error page from a proxy or a crash may not be JSON.
    let result: { url?: string; error?: string } = {};
    try {
      result = await response.json();
    } catch {
      // Fall through with an empty result.
    }

    if (!response.ok || !result.url) {
      setError(result.error || PaymentErrorMessage.CHECKOUT_FAILED);
      setIsStarting(false);
      return;
    }
    window.location.assign(result.url);
  }, []);

  return { isStarting, error, startCheckout };
}

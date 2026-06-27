// PayPal smart button for subscriptions.
// Loads PayPal SDK on first render, renders the official button,
// and redirects to a /welcome?subscription_id=...&plan=monthly path after approval.

import { useEffect, useRef, useState } from 'react';

declare global {
  interface Window {
    paypal?: any;
  }
}

interface Props {
  planId: string;
  tier: 'monthly' | 'yearly';
  userId?: string;
  onSuccess?: (subscriptionId: string) => void;
  onError?: (err: any) => void;
}

export function PayPalButton({ planId, tier, userId, onSuccess, onError }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load the PayPal SDK once per page.
  useEffect(() => {
    const clientId = import.meta.env.VITE_PAYPAL_CLIENT_ID;

    if (!clientId || clientId === 'YOUR_LIVE_CLIENT_ID_HERE') {
      setError('PayPal Client ID not set. See .env.example.');
      return;
    }

    // Already loaded
    if (window.paypal) {
      setReady(true);
      return;
    }

    const script = document.createElement('script');
    script.src = `https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(clientId)}&vault=true&intent=subscription`;
    script.async = true;
    script.onload = () => setReady(true);
    script.onerror = () => setError('Failed to load PayPal SDK');
    document.body.appendChild(script);

    return () => {
      // Don't remove the script on unmount — it's a singleton for the page.
    };
  }, []);

  // Render the button once SDK is ready.
  useEffect(() => {
    if (!ready || !containerRef.current || !window.paypal) return;
    if (!planId || planId.startsWith('P-PLAN_ID')) {
      setError('Plan ID not set. See .env.example.');
      return;
    }

    // Clear any prior button render
    containerRef.current.innerHTML = '';

    window.paypal
      .Buttons({
        style: {
          shape: 'rect',
          color: 'gold',
          layout: 'vertical',
          label: 'subscribe',
        },
        createSubscription: (_data: any, actions: any) => {
          return actions.subscription.create({
            plan_id: planId,
            custom_id: userId || undefined,
            application_context: {
              brand_name: 'BreakFree',
              shipping_preference: 'NO_SHIPPING',
              user_action: 'SUBSCRIBE_NOW',
              return_url: `${window.location.origin}/#/welcome?subscription_id={CHECKOUT_SESSION_ID}&plan=${tier}`,
              cancel_url: `${window.location.origin}/#/pricing`,
            },
          });
        },
        onApprove: async (data: any) => {
          // Server-side verification
          try {
            const apiBase = import.meta.env.VITE_API_BASE || window.location.origin;
            const res = await fetch(`${apiBase}/api/paypal/verify`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                subscriptionId: data.subscriptionID,
                userId,
              }),
            });
            const result = await res.json();
            onSuccess?.(data.subscriptionID);
            // Redirect to app
            window.location.href = `${window.location.origin}/#/welcome?subscription_id=${data.subscriptionID}&plan=${tier}&verified=${result.status}`;
          } catch (err) {
            onError?.(err);
          }
        },
        onError: (err: any) => {
          setError(err?.message || 'PayPal error');
          onError?.(err);
        },
        onCancel: () => {
          // User closed the popup — do nothing
        },
      })
      .render(containerRef.current);
  }, [ready, planId, tier, userId, onSuccess, onError]);

  if (error) {
    return (
      <div className="text-xs text-amber-300 bg-amber-500/10 border border-amber-500/30 rounded-lg p-2 mt-2">
        {error}
      </div>
    );
  }

  return <div ref={containerRef} className="mt-3" />;
}
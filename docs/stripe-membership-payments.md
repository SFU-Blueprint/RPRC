# Membership Stripe Checkout

When an application is approved (two approving reviews), its status becomes `payment_pending` and the member dashboard shows **Make Payment**. Paying moves the application to `active`.

## Flow

1. **Start checkout:** `POST /api/stripe/checkout`. The signed-in member is read from the Supabase session. The server loads their latest application and requires it to be `payment_pending`. It derives the fee from the application type (`lib/constants/processing-fees.ts`: individual $5, organization $25, CAD) and inserts a `payments` row (`requires_payment_method`). It then creates a Checkout Session with `metadata.payment_id`, `application_id` and `user_id`, and stores `stripe_session_id`. Repeat clicks reuse a still-open session. Checkout is refused if a payment since the latest approval already succeeded or is processing.
2. **Fulfill:** `fulfillCheckoutSession` (`lib/api/services/server/payment-service.ts`) runs from the webhook and from the return page. It looks the payment up by `metadata.payment_id` and checks the session id and the amount/currency. It then updates `payments.status` and `stripe_payment_intent_id`, and on success sets the application `payment_pending → active`. It is idempotent and never downgrades a succeeded payment.
3. **Return page:** `/membership/payment/return?session_id=…` only shows sessions whose `metadata.user_id` matches the signed-in user.

| Stripe                                                                  | `payments.status`                    |
| ----------------------------------------------------------------------- | ------------------------------------ |
| session created                                                         | `requires_payment_method`            |
| `checkout.session.completed`, `payment_status=paid`                     | `succeeded` (application → `active`) |
| `checkout.session.completed`, `payment_status=unpaid` (delayed methods) | `processing`                         |
| `checkout.session.async_payment_succeeded`                              | `succeeded` (application → `active`) |
| `checkout.session.async_payment_failed`                                 | `failed`                             |
| `checkout.session.expired`                                              | `canceled`                           |

All `payments` writes use the admin client (`lib/supabase/admin.ts`) with the Supabase secret key (`sb_secret_...`, which replaces the legacy service_role key), because webhooks have no user session. `SUPABASE_SECRET_KEY` must never be exposed to the browser.

## Local testing

1. In `.env.local`, set the Supabase vars, `SUPABASE_SECRET_KEY`, and a Stripe **test-mode** `STRIPE_SECRET_KEY`.
2. `make dev`, sign in as a member whose latest application is `payment_pending`, and open `/membership/dashboard`.
3. To receive webhooks, run `npm run stripe:listen` (it forwards the four checkout events in the table above). Set the printed `whsec_…` as `STRIPE_WEBHOOK_SECRET` and restart. Without the webhook, the return page still records card payments.
4. Click **Make Payment** and pay with `4242 4242 4242 4242` (any future expiry, any CVC).

## Deployment

Configure `SUPABASE_SECRET_KEY`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` and `NEXT_PUBLIC_SITE_URL` (the deployment's HTTPS URL; it is also used for auth email links and Stripe's return URLs). Register the HTTPS endpoint `/api/stripe/webhook` in Stripe with the four events above. Use the matching key and webhook secret for each Stripe environment.

## Not yet handled

- Fee waivers: an approved waiver still leaves the application `payment_pending`. Nothing activates waived memberships without payment yet.
- Payment/approval emails and refunds.

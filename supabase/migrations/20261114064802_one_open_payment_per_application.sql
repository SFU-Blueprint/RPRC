-- At most one open payment per application, so two checkout requests that arrive at
-- the same time share one payments row (and one Stripe Checkout Session) instead of
-- each creating their own. The checkout code catches the unique violation and reuses
-- the row that won.

-- Cancel any existing duplicates first, keeping the newest open payment per application.
-- A processing payment is kept over one that is waiting for a payment method, because
-- money may already be on its way.
with ranked as (
  select
    id,
    row_number() over (
      partition by application_id
      order by (status = 'processing') desc, created_at desc
    ) as position
  from public.payments
  where application_id is not null
    and status in ('requires_payment_method', 'processing')
)
update public.payments p
set status = 'canceled', updated_at = now()
from ranked
where p.id = ranked.id
  and ranked.position > 1;

create unique index payments_one_open_per_application
  on public.payments (application_id)
  where status in ('requires_payment_method', 'processing');

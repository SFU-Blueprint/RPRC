-- applications.member_since: when the application first became active. Set by the app the
-- first time an application reaches `active` and never cleared, so a later activation of
-- the same row (a renewal: the row goes back through review and payment) can tell it has
-- been a member before. The status emails use it to pick renewal wording.
--
-- Nullable with no default: NULL means "never active". The app writes it, so this
-- migration can be applied before the app deploy (old app versions just leave it alone).
alter table public.applications add column member_since timestamptz;

comment on column public.applications.member_since is
  'When the application first became active. Never cleared; NULL means never active.';

-- Backfill 1: current and lapsed members. finalized_at is the approval time, not the
-- payment time, so this is approximate; the app only uses it as a yes/no flag. pg_cron only
-- moves active -> expires_soon -> expired, so these statuses always mean "was a member".
update public.applications
set member_since = coalesce(finalized_at, created_at)
where status in ('active', 'expires_soon', 'expired');

-- Backfill 2: paid renewals already in progress. A first application can't have a
-- succeeded payment in these statuses, except a payment_pending row whose activation got
-- stuck after payment; for payment_pending only payments from before finalized_at (an
-- earlier approval round) count. A NULL finalized_at excludes every payment, matching
-- countsForCurrentRound in payment-service.ts. Fee-waived renewals in progress have no
-- payment to find and get first-time wording once.
update public.applications a
set member_since = p.first_paid
from (
  select pay.application_id, min(pay.created_at) as first_paid
  from public.payments pay
  join public.applications app on app.id = pay.application_id
  where pay.status = 'succeeded'
    and app.status in ('to_review', 'conflict', 'rejected', 'payment_pending')
    and (app.status <> 'payment_pending' or pay.created_at < app.finalized_at)
  group by pay.application_id
) p
where a.id = p.application_id
  and a.member_since is null;

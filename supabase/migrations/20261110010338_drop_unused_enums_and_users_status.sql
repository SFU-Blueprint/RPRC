-- Drop leftovers from the original schema that nothing uses.
--
-- These enums have no dependents (no column, default, view or function uses them) on dev:
--   approval_decision    -> replaced by review_decision (application_reviews)
--   approval_status      -> replaced by application_status (applications.status)
--   payment_status       -> replaced by payment_transaction_status (payments.status)
--   user_status          -> never used; membership state lives in applications.status
--   membership_interest  -> interests are rows in public.membership_interests
--
-- users.status is a free-text column that no code, RPC or trigger reads or writes.
-- On dev it was NULL for 15 users and 'approved' for 2 (set by hand), so no data is lost.
--
-- No CASCADE: if anything has started depending on these, this migration fails instead of
-- silently dropping it.

drop type public.approval_decision;
drop type public.approval_status;
drop type public.payment_status;
drop type public.user_status;
drop type public.membership_interest;

alter table public.users drop column status;

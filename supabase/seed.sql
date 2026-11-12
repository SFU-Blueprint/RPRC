-- Local development seed. Runs on `npx supabase start` (first run) and `npx supabase db reset`.
-- Never run against a hosted project.
--
-- Every seeded account uses the password: password123
--
--   admin@rprc.test      admin         -> /admin, can review applications
--   review@rprc.test     individual    application `to_review` (review it as admin)
--   org@rprc.test        organization  application `to_review`
--   pending@rprc.test    individual    application `payment_pending` (test Stripe checkout)
--   member@rprc.test     individual    application `active`
--
-- To test signup from scratch, register a new address. Confirmation emails go to Mailpit:
-- http://localhost:54324

-- Membership interests are reference data and come from the baseline migration, not this file.

-- ---------------------------------------------------------------------------
-- Test accounts
-- ---------------------------------------------------------------------------
-- Inserting into auth.users fires create_profile_from_auth, which creates the public.users row
-- (role taken from raw_user_meta_data.role).
with accounts (id, email, role) as (
  values
    ('00000000-0000-4000-a000-000000000001'::uuid, 'admin@rprc.test', 'admin'),
    ('00000000-0000-4000-a000-000000000002'::uuid, 'review@rprc.test', 'individual'),
    ('00000000-0000-4000-a000-000000000003'::uuid, 'org@rprc.test', 'organization'),
    ('00000000-0000-4000-a000-000000000004'::uuid, 'pending@rprc.test', 'individual'),
    ('00000000-0000-4000-a000-000000000005'::uuid, 'member@rprc.test', 'individual')
),
new_users as (
  insert into auth.users (
    instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
    confirmation_token, recovery_token, email_change, email_change_token_new
  )
  select
    '00000000-0000-0000-0000-000000000000', id, 'authenticated', 'authenticated', email,
    extensions.crypt('password123', extensions.gen_salt('bf')), now(),
    '{"provider":"email","providers":["email"]}'::jsonb, jsonb_build_object('role', role), now(), now(),
    '', '', '', ''
  from accounts
  returning id, email
)
insert into auth.identities (id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
select gen_random_uuid(), id, id::text,
  jsonb_build_object('sub', id::text, 'email', email, 'email_verified', true),
  'email', now(), now(), now()
from new_users;

-- ---------------------------------------------------------------------------
-- Profiles and addresses
-- ---------------------------------------------------------------------------
insert into public.individual_profiles (user_id, name, phone_num, phone_type) values
  ('00000000-0000-4000-a000-000000000002', 'Riley Review', '(604)-555-0102', 'cell'),
  ('00000000-0000-4000-a000-000000000004', 'Pat Pending', '(604)-555-0104', 'cell'),
  ('00000000-0000-4000-a000-000000000005', 'Morgan Member', '(604)-555-0105', 'home');

insert into public.organization_profiles (user_id, org_name, org_rep_name, org_rep_email, phone_num, phone_type) values
  ('00000000-0000-4000-a000-000000000003', 'Richmond Food Collective', 'Jordan Rep', 'jordan@example.org', '(604)-555-0103', 'cell');

insert into public.user_addresses (user_id, mailing_address, city, country, province, postal_code)
select id, '7700 Minoru Blvd', 'Richmond', 'Canada', 'British Columbia', 'V6Y 1Z5'
from auth.users where email like '%@rprc.test' and email <> 'admin@rprc.test';

-- ---------------------------------------------------------------------------
-- Applications
-- ---------------------------------------------------------------------------
insert into public.applications (id, user_id, type, status, created_at, finalized_at) values
  ('00000000-0000-4000-b000-000000000002', '00000000-0000-4000-a000-000000000002', 'individual', 'to_review', now() - interval '2 days', null),
  ('00000000-0000-4000-b000-000000000003', '00000000-0000-4000-a000-000000000003', 'organization', 'to_review', now() - interval '1 day', null),
  ('00000000-0000-4000-b000-000000000004', '00000000-0000-4000-a000-000000000004', 'individual', 'payment_pending', now() - interval '7 days', now() - interval '1 day'),
  ('00000000-0000-4000-b000-000000000005', '00000000-0000-4000-a000-000000000005', 'individual', 'active', now() - interval '60 days', now() - interval '50 days');

insert into public.individual_application_details (application_id, reason, fee_waiver, fee_waiver_reason) values
  ('00000000-0000-4000-b000-000000000002', 'I want to help reduce poverty in Richmond.', true, 'I am a student with limited income.'),
  ('00000000-0000-4000-b000-000000000004', 'I volunteer at a local food bank.', false, null),
  ('00000000-0000-4000-b000-000000000005', 'Long-time Richmond resident.', false, null);

insert into public.organization_application_details (application_id, reason, org_services) values
  ('00000000-0000-4000-b000-000000000003', 'We want to coordinate with other local organizations.', 'Weekly food distribution and meal programs.');

insert into public.application_interests (application_id, interest_id)
select v.application_id::uuid, mi.id
from (values
  ('00000000-0000-4000-b000-000000000002', 'Health'),
  ('00000000-0000-4000-b000-000000000002', 'Housing'),
  ('00000000-0000-4000-b000-000000000003', 'Health'),
  ('00000000-0000-4000-b000-000000000003', 'Other'),
  ('00000000-0000-4000-b000-000000000004', 'Education'),
  ('00000000-0000-4000-b000-000000000005', 'Environment'),
  ('00000000-0000-4000-b000-000000000005', 'Arts & Culture')
) as v(application_id, interest_name)
join public.membership_interests mi on mi.name = v.interest_name;

insert into public.application_reviews (application_id, reason, reviewer_name, decision) values
  ('00000000-0000-4000-b000-000000000004', 'Meets the membership criteria.', 'Seed Admin', 'approve'),
  ('00000000-0000-4000-b000-000000000004', 'Agreed.', 'Second Reviewer', 'approve'),
  ('00000000-0000-4000-b000-000000000005', 'Meets the membership criteria.', 'Seed Admin', 'approve'),
  ('00000000-0000-4000-b000-000000000005', 'Agreed.', 'Second Reviewer', 'approve');

insert into public.payments (user_id, application_id, amount, currency, status, stripe_session_id) values
  ('00000000-0000-4000-a000-000000000005', '00000000-0000-4000-b000-000000000005', 5, 'CAD', 'succeeded', 'cs_test_seeded_member');

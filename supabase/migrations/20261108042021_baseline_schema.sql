-- Baseline of the `public` schema as it existed on the RPRC dev project (jxvpwuyzthaetqydjmgv)
-- on 2026-11-07. Earlier migration files did not match the live database (the schema had been
-- edited by hand in the dashboard), so they were replaced by this single file.
--
-- This file intentionally mirrors the live schema exactly, including its quirks. Fix those in
-- later migrations (`npx supabase migration new <name>`), never by editing this file.
-- Reference data (membership interests) is inserted at the end. Local test accounts live in
-- supabase/seed.sql.

-- ---------------------------------------------------------------------------
-- Extensions
-- ---------------------------------------------------------------------------
create extension if not exists pg_cron with schema pg_catalog;
create extension if not exists pgcrypto with schema extensions;
create extension if not exists "uuid-ossp" with schema extensions;

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------
create type public.application_status as enum
  ('to_review', 'payment_pending', 'active', 'expired', 'conflict', 'rejected', 'expires_soon');
create type public.application_type as enum ('individual', 'organization');
create type public.payment_transaction_status as enum
  ('requires_payment_method', 'requires_confirmation', 'requires_action', 'processing', 'succeeded', 'canceled', 'failed');
create type public.phone_type as enum ('home', 'cell');
create type public.review_decision as enum ('approve', 'reject');
create type public.user_role as enum ('admin', 'individual', 'organization');

-- Unused leftovers from the original schema. Kept so this baseline matches the live database.
create type public.approval_decision as enum ('approved', 'rejected');
create type public.approval_status as enum ('to_review', 'completed', 'rejected');
create type public.membership_interest as enum ('Health', 'Environment', 'Education', 'Arts+Culture', 'Housing', 'Other');
create type public.payment_status as enum ('pending', 'approved', 'rejected');
create type public.user_status as enum ('pending', 'approved', 'rejected');

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------
create table public.users (
  id uuid not null default gen_random_uuid(),
  role public.user_role not null,
  email text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  status text,
  constraint users_pkey primary key (id),
  constraint users_email_key unique (email)
);

create table public.individual_profiles (
  user_id uuid not null,
  name text not null,
  phone_num text not null,
  phone_type public.phone_type not null,
  constraint individual_profiles_pkey primary key (user_id),
  constraint individual_profiles_user_id_fkey foreign key (user_id) references public.users (id) on delete cascade
);

create table public.organization_profiles (
  user_id uuid not null,
  org_name text not null,
  org_rep_name text not null,
  org_rep_email text,
  phone_num text not null,
  phone_type public.phone_type not null,
  constraint organization_profiles_pkey primary key (user_id),
  constraint organization_profiles_user_id_fkey foreign key (user_id) references public.users (id) on delete cascade
);

create table public.user_addresses (
  user_id uuid not null,
  mailing_address text not null,
  city text not null,
  country text not null,
  province text not null,
  postal_code text not null,
  constraint user_addresses_pkey primary key (user_id),
  constraint user_addresses_user_id_fkey foreign key (user_id) references public.users (id) on delete cascade
);

create table public.applications (
  id uuid not null default gen_random_uuid(),
  user_id uuid not null,
  type public.application_type not null,
  status public.application_status not null default 'to_review'::public.application_status,
  created_at timestamptz not null default now(),
  finalized_at timestamptz,
  constraint applications_pkey primary key (id),
  constraint applications_user_id_fkey foreign key (user_id) references public.users (id) on delete cascade
);

create table public.individual_application_details (
  application_id uuid not null,
  reason text not null,
  fee_waiver_reason text,
  fee_waiver boolean not null default false,
  constraint individual_application_details_pkey primary key (application_id),
  constraint individual_application_details_application_id_fkey
    foreign key (application_id) references public.applications (id) on delete cascade
);
comment on column public.individual_application_details.fee_waiver is
  'A boolean which determines if applicant wants to request a waiver or not';

create table public.organization_application_details (
  application_id uuid not null,
  reason text not null,
  org_services text not null,
  constraint organization_application_details_pkey primary key (application_id),
  constraint organization_application_details_application_id_fkey
    foreign key (application_id) references public.applications (id) on delete cascade
);

create table public.membership_interests (
  id bigserial not null,
  name text not null,
  constraint membership_interests_pkey primary key (id),
  constraint membership_interests_name_key unique (name)
);

create table public.application_interests (
  application_id uuid not null,
  interest_id bigint not null,
  constraint application_interests_pkey primary key (application_id, interest_id),
  constraint application_interests_application_id_fkey
    foreign key (application_id) references public.applications (id) on delete cascade,
  constraint application_interests_interest_id_fkey
    foreign key (interest_id) references public.membership_interests (id)
);

create table public.application_reviews (
  id uuid not null default gen_random_uuid(),
  application_id uuid not null,
  reason text not null,
  reviewer_name text not null,
  decision public.review_decision not null,
  created_at timestamptz not null default now(),
  -- Note: the live default is the string 'NULL', not SQL NULL.
  waiver_note text default 'NULL'::text,
  waiver_decision public.review_decision,
  constraint application_reviews_pkey primary key (id),
  constraint application_reviews_application_id_fkey
    foreign key (application_id) references public.applications (id) on delete cascade
);
comment on column public.application_reviews.waiver_note is
  'A description given by the reviewer for their decision to approve/reject the fee wavier request';

create table public.payments (
  id uuid not null default gen_random_uuid(),
  stripe_session_id text,
  stripe_payment_intent_id text,
  amount numeric not null,
  currency text not null,
  status public.payment_transaction_status not null default 'processing'::public.payment_transaction_status,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  user_id uuid not null,
  application_id uuid,
  constraint payments_pkey primary key (id),
  constraint payments_amount_check check (amount >= (0)::numeric),
  constraint payments_user_id_fkey foreign key (user_id) references public.users (id) on delete cascade,
  constraint payments_application_id_fkey
    foreign key (application_id) references public.applications (id) on delete set null
);

-- ---------------------------------------------------------------------------
-- Indexes
-- ---------------------------------------------------------------------------
create index idx_application_interests_interest_id on public.application_interests using btree (interest_id);
create index idx_application_reviews_app_id on public.application_reviews using btree (application_id);
create index idx_application_reviews_application_id on public.application_reviews using btree (application_id);
create index idx_application_reviews_created_at on public.application_reviews using btree (created_at);
create index idx_applications_status on public.applications using btree (status);
create index idx_applications_user_id on public.applications using btree (user_id);
create index idx_payments_application_id on public.payments using btree (application_id);
create index idx_payments_status on public.payments using btree (status);
create index idx_payments_stripe_payment_intent_id on public.payments using btree (stripe_payment_intent_id);
create index idx_payments_stripe_session_id on public.payments using btree (stripe_session_id);
create index idx_payments_user_id on public.payments using btree (user_id);

-- ---------------------------------------------------------------------------
-- Functions
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
 returns trigger
 language plpgsql
as $function$
begin
  new.updated_at = now();
  return new;
end;
$function$;

create or replace function public.create_user_profile()
 returns trigger
 language plpgsql
 security definer
as $function$
begin
  insert into public.users (id, email, role, created_at, updated_at)
  values (
    new.id,
    new.email,
    coalesce(
      (new.raw_user_meta_data->>'role')::public.user_role,
      'individual'::public.user_role
    ),
    now(),
    now()
  );

  return new;
end;
$function$;

create or replace function public.delete_user_profile()
 returns trigger
 language plpgsql
 security definer
as $function$
begin
  delete from public.users
  where id = old.id;

  return old;
end;
$function$;

create or replace function public.create_individual_application(p_user_id uuid, p_name text, p_phone_num text, p_phone_type phone_type, p_mailing_address text, p_city text, p_country text, p_province text, p_postal_code text, p_reason text, p_fee_waiver_reason text, p_interests text[])
 returns void
 language plpgsql
 security definer
as $function$
DECLARE
  v_application_id uuid;
  v_interest_name text;
  v_interest_id bigint;
BEGIN
  -- 1. Insert or update individual profile
  INSERT INTO public.individual_profiles (
    user_id,
    name,
    phone_num,
    phone_type
  )
  VALUES (
    p_user_id,
    p_name,
    p_phone_num,
    p_phone_type
  )
  ON CONFLICT (user_id)
  DO UPDATE SET
    name = EXCLUDED.name,
    phone_num = EXCLUDED.phone_num,
    phone_type = EXCLUDED.phone_type;

  -- 2. Insert or update user address
  INSERT INTO public.user_addresses (
    user_id,
    mailing_address,
    city,
    country,
    province,
    postal_code
  )
  VALUES (
    p_user_id,
    p_mailing_address,
    p_city,
    p_country,
    p_province,
    p_postal_code
  )
  ON CONFLICT (user_id)
  DO UPDATE SET
    mailing_address = EXCLUDED.mailing_address,
    city = EXCLUDED.city,
    country = EXCLUDED.country,
    province = EXCLUDED.province,
    postal_code = EXCLUDED.postal_code;

  -- 3. Create application
  INSERT INTO public.applications (
    user_id,
    type,
    status
  )
  VALUES (
    p_user_id,
    'individual'::application_type,
    'to_review'::application_status
  )
  RETURNING id INTO v_application_id;

  -- 4. Create individual application details
  INSERT INTO public.individual_application_details (
    application_id,
    reason,
    fee_waiver_reason
  )
  VALUES (
    v_application_id,
    p_reason,
    p_fee_waiver_reason
  );

  -- 5. Insert interests
  IF p_interests IS NOT NULL AND array_length(p_interests, 1) > 0 THEN
    FOREACH v_interest_name IN ARRAY p_interests
    LOOP
      -- Get or create interest
      INSERT INTO public.membership_interests (name)
      VALUES (v_interest_name)
      ON CONFLICT (name) DO NOTHING
      RETURNING id INTO v_interest_id;

      -- If no ID was returned (conflict), fetch it
      IF v_interest_id IS NULL THEN
        SELECT id INTO v_interest_id
        FROM public.membership_interests
        WHERE name = v_interest_name;
      END IF;

      -- Link interest to application
      INSERT INTO public.application_interests (application_id, interest_id)
      VALUES (v_application_id, v_interest_id)
      ON CONFLICT DO NOTHING;
    END LOOP;
  END IF;

EXCEPTION
  WHEN OTHERS THEN
    RAISE EXCEPTION 'Error creating individual application: %', SQLERRM;
END;
$function$;

create or replace function public.create_organization_application(p_user_id uuid, p_org_name text, p_org_rep_name text, p_org_rep_email text, p_phone_num text, p_phone_type phone_type, p_mailing_address text, p_city text, p_country text, p_province text, p_postal_code text, p_reason text, p_org_services text, p_interests text[])
 returns json
 language plpgsql
 security definer
as $function$
DECLARE
  v_application_id UUID;
  v_interest_id INT8;
  v_interest_name TEXT;
BEGIN
  -- 1. Create organization profile
  INSERT INTO organization_profiles (user_id, org_name, org_rep_name, org_rep_email, phone_num, phone_type)
  VALUES (p_user_id, p_org_name, p_org_rep_name, p_org_rep_email, p_phone_num, p_phone_type);

  -- 2. Create address
  INSERT INTO user_addresses (user_id, mailing_address, city, country, province, postal_code)
  VALUES (p_user_id, p_mailing_address, p_city, p_country, p_province, p_postal_code);

  -- 3. Create application
  INSERT INTO applications (user_id, type, status)
  VALUES (p_user_id, 'organization', 'to_review')
  RETURNING id INTO v_application_id;

  -- 4. Create application details
  INSERT INTO organization_application_details (application_id, reason, org_services)
  VALUES (v_application_id, p_reason, p_org_services);

  -- 5. Create application interests
  FOREACH v_interest_name IN ARRAY p_interests LOOP
    SELECT id INTO v_interest_id
    FROM membership_interests
    WHERE name = v_interest_name;

    IF v_interest_id IS NOT NULL THEN
      INSERT INTO application_interests (application_id, interest_id)
      VALUES (v_application_id, v_interest_id);
    END IF;
  END LOOP;

  RETURN json_build_object('success', true, 'application_id', v_application_id);
EXCEPTION
  WHEN OTHERS THEN
    RAISE EXCEPTION 'Transaction failed: %', SQLERRM;
END;
$function$;

create or replace function public.update_individual_membership_profile(p_user_id uuid, p_name text, p_phone_num text, p_phone_type phone_type, p_mailing_address text, p_city text, p_country text, p_province text, p_postal_code text, p_reason text, p_interests text[])
 returns void
 language plpgsql
 security definer
 set search_path to 'public'
as $function$
DECLARE
  v_application_id uuid;
  v_interest_name text;
  v_interest_id bigint;
BEGIN
  IF auth.uid() IS NULL OR auth.uid() <> p_user_id THEN
    RAISE EXCEPTION 'Not authorized to update this membership profile';
  END IF;

  SELECT id INTO v_application_id
  FROM applications
  WHERE user_id = p_user_id
    AND type = 'individual'::application_type
  ORDER BY created_at DESC
  LIMIT 1;

  IF v_application_id IS NULL THEN
    RAISE EXCEPTION 'Application not found for user %', p_user_id;
  END IF;

  INSERT INTO individual_profiles (user_id, name, phone_num, phone_type)
  VALUES (p_user_id, p_name, p_phone_num, p_phone_type)
  ON CONFLICT (user_id)
  DO UPDATE SET
    name = EXCLUDED.name,
    phone_num = EXCLUDED.phone_num,
    phone_type = EXCLUDED.phone_type;

  INSERT INTO user_addresses (user_id, mailing_address, city, country, province, postal_code)
  VALUES (p_user_id, p_mailing_address, p_city, p_country, p_province, p_postal_code)
  ON CONFLICT (user_id)
  DO UPDATE SET
    mailing_address = EXCLUDED.mailing_address,
    city = EXCLUDED.city,
    country = EXCLUDED.country,
    province = EXCLUDED.province,
    postal_code = EXCLUDED.postal_code;

  INSERT INTO individual_application_details (application_id, reason)
  VALUES (v_application_id, p_reason)
  ON CONFLICT (application_id)
  DO UPDATE SET reason = EXCLUDED.reason;

  DELETE FROM application_interests
  WHERE application_id = v_application_id;

  IF p_interests IS NOT NULL AND array_length(p_interests, 1) > 0 THEN
    FOR v_interest_name IN
      SELECT DISTINCT trim(value)
      FROM unnest(p_interests) AS interest(value)
      WHERE trim(value) <> ''
    LOOP
      INSERT INTO membership_interests (name)
      VALUES (v_interest_name)
      ON CONFLICT (name) DO NOTHING
      RETURNING id INTO v_interest_id;

      IF v_interest_id IS NULL THEN
        SELECT id INTO v_interest_id
        FROM membership_interests
        WHERE name = v_interest_name;
      END IF;

      INSERT INTO application_interests (application_id, interest_id)
      VALUES (v_application_id, v_interest_id);

      v_interest_id := NULL;
    END LOOP;
  END IF;
END;
$function$;

create or replace function public.update_organization_membership_profile(p_user_id uuid, p_org_name text, p_org_rep_name text, p_org_rep_email text, p_phone_num text, p_phone_type phone_type, p_mailing_address text, p_city text, p_country text, p_province text, p_postal_code text, p_reason text, p_org_services text, p_interests text[])
 returns void
 language plpgsql
 security definer
 set search_path to 'public'
as $function$
DECLARE
  v_application_id uuid;
  v_interest_name text;
  v_interest_id bigint;
BEGIN
  IF auth.uid() IS NULL OR auth.uid() <> p_user_id THEN
    RAISE EXCEPTION 'Not authorized to update this membership profile';
  END IF;

  SELECT id INTO v_application_id
  FROM applications
  WHERE user_id = p_user_id
    AND type = 'organization'::application_type
  ORDER BY created_at DESC
  LIMIT 1;

  IF v_application_id IS NULL THEN
    RAISE EXCEPTION 'Application not found for user %', p_user_id;
  END IF;

  INSERT INTO organization_profiles (
    user_id, org_name, org_rep_name, org_rep_email, phone_num, phone_type
  )
  VALUES (
    p_user_id, p_org_name, p_org_rep_name, NULLIF(p_org_rep_email, ''), p_phone_num, p_phone_type
  )
  ON CONFLICT (user_id)
  DO UPDATE SET
    org_name = EXCLUDED.org_name,
    org_rep_name = EXCLUDED.org_rep_name,
    org_rep_email = EXCLUDED.org_rep_email,
    phone_num = EXCLUDED.phone_num,
    phone_type = EXCLUDED.phone_type;

  INSERT INTO user_addresses (user_id, mailing_address, city, country, province, postal_code)
  VALUES (p_user_id, p_mailing_address, p_city, p_country, p_province, p_postal_code)
  ON CONFLICT (user_id)
  DO UPDATE SET
    mailing_address = EXCLUDED.mailing_address,
    city = EXCLUDED.city,
    country = EXCLUDED.country,
    province = EXCLUDED.province,
    postal_code = EXCLUDED.postal_code;

  INSERT INTO organization_application_details (application_id, reason, org_services)
  VALUES (v_application_id, p_reason, COALESCE(p_org_services, ''))
  ON CONFLICT (application_id)
  DO UPDATE SET
    reason = EXCLUDED.reason,
    org_services = EXCLUDED.org_services;

  DELETE FROM application_interests
  WHERE application_id = v_application_id;

  IF p_interests IS NOT NULL AND array_length(p_interests, 1) > 0 THEN
    FOR v_interest_name IN
      SELECT DISTINCT trim(value)
      FROM unnest(p_interests) AS interest(value)
      WHERE trim(value) <> ''
    LOOP
      INSERT INTO membership_interests (name)
      VALUES (v_interest_name)
      ON CONFLICT (name) DO NOTHING
      RETURNING id INTO v_interest_id;

      IF v_interest_id IS NULL THEN
        SELECT id INTO v_interest_id
        FROM membership_interests
        WHERE name = v_interest_name;
      END IF;

      INSERT INTO application_interests (application_id, interest_id)
      VALUES (v_application_id, v_interest_id);

      v_interest_id := NULL;
    END LOOP;
  END IF;
END;
$function$;

-- ---------------------------------------------------------------------------
-- Triggers
-- ---------------------------------------------------------------------------
create trigger trg_users_updated_at before update on public.users
  for each row execute function public.set_updated_at();
create trigger trg_payments_updated_at before update on public.payments
  for each row execute function public.set_updated_at();

-- Every auth signup gets a public.users row. Role comes from raw_user_meta_data.role (default 'individual').
create trigger create_profile_from_auth after insert on auth.users
  for each row execute function public.create_user_profile();
create trigger delete_profile_from_auth after delete on auth.users
  for each row execute function public.delete_user_profile();

-- ---------------------------------------------------------------------------
-- Scheduled jobs (pg_cron)
-- ---------------------------------------------------------------------------
-- Oct 31: memberships finalized before Oct 1 of this year move to expires_soon.
select cron.schedule(
  'update-application-status-to-expires-soon',
  '0 0 31 10 *',
  $cron$UPDATE applications
SET    status = 'expires_soon'::application_status
WHERE  status        = 'active'::application_status
AND    finalized_at IS NOT NULL
AND    finalized_at  < date_trunc('year', now()) + INTERVAL '9 months';$cron$
);

-- Dec 31: expires_soon memberships expire.
select cron.schedule(
  'update-application-status-to-expired',
  '0 0 31 12 *',
  $cron$UPDATE applications
SET    status = 'expired'::application_status
WHERE  status = 'expires_soon'::application_status;$cron$
);

-- ---------------------------------------------------------------------------
-- Reference data
-- ---------------------------------------------------------------------------
-- Membership interests the signup and profile forms depend on. Same ids as dev. Names must match
-- lib/constants/membership-interests.ts.
insert into public.membership_interests (id, name) values
  (1, 'Health'),
  (2, 'Education'),
  (3, 'Environment'),
  (4, 'Arts & Culture'),
  (5, 'Housing'),
  (6, 'Other');
select setval(pg_get_serial_sequence('public.membership_interests', 'id'), 6);

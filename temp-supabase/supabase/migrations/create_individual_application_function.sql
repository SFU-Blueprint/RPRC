-- =========================
-- RPC Function: Create Individual Application
-- =========================
CREATE OR REPLACE FUNCTION public.create_individual_application(
  p_user_id uuid,
  p_name text,
  p_phone_num text,
  p_phone_type phone_type,
  p_mailing_address text,
  p_city text,
  p_country text,
  p_province text,
  p_postal_code text,
  p_reason text,
  p_fee_waiver_reason text,
  p_interests text[]
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
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
$$;

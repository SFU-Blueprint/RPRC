CREATE OR REPLACE FUNCTION public.update_individual_membership_profile(
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
  p_interests text[]
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
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

  INSERT INTO individual_profiles (
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

  INSERT INTO user_addresses (
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

  INSERT INTO individual_application_details (
    application_id,
    reason
  )
  VALUES (
    v_application_id,
    p_reason
  )
  ON CONFLICT (application_id)
  DO UPDATE SET
    reason = EXCLUDED.reason;

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

      INSERT INTO application_interests (
        application_id,
        interest_id
      )
      VALUES (
        v_application_id,
        v_interest_id
      );

      v_interest_id := NULL;
    END LOOP;
  END IF;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_organization_membership_profile(
  p_user_id uuid,
  p_org_name text,
  p_org_rep_name text,
  p_org_rep_email text,
  p_phone_num text,
  p_phone_type phone_type,
  p_mailing_address text,
  p_city text,
  p_country text,
  p_province text,
  p_postal_code text,
  p_reason text,
  p_org_services text,
  p_interests text[]
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
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
    user_id,
    org_name,
    org_rep_name,
    org_rep_email,
    phone_num,
    phone_type
  )
  VALUES (
    p_user_id,
    p_org_name,
    p_org_rep_name,
    NULLIF(p_org_rep_email, ''),
    p_phone_num,
    p_phone_type
  )
  ON CONFLICT (user_id)
  DO UPDATE SET
    org_name = EXCLUDED.org_name,
    org_rep_name = EXCLUDED.org_rep_name,
    org_rep_email = EXCLUDED.org_rep_email,
    phone_num = EXCLUDED.phone_num,
    phone_type = EXCLUDED.phone_type;

  INSERT INTO user_addresses (
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

  INSERT INTO organization_application_details (
    application_id,
    reason,
    org_services
  )
  VALUES (
    v_application_id,
    p_reason,
    COALESCE(p_org_services, '')
  )
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

      INSERT INTO application_interests (
        application_id,
        interest_id
      )
      VALUES (
        v_application_id,
        v_interest_id
      );

      v_interest_id := NULL;
    END LOOP;
  END IF;
END;
$$;

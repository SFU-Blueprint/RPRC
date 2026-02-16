-- supabase/migrations/20260215154943_create_organization_application_function.sql

CREATE OR REPLACE FUNCTION create_organization_application(
  p_user_id UUID,
  p_org_name TEXT,
  p_org_rep_name TEXT,
  p_org_rep_email TEXT,
  p_phone_num TEXT,
  p_phone_type phone_type,
  p_mailing_address TEXT,
  p_city TEXT,
  p_country TEXT,
  p_province TEXT,
  p_postal_code TEXT,
  p_reason TEXT,
  p_org_services TEXT,
  p_interests TEXT[]
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
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
$$;
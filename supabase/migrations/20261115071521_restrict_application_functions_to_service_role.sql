-- Only the server may create applications.
--
-- create_individual_application and create_organization_application are security definer
-- and take p_user_id without checking auth.uid(), so anyone holding the publishable key
-- could create an application for any user. The sign-up server actions now call them
-- with the service-role client (lib/supabase/admin.ts), so clients don't need them.
--
-- Supabase's default privileges grant EXECUTE on every new function to anon and
-- authenticated. If either function is ever dropped and recreated (e.g. to change its
-- parameters), that grant comes back: re-apply this revoke in the same migration.

revoke execute on function public.create_individual_application(
  uuid, text, text, phone_type, text, text, text, text, text, text, text, text[], boolean
) from public, anon, authenticated;

grant execute on function public.create_individual_application(
  uuid, text, text, phone_type, text, text, text, text, text, text, text, text[], boolean
) to service_role;

revoke execute on function public.create_organization_application(
  uuid, text, text, text, text, phone_type, text, text, text, text, text, text, text, text[]
) from public, anon, authenticated;

grant execute on function public.create_organization_application(
  uuid, text, text, text, text, phone_type, text, text, text, text, text, text, text, text[]
) to service_role;

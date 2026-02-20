import { ApplicationStatus } from '@/lib/constants/enums';
import { createClient } from '@/lib/supabase/server';

export async function getAdminApplicationHeaderServer(appId: string): Promise<{
  name: string;
  status: ApplicationStatus | null;
}> {
  const supabase = await createClient();

  const { data: applicationData } = await supabase
    .from('applications')
    .select('user_id, status')
    .eq('id', appId)
    .maybeSingle();

  if (!applicationData) {
    return { name: 'Unknown Applicant', status: null };
  }

  const { data: userData } = await supabase
    .from('users')
    .select('individual_profiles(name), organization_profiles(org_name)')
    .eq('id', applicationData.user_id)
    .maybeSingle();

  const individualName =
    (userData?.individual_profiles as { name?: string } | null)?.name ?? '';
  const organizationName =
    (userData?.organization_profiles as { org_name?: string } | null)?.org_name ??
    '';

  return {
    name: individualName || organizationName || 'Unknown Applicant',
    status: applicationData.status as ApplicationStatus,
  };
}

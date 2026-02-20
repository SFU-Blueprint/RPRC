'use client';

import { createClient } from '@/lib/supabase/client';
import { ApplicationStatus } from '@/lib/constants/enums';

export type MembershipInterestItem = {
  id: number;
  name: string;
};

export async function getMembershipInterests(): Promise<MembershipInterestItem[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('membership_interests')
    .select('id, name')
    .order('name', { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as MembershipInterestItem[];
}

export async function getAdminApplicationHeader(appId: string): Promise<{
  name: string;
  status: ApplicationStatus | null;
}> {
  const supabase = createClient();

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

export async function getUserRoleById(userId: string): Promise<string | undefined> {
  const supabase = createClient();
  const { data } = await supabase
    .from('users')
    .select('role')
    .eq('id', userId)
    .maybeSingle();

  return data?.role as string | undefined;
}

import { createClient } from '@/lib/supabase/server';
import type { Database } from '@/types/database';
import type { AdminApplicationPageData } from '@/types/admin.types';

export async function getAdminApplicationPageDataServer(
  appId: string,
): Promise<AdminApplicationPageData> {
  const supabase = await createClient();

  const { data: application } = await supabase
    .from('applications')
    .select('id, user_id, type, status, created_at')
    .eq('id', appId)
    .maybeSingle();

  if (!application) {
    return {
      headerName: 'Unknown Applicant',
      headerStatus: null,
      details: {
        type: 'individual',
        interests: [],
        reason: '',
        contact: {
          email: '',
          phone: '',
          address: '',
        },
        dateReceived: '',
      },
      reviewHistory: [],
    };
  }

  const [
    { data: userData },
    { data: userAddress },
    { data: individualDetails },
    { data: organizationDetails },
    { data: interestRows },
    { data: reviewRows },
  ] = await Promise.all([
    supabase
      .from('users')
      .select(
        'email, individual_profiles(name, phone_num), organization_profiles(org_name, phone_num)',
      )
      .eq('id', application.user_id)
      .maybeSingle(),
    supabase
      .from('user_addresses')
      .select('mailing_address, city, province, country, postal_code')
      .eq('user_id', application.user_id)
      .maybeSingle(),
    supabase
      .from('individual_application_details')
      .select('reason, fee_waiver_reason, fee_waiver')
      .eq('application_id', appId)
      .maybeSingle(),
    supabase
      .from('organization_application_details')
      .select('reason')
      .eq('application_id', appId)
      .maybeSingle(),
    supabase
      .from('application_interests')
      .select('membership_interests(name)')
      .eq('application_id', appId),
    supabase
      .from('application_reviews')
      .select('id, application_id, reason, reviewer_name, decision, created_at, waiver_decision')
      .eq('application_id', appId)
      .order('created_at', { ascending: true }),
  ]);

  const individualProfile = userData?.individual_profiles as
    | { name?: string; phone_num?: string }
    | { name?: string; phone_num?: string }[]
    | null;
  const organizationProfile = userData?.organization_profiles as
    | { org_name?: string; phone_num?: string }
    | { org_name?: string; phone_num?: string }[]
    | null;

  const individual = Array.isArray(individualProfile)
    ? individualProfile[0]
    : individualProfile;
  const organization = Array.isArray(organizationProfile)
    ? organizationProfile[0]
    : organizationProfile;

  const headerName =
    individual?.name || organization?.org_name || 'Unknown Applicant';
  const phone = individual?.phone_num || organization?.phone_num || '';
  const reason =
    application.type === 'organization'
      ? (organizationDetails?.reason ?? '')
      : (individualDetails?.reason ?? '');

  const feeWaiverRequested = application.type === 'organization'
    ? false
    : (individualDetails?.fee_waiver ?? false);
  const feeWaiverReason = application.type === 'organization'
    ? null
    : (individualDetails?.fee_waiver_reason ?? '');
  const interests = (interestRows ?? [])
    .map((row) => {
      const relation = row.membership_interests as
        | { name?: string }
        | { name?: string }[]
        | null;
      if (Array.isArray(relation)) {
        return relation[0]?.name ?? '';
      }
      return relation?.name ?? '';
    })
    .filter(Boolean);

  const address = userAddress
    ? [
      userAddress.mailing_address,
      userAddress.city,
      userAddress.province,
      userAddress.country,
      userAddress.postal_code,
    ]
      .filter(Boolean)
      .join(', ')
    : '';

  return {
    headerName,
    headerStatus: application.status as Database['public']['Enums']['application_status'],
    details: {
      type: application.type as Database['public']['Enums']['application_type'],
      interests,
      reason,
      feeWaiverRequested,
      feeWaiverReason,
      contact: {
        email: userData?.email ?? '',
        phone,
        address,
      },
      dateReceived: application.created_at ?? '',
    },
    reviewHistory:
      (reviewRows as Database['public']['Tables']['application_reviews']['Row'][] | null) ??
      [],
  };
}

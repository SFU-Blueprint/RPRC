import { createClient } from '@/lib/supabase/server';
import type { Database } from '@/types/database';
import type { MemberDashboardData } from '@/types/membership.types';


export async function getMemberDashboardData(
    userId: string,
): Promise<MemberDashboardData> {
    const supabase = await createClient();

    const { data: application } = await supabase
        .from('applications')
        .select('id, type, status, created_at, finalized_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

    const empty: MemberDashboardData = {
        name: '',
        status: null,
        type: null,
        interests: [],
        reason: '',
        contact: { email: '', phone: '', address: '' },
        dateReceived: '',
        dateFinalized: '',
    };

    if (!application) return empty;

    const [
        { data: userData },
        { data: userAddress },
        { data: individualDetails },
        { data: organizationDetails },
        { data: interestRows },
    ] = await Promise.all([
        supabase
            .from('users')
            .select(
                'email, individual_profiles(name, phone_num), organization_profiles(org_name, phone_num)',
            )
            .eq('id', userId)
            .maybeSingle(),
        supabase
            .from('user_addresses')
            .select('mailing_address, city, province, country, postal_code')
            .eq('user_id', userId)
            .maybeSingle(),
        supabase
            .from('individual_application_details')
            .select('reason')
            .eq('application_id', application.id)
            .maybeSingle(),
        supabase
            .from('organization_application_details')
            .select('reason')
            .eq('application_id', application.id)
            .maybeSingle(),
        supabase
            .from('application_interests')
            .select('membership_interests(name)')
            .eq('application_id', application.id),
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

    const name = individual?.name ?? organization?.org_name ?? '';
    const phone = individual?.phone_num ?? organization?.phone_num ?? '';

    const reason =
        application.type === 'organization'
            ? (organizationDetails?.reason ?? '')
            : (individualDetails?.reason ?? '');

    const interests = (interestRows ?? [])
        .map((row) => {
            const relation = row.membership_interests as
                | { name?: string }
                | { name?: string }[]
                | null;
            if (Array.isArray(relation)) return relation[0]?.name ?? '';
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
        name,
        status: application.status as Database['public']['Enums']['application_status'],
        type: application.type as Database['public']['Enums']['application_type'],
        interests,
        reason,
        contact: {
            email: userData?.email ?? '',
            phone,
            address,
        },
        dateReceived: application.created_at ?? '',
        dateFinalized: application.finalized_at ?? '',
    };
}

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
        contact: {
            email: '',
            phone: '',
            phoneType: null,
            address: '',
            addressFields: {
                mailingAddress: '',
                city: '',
                province: '',
                country: '',
                postalCode: '',
            },
        },
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
                'email, individual_profiles(name, phone_num, phone_type), organization_profiles(org_name, phone_num, phone_type, org_rep_name, org_rep_email)'
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
            .select('reason, org_services')
            .eq('application_id', application.id)
            .maybeSingle(),
        supabase
            .from('application_interests')
            .select('membership_interests(name)')
            .eq('application_id', application.id),
    ]);

    const individualProfile = userData?.individual_profiles as
        | { name?: string; phone_num?: string; phone_type?: Database['public']['Enums']['phone_type'] }
        | { name?: string; phone_num?: string; phone_type?: Database['public']['Enums']['phone_type'] }[]
        | null;
    const organizationProfile = userData?.organization_profiles as
        | { org_name?: string; phone_num?: string; phone_type?: Database['public']['Enums']['phone_type']; org_rep_name?: string; org_rep_email?: string }
        | { org_name?: string; phone_num?: string; phone_type?: Database['public']['Enums']['phone_type']; org_rep_name?: string; org_rep_email?: string }[]
        | null;

    const individual = Array.isArray(individualProfile)
        ? individualProfile[0]
        : individualProfile;
    const organization = Array.isArray(organizationProfile)
        ? organizationProfile[0]
        : organizationProfile;

    const name = individual?.name ?? organization?.org_name ?? '';
    const phone = individual?.phone_num ?? organization?.phone_num ?? '';
    const phoneType = individual?.phone_type ?? organization?.phone_type ?? null;
    const representativeName = organization?.org_rep_name ?? null;
    const representativeEmail = organization?.org_rep_email ?? null;

    const reason =
        application.type === 'organization'
            ? (organizationDetails?.reason ?? '')
            : (individualDetails?.reason ?? '');

    const servicesOffered = organizationDetails?.org_services ?? null;

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
            phoneType,
            address,
            addressFields: {
                mailingAddress: userAddress?.mailing_address ?? '',
                city: userAddress?.city ?? '',
                province: userAddress?.province ?? '',
                country: userAddress?.country ?? '',
                postalCode: userAddress?.postal_code ?? '',
            },
        },
        representativeName,
        representativeEmail,
        servicesOffered,
        dateReceived: application.created_at ?? '',
        dateFinalized: application.finalized_at ?? '',
    };
}

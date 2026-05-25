'use server';

import { revalidatePath } from 'next/cache';
import { getMemberDashboardData } from '@/lib/api/services/server/member-dashboard-service';
import { createClient } from '@/lib/supabase/server';
import { ApplicationStatus } from '@/lib/constants/enums';
import { ROUTES } from '@/lib/constants/routes';
import type { MemberDashboardData } from '@/types/membership.types';
import { ApplicationErrorCode } from '@/lib/constants/application-errors';
import type {
    MembershipProfileUpdateResult,
    MembershipProfileUpdateBase,
    IndividualMembershipProfileUpdate,
    OrganizationMembershipProfileUpdate
} from '@/types/membership.types';

function formatPhoneWithAreaCode(phoneNumber: string): string {
    const normalized = phoneNumber.trim();
    if (!normalized) return normalized;
    if (normalized.startsWith('+1')) return normalized;
    return `+1 ${normalized}`;
}

function hasMissingRequiredFields(
    values: Record<string, string | string[] | null | undefined>,
    requiredFields: string[],
) {
    return requiredFields.some((field) => {
        const value = values[field];
        if (Array.isArray(value)) return value.length === 0;
        if (typeof value === 'string') return value.trim().length === 0;
        return !value;
    });
}

export async function fetchMemberDashboardData(): Promise<MemberDashboardData | null> {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) return null;

    return getMemberDashboardData(user.id);
}

function buildSharedProfileUpdatePayload(
    userId: string,
    values: MembershipProfileUpdateBase,
) {
    return {
        p_user_id: userId,
        p_phone_num: formatPhoneWithAreaCode(values.phone),
        p_phone_type: values.phoneType,
        p_mailing_address: values.mailingAddress,
        p_city: values.city,
        p_country: values.country,
        p_province: values.province,
        p_postal_code: values.postalCode,
        p_reason: values.reason,
        p_interests: values.interests,
    };
}

export async function submitIndividualMembershipProfileUpdate(
    values: IndividualMembershipProfileUpdate,
): Promise<MembershipProfileUpdateResult> {
    if (hasMissingRequiredFields(values, [
        'name',
        'phone',
        'phoneType',
        'mailingAddress',
        'city',
        'province',
        'country',
        'postalCode',
        'reason',
    ])) {
        return { success: false, error: 'Missing one or more required fields' };
    }

    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return { success: false, error: 'User not authenticated' };
    }

    try {
        // Call RPC function for individual application creation
        const { error: rpcError } = await supabase.rpc(
            'update_individual_membership_profile',
            {
                ...buildSharedProfileUpdatePayload(user.id, values),
                p_name: values.name,
            },
        );

        if (rpcError) {
            throw new Error(`DB transaction failed: ${rpcError.message}`);
        }
    } catch (error) {
        console.error('Individual membership profile update error:', error);
        return {
            success: false,
            error:
                error instanceof Error
                    ? error.message
                    : 'Failed to edit membership profile',
            code: ApplicationErrorCode.SERVER_ERROR,
        };
    }

    revalidatePath(ROUTES.MEMBERSHIP_DASHBOARD);

    return { success: true };
}

export async function submitOrganizationMembershipProfileUpdate(
    values: OrganizationMembershipProfileUpdate,
): Promise<MembershipProfileUpdateResult> {
    if (hasMissingRequiredFields(values, [
        'name',
        'phone',
        'phoneType',
        'mailingAddress',
        'city',
        'province',
        'country',
        'postalCode',
        'whyrpcmember',
        'organizationservices',
        'representativeName',
    ])) {
        return { success: false, error: 'Missing one or more required fields' };
    }

    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
        return { success: false, error: 'User not authenticated' };
    }

    try {
        const { error: rpcError } = await supabase.rpc(
            'update_organization_membership_profile',
            {
                ...buildSharedProfileUpdatePayload(user.id, values),
                p_org_name: values.name,
                p_org_rep_name: values.representativeName,
                p_org_rep_email: values.representativeEmail || null,
                p_org_services: values.servicesOffered ?? '',
            },
        );

        if (rpcError) {
            throw new Error(`DB transaction failed: ${rpcError.message}`);
        }
    } catch (error) {
        console.error('Organization membership profile update error:', error);
        return {
            success: false,
            error:
                error instanceof Error
                    ? error.message
                    : 'Failed to edit membership profile',
            code: ApplicationErrorCode.SERVER_ERROR,
        };
    }

    revalidatePath(ROUTES.MEMBERSHIP_DASHBOARD);

    return { success: true };
}

export async function submitMembershipRenewal(): Promise<{ success: boolean; error?: string }> {
    try {
        const supabase = await createClient();
        const {
            data: { user },
        } = await supabase.auth.getUser();
        if (!user) {
            return { success: false, error: 'User not authenticated' };
        }

        const { data: application, error: fetchError } = await supabase
            .from('applications')
            .select('id')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle();

        if (fetchError || !application) {
            return { success: false, error: 'Application not found' };
        }

        const { error: updateError } = await supabase
            .from('applications')
            .update({ status: ApplicationStatus.TO_REVIEW })
            .eq('id', application.id);

        if (updateError) {
            return { success: false, error: 'Failed to submit renewal' };
        }

        return { success: true };
    } catch (error) {
        return { success: false, error: 'An unexpected error occurred' };
    }
}

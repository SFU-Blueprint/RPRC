'use server';

import { getMemberDashboardData } from '@/lib/api/services/server/member-dashboard-service';
import { createClient } from '@/lib/supabase/server';
import { ApplicationStatus } from '@/lib/constants/enums';
import type { MemberDashboardData } from '@/types/membership.types';

export async function fetchMemberDashboardData(userId: string): Promise<MemberDashboardData> {
    return getMemberDashboardData(userId);
}

export async function submitMembershipRenewal(userId: string): Promise<{ success: boolean; error?: string }> {
    try {
        const supabase = await createClient();

        // Get the latest application for this user
        const { data: application, error: fetchError } = await supabase
            .from('applications')
            .select('id')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle();

        if (fetchError || !application) {
            return { success: false, error: 'Application not found' };
        }

        // Update the application status to TO_REVIEW
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

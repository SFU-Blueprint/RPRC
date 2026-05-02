'use server';

import { getMemberDashboardData, deleteMemberProfile } from '@/lib/api/services/server/dashboard-service';
import type { MemberDashboardData } from '@/types/membership.types';
import { redirect } from 'next/navigation';
import { ROUTES } from '@/lib/constants/routes';

export async function fetchMemberDashboardData(userId: string): Promise<MemberDashboardData> {
    return getMemberDashboardData(userId);
}

export async function removeMemberProfile(userId: string, reason: string): Promise<{ error: string } | { success: true }> {
    const result = await deleteMemberProfile(userId);
    if ('error' in result) return { error: result.error };
    redirect(ROUTES.HOME);
}
'use server';

import { getMemberDashboardData } from '@/lib/api/services/server/dashboard-service';
import type { MemberDashboardData } from '@/types/membership.types';

export async function fetchMemberDashboardData(userId: string): Promise<MemberDashboardData> {
    return getMemberDashboardData(userId);
}

/**
 * Admin applications data layer.
 */

import { createClient } from '@/lib/supabase/server';
import { ApplicationStatus } from '@/lib/constants/enums';
import type {
    ApplicationType,
    ApplicationRow,
    UserWithProfilesRow,
    ReviewRow,
    ReviewerPair,
    AdminDashboardStats,
} from '@/types/admin.types';

/* Application status values from shared enum (single source of truth). */

const VALID_STATUSES = Object.values(ApplicationStatus) as readonly ApplicationType['status'][];

/* Map database status to ApplicationType status. */

function mapApplicationStatus(dbStatus: string): ApplicationType['status'] {
    if (VALID_STATUSES.includes(dbStatus as ApplicationType['status'])) {
        return dbStatus as ApplicationType['status'];
    }
    return ApplicationStatus.TO_REVIEW;
}

/* Row mapper: one application row + name + reviewers → ApplicationType.*/

function mapRowToApplicationType(
    row: ApplicationRow,
    applicantName: string,
    reviewers: ReviewerPair
): ApplicationType {
    return {
        id: row.id,
        applicantName,
        type: row.type,
        dateReceived: row.created_at,
        status: mapApplicationStatus(row.status),
        reviewer1: reviewers.reviewer1,
        reviewer2: reviewers.reviewer2,
    };
}

/* 
 * Build a map: user_id → applicant display name.
 */

function buildApplicantNameMap(users: UserWithProfilesRow[]): Map<string, string> {
    const map = new Map<string, string>();
    for (const u of users) {
        const ip = u.individual_profiles;
        const op = u.organization_profiles;
        const individualName = Array.isArray(ip) ? ip[0]?.name : (ip as { name: string } | null)?.name;
        const orgName = Array.isArray(op) ? op[0]?.org_name : (op as { org_name: string } | null)?.org_name;
        const name = individualName ?? orgName ?? 'Unknown';
        map.set(u.id, name);
    }
    return map;
}

/* Build a map: application_id → { reviewer1, reviewer2 }.
 * Reviews are ordered by created_at; first two per application. */

function buildReviewerMap(reviews: ReviewRow[]): Map<string, ReviewerPair> {
    const byApp = new Map<string, ReviewRow[]>();
    for (const r of reviews) {
        const list = byApp.get(r.application_id) ?? [];
        list.push(r);
        byApp.set(r.application_id, list);
    }
    const result = new Map<string, ReviewerPair>();
    for (const [appId, list] of byApp) {
        const sorted = [...list].sort(
            (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
        result.set(appId, {
            reviewer1: sorted[0]?.reviewer_name ?? '',
            reviewer2: sorted[1]?.reviewer_name ?? '',
        });
    }
    return result;
}

/* getAdminApplicationList() Fetches all applications,
then names and reviewers in two extra queries */

export async function getAdminApplicationList(): Promise<ApplicationType[]> {
    const supabase = await createClient();

    // 1) Applications: no joins, just the columns we need
    const { data: applicationRows, error: appError } = await supabase
        .from('applications')
        .select('id, created_at, status, type, user_id')
        .order('created_at', { ascending: false });

    if (appError) {
        console.error('[getAdminApplicationList] applications query failed:', appError);
        throw new Error('Failed to load applications. Please try again.');
    }

    const rows = (applicationRows ?? []) as ApplicationRow[];
    if (rows.length === 0) {
        return [];
    }

    const userIds = [...new Set(rows.map((r) => r.user_id))];
    const appIds = rows.map((r) => r.id);

    // 2) Applicant names: one query for all users with profile relations
    let nameMap = new Map<string, string>();
    if (userIds.length > 0) {
        const { data: usersData } = await supabase
            .from('users')
            .select('id, individual_profiles(name), organization_profiles(org_name)')
            .in('id', userIds);

        const users = (usersData ?? []) as unknown as UserWithProfilesRow[];
        nameMap = buildApplicantNameMap(users);
    }

    // 3) Reviewers: one query for all reviews for these applications
    let reviewerMap = new Map<string, ReviewerPair>();
    if (appIds.length > 0) {
        const { data: reviewsData } = await supabase
            .from('application_reviews')
            .select('application_id, reviewer_name, created_at')
            .in('application_id', appIds)
            .order('created_at', { ascending: true });

        const reviews = (reviewsData ?? []) as ReviewRow[];
        reviewerMap = buildReviewerMap(reviews);
    }

    // 4) Map each row to ApplicationType
    return rows.map((row) =>
        mapRowToApplicationType(
            row,
            nameMap.get(row.user_id) ?? 'Unknown',
            reviewerMap.get(row.id) ?? { reviewer1: '', reviewer2: '' }
        )
    );
}


/* Pure helper: count applications with status TO_REVIEW (no async, no Supabase). */

function countApplicationsToReview(applications: ApplicationType[]): number {
    return applications.filter((a) => a.status === ApplicationStatus.TO_REVIEW).length;
}



/* getAdminDashboardStats() Derives counts from the same list. */

export async function getAdminDashboardStats(): Promise<AdminDashboardStats> {
    const list = await getAdminApplicationList();
    const independent = list.filter((a) => a.type === 'individual').length;
    const organization = list.filter((a) => a.type === 'organization').length;
    return {
        independent,
        organization,
        toReview: countApplicationsToReview(list),
    };
}

import { ReviewDecision } from "@/lib/constants";

/**
 * Used to simulate supabase db row type for application reviews.
 * Can be deleted once updated supabase types are generated
 */
export type ReviewHistoryMockType = {
    id: string;
    application_id: string;
    reason: string;
    reviewer_name: string;
    decision: ReviewDecision;
    created_at: string;
}
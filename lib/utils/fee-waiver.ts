import { ReviewDecision } from '@/lib/constants/enums';
import type { Database } from '@/types/database';

type Decision = Database['public']['Enums']['review_decision'];

type ReviewWaiver = {
  decision: Decision;
  waiver_decision: Decision | null;
};

/**
 * Whether an approved application's fee waiver is granted.
 *
 * The first approving review in the round that recorded a waiver decision decides it. When
 * the approval comes from resolving a conflict, the resolution's waiver decision (if it gave
 * one) overrides that. Rejecting reviews can't carry a waiver decision.
 *
 * Review timestamps can't order reviews (they hold the reviewer's chosen date at midnight),
 * so the order comes from how an application reaches approval: either two approvals in a row
 * (the saved review came first) or one approval and one rejection followed by the resolution.
 * Either way at most one earlier review is an approval.
 */
export function isFeeWaiverGranted({
  requested,
  earlierReviews,
  currentReview,
  resolvesConflict,
}: {
  requested: boolean;
  earlierReviews: ReviewWaiver[];
  currentReview: ReviewWaiver;
  resolvesConflict: boolean;
}): boolean {
  if (!requested) return false;

  if (resolvesConflict && currentReview.waiver_decision)
    return currentReview.waiver_decision === ReviewDecision.APPROVE;

  const decided = [...earlierReviews, currentReview].find(
    (review) =>
      review.decision === ReviewDecision.APPROVE && review.waiver_decision,
  )?.waiver_decision;

  return decided === ReviewDecision.APPROVE;
}

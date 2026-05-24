import { BackdropContainer } from '@/components/admin/layout/BackdropContainer';
import { AdminSection } from './AdminSection';
import { robotoCondensed } from '@/app/fonts';
import { Clock } from 'lucide-react';
import type { ReviewHistoryItem } from '@/types/admin.types';
import AdminReview from './AdminReview';

export default function ReviewHistory({ reviewHistory, isMobile }: { reviewHistory: ReviewHistoryItem[], isMobile: boolean }) {

  return (
    <BackdropContainer className={`bg-signup-neutral-50 shadow-card p-4 text w-full ${isMobile ? '' : 'mt-12'}`} >
      <p className={`${robotoCondensed.className} text-3xl font-bold border-b pb-5`}>Review History</p>
      {reviewHistory.length === 0 && (
        <BackdropContainer className="bg-signup-neutral-50 border border-application-detail-border-50 shadow-none mt-8">
          <div className="flex flex-col items-center gap-y-5">
            <Clock size={48} className="text-application-detail-text-secondary" />
            <p className="text-application-detail-text-secondary">No Recent Reviews...</p>
          </div>
        </BackdropContainer>
      )}

      {[...reviewHistory].reverse().map((review: ReviewHistoryItem, index) => {
        return (
          <AdminReview
            key={review.id}
            createdAt={review.created_at}
            reviewerName={review.reviewer_name}
            decision={review.decision}
            reason={review.reason}
            waiverDecision={review.waiver_decision}
            // if there was a conflict and there are more than 2 reviews,
            // we know that the first review in the reversed array is the most recent and thus the final decision
            isFinalDecision={reviewHistory.length > 2 && index === 0}
          />
        );
      })}
    </BackdropContainer>
  );
}

import React from 'react';
import { AdminReviewProps } from '@/types/admin.types';
import { BackdropContainer } from '@/components/admin/layout/BackdropContainer';
import StatusChip from '../StatusChip';
import { ReviewDecision } from '@/lib/constants/enums';
import { formatDateWithOrdinal } from '@/lib/utils/time-utils';

const getBackgroundColor = (decision: ReviewDecision, isFinalDecision: boolean) => {
  if (!isFinalDecision) {
    return 'bg-signup-neutral-50';
  }

  if (decision === ReviewDecision.APPROVE) {
    return 'bg-application-approved';
  }

  if (decision === ReviewDecision.REJECT) {
    return 'bg-application-rejected';
  }
}

const getBorderColor = (decision: ReviewDecision, isFinalDecision: boolean) => {
  if (!isFinalDecision) {
    return 'border-application-detail-border-50';
  }

  if (decision === ReviewDecision.APPROVE) {
    return 'border-application-approved-border';
  }

  if (decision === ReviewDecision.REJECT) {
    return 'border-application-rejected-border';
  }
}

export default function AdminReview({ createdAt, reviewerName, decision, reason, waiverDecision, isFinalDecision }: AdminReviewProps) {
  const formattedDate = formatDateWithOrdinal(createdAt);

  return (
    <BackdropContainer className={`${getBackgroundColor(decision, isFinalDecision)} border ${getBorderColor(decision, isFinalDecision)} shadow-none mt-8`} >
      <div className="grid grid-cols-3 items-center mt-2 mb-4">
          <div>
            <p className="text-application-detail-text-secondary text-sm">{formattedDate}</p>
            <p className="text-application-detail-text-primary font-bold text-lg">
              {isFinalDecision ? 'Conflict Resolved' : reviewerName}
            </p>
          </div>
          <div className="pl-8">
            {
              (waiverDecision !== null) && (
                <div>
                  <p className="text-application-detail-text-secondary text-sm">Fee Waived?</p>
                  {
                    waiverDecision === ReviewDecision.APPROVE ? (
                        <p className="text-application-detail-text-primary font-bold text-lg">Yes</p>
                      ) :
                      (<p className="text-application-detail-text-primary font-bold text-lg">No</p>)
                  }
                </div>
              )
            }
          </div>
        <div className="flex justify-end">
          <StatusChip theme={decision} />
        </div>
      </div>
      <p className="text-application-detail-text-primary">{reason}</p>
    </BackdropContainer>
  )
}

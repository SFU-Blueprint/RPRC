import React from 'react';
import { AdminReviewProps } from '@/types/admin.types';
import { BackdropContainer } from '@/components/ui/BackdropContainer';
import StatusChip from '../StatusChip';
import { ReviewDecision } from '@/lib/constants/enums';

const getBackgroundColor = (decision: ReviewDecision, isFinalDecision: boolean) => {
    if (!isFinalDecision) {
        return 'bg-white';
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
        return 'border-application-detail-border-100';
    }

    if (decision === ReviewDecision.APPROVE) {
        return 'border-application-approved-border';
    }

    if (decision === ReviewDecision.REJECT) {
        return 'border-application-rejected-border';
    }
}

export default function AdminReview({ createdAt, reviewerName, decision, reason, isFinalDecision }: AdminReviewProps) {
    return (
        <BackdropContainer className={`${getBackgroundColor(decision, isFinalDecision)} border border-1 ${getBorderColor(decision, isFinalDecision)} shadow-none`} >
            <p className="text-application-detail-text-secondary text-sm">{createdAt}</p>
            <div className="flex items-center justify-between mt-2 mb-4">
                <p className="text-application-detail-text-primary font-bold text-lg">{reviewerName}</p>
                <StatusChip theme={decision} />
            </div>
            <p className="text-application-detail-text-primary">{reason}</p>
        </BackdropContainer>
    )
}

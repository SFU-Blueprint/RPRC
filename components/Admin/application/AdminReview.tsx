import React from 'react';
import { AdminReviewProps } from '@/types/admin.types';
import { BackdropContainer } from '@/components/ui/BackdropContainer';
import StatusChip from '../StatusChip';

const getBackgroundColor = (decision: string, isFinalDecision: boolean) => {
    if (!isFinalDecision) {
        return 'bg-white';
    }

    if (decision === 'approve') {
        return 'bg-application-approved';
    }

    if (decision === 'reject') {
        return 'bg-application-rejected';
    }
}

const getBorderColor = (decision: string, isFinalDecision: boolean) => {
    if (!isFinalDecision) {
        return 'border-application-detail-border-100';
    }

    if (decision === 'approve') {
        return 'border-application-approved-border';
    }

    if (decision === 'reject') {
        return 'border-application-rejected-border';
    }
}

export default function AdminReview({ createdAt, reviewerName, decision, reason, isFinalDecision }: AdminReviewProps) {
    return (
        <BackdropContainer className={`${getBackgroundColor(decision, isFinalDecision)} border border-1 ${getBorderColor(decision, isFinalDecision)} shadow-none`} >
            <p className="text-application-detail-text-secondary text-sm">{createdAt}</p>
            <div className="flex items-center justify-between mt-2 mb-4">
                <p className="text-application-detail-text-primary font-bold text-lg">{reviewerName}</p>
                <StatusChip theme={decision === 'approve' ? 'approved' : 'rejected'} />
            </div>
            <p className="text-application-detail-text-primary">{reason}</p>
        </BackdropContainer>
    )
}

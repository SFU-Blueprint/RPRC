'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { robotoCondensed } from '@/app/fonts';
import type { ReviewHistoryItem } from '@/types/admin.types';
import { CONFIRM_REVIEW_TEXT } from '@/lib/constants/admin';
import { ReviewDecision } from '@/lib/constants';

type SubmitReviewModalProps = {
  isOpen: boolean;
  reviewHistory: ReviewHistoryItem[];
  action: ReviewDecision;
  isSubmitting: boolean;
  onConfirm: () => void;
  setModalOpen: (isOpen: boolean) => void;
};

const getModalText = (reviewHistory: ReviewHistoryItem[], action: ReviewDecision) => {
  const numberOfReviews = reviewHistory.length;
  const numberApproved = reviewHistory.filter(review => review.decision === ReviewDecision.APPROVE).length;
  const numberRejected = reviewHistory.filter(review => review.decision === ReviewDecision.REJECT).length;

  if (action === ReviewDecision.APPROVE) {
    if (numberOfReviews === 0) {
      return {
        title: CONFIRM_REVIEW_TEXT.FIRST_APPROVAL_TITLE,
        description: CONFIRM_REVIEW_TEXT.FIRST_APPROVAL_DESCRIPTION
      };
    }

    if (numberApproved + 1 === 2) {
      return {
        title: CONFIRM_REVIEW_TEXT.FINAL_APPROVAL_TITLE,
        description: CONFIRM_REVIEW_TEXT.FINAL_APPROVAL_DESCRIPTION
      };
    }
  }

  if (action === ReviewDecision.REJECT) {
    if (numberOfReviews === 0) {
      return {
        title: CONFIRM_REVIEW_TEXT.FIRST_REJECTION_TITLE,
        description: CONFIRM_REVIEW_TEXT.FIRST_REJECTION_DESCRIPTION
      };
    }

    if (numberRejected + 1 === 2) {
      return {
        title: CONFIRM_REVIEW_TEXT.FINAL_REJECTION_TITLE,
        description: CONFIRM_REVIEW_TEXT.FINAL_REJECTION_DESCRIPTION
      };
    }
  }

  return {
    title: CONFIRM_REVIEW_TEXT.MIXED_DECISION_TITLE,
    description: CONFIRM_REVIEW_TEXT.MIXED_DECISION_DESCRIPTION
  };
};


export default function SubmitReviewModal({
  isOpen,
  reviewHistory,
  action,
  isSubmitting,
  onConfirm,
  setModalOpen,
}: SubmitReviewModalProps) {
  const modalText = getModalText(reviewHistory, action);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && setModalOpen(false)}>
      <DialogContent showCloseButton={false} className="max-w-lg">
        <DialogHeader>
          <DialogTitle className={`${robotoCondensed.className} text-[24px] font-bold`}>
            {modalText?.title || "Confirm Review Submission"}
          </DialogTitle>
          <DialogDescription className="text-xs font-normal leading-relaxed">
            {modalText?.description || "Please confirm you want to submit this review. This will be logged to the review history."}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setModalOpen(false)}
            className="font-normal cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isSubmitting}
            className="bg-primary text-white border-transparent hover:bg-primary/90 font-normal cursor-pointer"
          >
            {isSubmitting ? 'Submitting...' : 'Confirm'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

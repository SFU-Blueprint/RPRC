'use client';

import { Modal } from '@/components/Admin';
import { Button } from '@/components/ui/Button';
import { inter, robotoCondensed } from '@/app/fonts';
import { ReviewHistoryMockType } from '@/types/review-history-mock';
import { CONFIRM_REVIEW_TEXT } from './const';
import { ReviewDecision } from '@/lib/constants';

type SubmitReviewModalProps = {
  isOpen: boolean;
  reviewHistory: ReviewHistoryMockType[];
  action: ReviewDecision;
  setModalOpen: (isOpen: boolean) => void;
};

const getModalText = (reviewHistory: ReviewHistoryMockType[], action: ReviewDecision) => {
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
  setModalOpen,
}: SubmitReviewModalProps) {
  const modalText = getModalText(reviewHistory, action);

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => setModalOpen(false)}
      showCloseButton={false}
      closeOnOutsideClick={true}
      additionalClasses={{
        modal: 'max-w-lg',
      }}
    >
      <div className={inter.className}>
        <div className="px-8">
          <h1 className={`${robotoCondensed.className} text-[24px] font-bold mb-2 mt-4`}>
            {modalText?.title || "Confirm Review Submission"}
          </h1>
          <p className="text-xs font-normal leading-relaxed">
            {modalText?.description || "Please confirm you want to submit this review. This will be logged to the review history."}
          </p>
        </div>
        <div className="flex gap-4 justify-end pr-7 pb-6.25 mt-6">
          <Button
            variant="outline"
            onClick={() => setModalOpen(false)}
            className="font-normal cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            onClick={() => setModalOpen(false)}
            className="bg-primary text-white border-transparent hover:bg-primary/90 font-normal cursor-pointer"
          >
            Confirm
          </Button>
        </div>
      </div>
    </Modal>
  );
}

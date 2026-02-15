'use client';

import { Modal } from '@/components/Admin';
import { Button } from '@/components/ui/Button';
import { inter, robotoCondensed } from '@/app/fonts';
import { ReviewHistoryMockType } from '@/types/review-history-mock';

type SubmitReviewModalProps = {
  isOpen: boolean;
  reviewHistory: ReviewHistoryMockType[];
  action: 'approve' | 'reject';
  setModalOpen: (isOpen: boolean) => void;
};

const getModalText = (reviewHistory: ReviewHistoryMockType[], action: 'approve' | 'reject') => {
  const numberOfReviews = reviewHistory.length;
  const numberApproved = reviewHistory.filter(review => review.decision === 'approve').length;
  const numberRejected = reviewHistory.filter(review => review.decision === 'reject').length;

  if (action === 'approve') {

    // first approval
    if (numberOfReviews === 0) {
      return {
        title: "Submit First Approval",
        description: "You're submitting an approval for this application. This review will be recorded. "
      }
    }

    // second and final approval (regardless of previous conflicts)
    if (numberApproved + 1 == 2) {

      return {
        title: "Submit Final Approval",
        description: "You're submitting an approval for this application. This is the second approval from your team and will finalize the approval for this application."
      }
    }
  }

  if (action === 'reject') {
    // first rejection
    if (numberOfReviews === 0) {
      return {
        title: "Submit First Rejection",
        description: "You're submitting a rejection for this application. This review will be recorded. "
      }
    }

    // second and final rejection (regardless of previous conflicts)
    if (numberRejected + 1 == 2) {
      return {
        title: "Submit Final Rejection",
        description: "You're submitting a rejection for this application. This is the second rejection from your team and will finalize the rejection for this application."
      }
    }
  }

  // include a case for mixed reviews (e.g. one approval, one rejection)
  return {
    title: "Submit a Different Decision",
    description: "You’re submitting a decision that is different from another decision made on this application. Applications with conflicting decisions will require team discussion."
  };
}


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

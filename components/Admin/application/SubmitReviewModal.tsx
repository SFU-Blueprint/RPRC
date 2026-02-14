'use client';

import { Modal } from '@/components/Modal';
import { Button } from '@/components/ui/Button';
import { inter } from '@/app/fonts';

type SubmitReviewModalProps = {
  isOpen: boolean;
  setModalOpen: (isOpen: boolean) => void;
};

export default function SubmitReviewModal({
  isOpen,
  setModalOpen,
}: SubmitReviewModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={() => setModalOpen(false)}
      title="Confirm Review Submission"
      showCloseButton={false}
      closeOnOutsideClick={true}
      additionalClasses={{
        modal: 'max-w-lg',
      }}
    >
      <div className={inter.className}>
        <div className="mt-10 px-8">
          <p className="text-xs font-normal leading-relaxed">
            Please confirm you want to submit this review as approved? This will
            be logged to the review history.
          </p>
        </div>
        <div className="flex gap-4 justify-end pr-7 pb-6.25 mt-6">
          <Button
            variant="outline"
            onClick={() => setModalOpen(false)}
            className="font-normal"
          >
            Cancel
          </Button>
          <Button
            onClick={() => setModalOpen(false)}
            className="bg-black text-white border-transparent hover:bg-black/90 font-normal"
          >
            Confirm
          </Button>
        </div>
      </div>
    </Modal>
  );
}

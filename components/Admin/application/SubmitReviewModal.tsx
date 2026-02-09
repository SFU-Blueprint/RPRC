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
          <p
            className={`${inter.className} text-[12px] font-normal leading-1.6`}
          >
            Please confirm you want to submit this review as approved? This will
            be logged to the review history.
          </p>
        </div>
        <div className="flex gap-4 justify-end pr-7 pb-6.25">
          <Button
            handleClick={() => setModalOpen(false)}
            additionalClasses={{
              button: [
                'border-1! font-[400]! hover:bg-transparent! hover:border-[#BAB7B2]! hover:text-black! ',
              ],
            }}
          >
            Cancel
          </Button>
          <Button
            handleClick={() => setModalOpen(false)}
            additionalClasses={{
              button: [
                'bg-black! text-white! border-transparent! font-[400]!',
              ],
            }}
          >
            Confirm
          </Button>
        </div>
      </div>
    </Modal>
  );
}

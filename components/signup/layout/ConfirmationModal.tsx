'use client';

import { buttonStyles } from '@/app/fonts';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  handleSubmit: () => void;
}

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  handleSubmit,
}: ConfirmationModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogTrigger asChild>
        <Button onClick={handleSubmit}>Submit Application</Button>
      </DialogTrigger>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Confirm Submission</DialogTitle>
          <DialogDescription>
            Please review all information carefully before submitting. You
            won&apos;t be able to make changes after submission
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-3">
          {/* Cancel Button */}
          <Button
            className={`px-6 py-4 bg-white border-2 border-signup-neutral-800
                text-signup-neutral-800 font-medium hover:bg-gray-50 ${buttonStyles.text}`}
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            className={`px-6 py-4 ${buttonStyles.text}`}
            onClick={onConfirm}
          >
            Confirm
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

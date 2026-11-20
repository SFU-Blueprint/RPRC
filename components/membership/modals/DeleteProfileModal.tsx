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

type DeleteProfileModalProps = {
  isOpen: boolean;
  isDeleting: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export default function DeleteProfileModal({
  isOpen,
  isDeleting,
  onClose,
  onConfirm,
}: DeleteProfileModalProps) {
  const handleOpenChange = (open: boolean) => {
    if (open || isDeleting) return;
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent showCloseButton={false} className="max-w-lg">
        <DialogHeader>
          <DialogTitle
            className={`${robotoCondensed.className} text-[24px] font-bold`}
          >
            Delete Profile and Cancel Membership
          </DialogTitle>
          <DialogDescription className="text-sm font-normal leading-relaxed">
            Please tell us why you&rsquo;re deleting your profile and cancelling
            your membership. Once you click Delete, your profile will be deleted
            immediately.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={isDeleting}
            className="font-normal cursor-pointer"
          >
            Back
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isDeleting}
            className="font-normal cursor-pointer"
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onDiscard: () => void;
};

export default function DiscardChangesModal({ isOpen, onClose, onDiscard }: Props) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        showCloseButton={false}
        className="max-w-[560px] rounded-lg border-none bg-white p-7 shadow-lg sm:p-8"
      >
        <DialogHeader className="gap-3 text-left">
          <DialogTitle className="text-2xl font-semibold">
            Discard Changes?
          </DialogTitle>
          <DialogDescription className="max-w-[480px] text-base leading-6 text-content-secondary">
            You have unsaved changes. If you leave now, your progress will be lost.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-4 gap-3">
          <Button
            type="button"
            variant="outline"
            className="px-6 py-4 text-content-secondary"
            onClick={onDiscard}
          >
            Discard
          </Button>
          <Button
            type="button"
            className="px-6 py-4 bg-primary text-white hover:bg-primary-hover"
            onClick={onClose}
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

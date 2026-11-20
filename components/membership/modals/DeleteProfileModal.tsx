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
import { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';

type DeleteProfileModalProps = {
  isOpen: boolean;
  isDeleting: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
};

export const DELETE_PROFILE_REASONS = [
  'No longer interested in being an RPRC member.',
  'Do not have the time to commit to the organization.',
  'The organization does not align with my motives.',
  'I can not afford to renew the membership',
] as const;

export default function DeleteProfileModal({
  isOpen,
  isDeleting,
  onClose,
  onConfirm,
}: DeleteProfileModalProps) {
  const [reason, setReason] = useState('');

  const handleOpenChange = (open: boolean) => {
    if (open || isDeleting) return;
    setReason(''); // fresh form next time it opens
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

        <div>
          <Label htmlFor="delete-reason" className="text-md">
            Reason<span aria-hidden="true">*</span>
          </Label>
          <Select
            value={reason}
            onValueChange={setReason}
            disabled={isDeleting}
          >
            <SelectTrigger id="delete-reason" className="mt-2 w-full">
              <SelectValue placeholder="Choose from drop down" />
            </SelectTrigger>
            <SelectContent>
              {DELETE_PROFILE_REASONS.map((r) => (
                <SelectItem key={r} value={r}>
                  {r}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

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
            onClick={() => onConfirm(reason)}
            disabled={!reason || isDeleting}
            className="font-normal cursor-pointer"
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { inter, robotoCondensed, bodyStyles, buttonStyles, headerStyles } from '@/app/fonts';
import { DELETE_REASONS } from './const';

interface DeleteProfileModalProps {
    isOpen: boolean;                        // visibility
    onClose: () => void;                    // cancel
    onConfirm: (reason: string) => void;    // delete
    isDeleting?: boolean;                   // loading state for delete action
}

export function DeleteProfileModal({
    isOpen,
    onClose,
    onConfirm,
    isDeleting = false,
}: DeleteProfileModalProps) {
    const [selectedReason, setSelectedReason] = useState('');
    const [showError, setShowError] = useState(false);

    const handleDelete = () => {
        if (!selectedReason) {
            setShowError(true);
            return;
        }
        onConfirm(selectedReason);
    };

    const handleClose = () => {
        setSelectedReason('');
        setShowError(false);
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
            <DialogContent showCloseButton={false} className="max-w-lg">
                <DialogHeader>
                    <DialogTitle
                        className={`${headerStyles.m} text-gray-900 ${robotoCondensed.className}`}
                    >
                        Delete Profile and Cancel Membership
                    </DialogTitle>
                    <DialogDescription
                        className={`text-gray-700 mt-2 ${bodyStyles.m} ${inter.className}`}
                    >
                        Please tell us why you&apos;re deleting your profile and cancelling
                        your membership. Once you click Delete, your profile will be deleted
                        immediately.
                    </DialogDescription>
                </DialogHeader>

                {/* Reason Dropdown */}
                <div className={`mt-2 space-y-2 ${inter.className}`}>
                    <Label htmlFor="delete-reason" className="text-gray-900">
                        Reason <span className="text-destructive">*</span>
                    </Label>
                    <Select
                        value={selectedReason}
                        onValueChange={(val) => {
                            setSelectedReason(val);
                            setShowError(false);
                        }}
                    >
                        <SelectTrigger
                            id="delete-reason"
                            className={`w-full ${showError ? 'border-destructive' : ''}`}
                        >
                            <SelectValue placeholder="Choose from drop down" />
                        </SelectTrigger>
                        <SelectContent>
                            {DELETE_REASONS.map((reason) => (
                                <SelectItem key={reason} value={reason}>
                                    {reason}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {showError && (
                        <p className="text-sm text-destructive">Please select a reason.</p>
                    )}
                </div>

                {/* Action Buttons */}
                <div className={`flex justify-end gap-3 mt-2 ${inter.className}`}>
                    <Button
                        variant="outline"
                        onClick={handleClose}
                        disabled={isDeleting}
                        className={`px-6 py-4 border-2 border-signup-neutral-800 ${buttonStyles.text}`}
                    >
                        Back
                    </Button>
                    <Button
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className={`px-6 py-4 bg-application-rejected-icon-background hover:bg-application-rejected-border text-white ${buttonStyles.text}`}                    >
                        {isDeleting ? 'Deleting...' : 'Delete'}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
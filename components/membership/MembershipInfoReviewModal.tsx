'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { AlertCircle, Info, Mail, MapPin, Phone, User } from 'lucide-react';
import { submitMembershipRenewal } from '@/app/actions/member-dashboard';
import type { MemberDashboardData } from '@/types/membership.types';

interface MembershipInfoReviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    data: MemberDashboardData | null;
    userId: string | null;
}

export default function MembershipInfoReviewModal({ isOpen, onClose, data, userId }: MembershipInfoReviewModalProps) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (!data) return null;

    const handleSubmit = async () => {
        if (!userId) {
            setError('User ID not found');
            return;
        }

        setError(null);
        setIsSubmitting(true);
        try {
            const result = await submitMembershipRenewal(userId);
            if (result.success) {
                onClose();
                router.push('/membership/renew-success');
            } else {
                setError(result.error || 'Failed to submit renewal. Please try again.');
            }
        } catch (err) {
            setError('An unexpected error occurred. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-3xl">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-semibold">Submit Membership Renewal</DialogTitle>
                </DialogHeader>
                <hr className="border-application-detail-border-50 mt-2 mb-2" />
                <div className="rounded-3xl bg-feedback-info/70 border border-feedback-info-accent p-4">
                    <div className="flex items-center gap-2">
                        <div className="rounded-full bg-application-detail-blue-100 p-2 text-application-detail-blue-500">
                            <Info className="h-4 w-4" />
                        </div>
                        <DialogDescription className="text-sm font-semibold text-application-detail-text-primary">
                            Review Information
                        </DialogDescription>
                    </div>
                    <p className="mt-2 text-sm leading-5 text-content-secondary">
                        Please ensure your information is accurate. If anything needs updating, go back and edit your profile before submitting your renewal.
                    </p>
                </div>
                <div className="space-y-5 bg-white rounded-3xl p-4">
                    <div>
                        <h3 className="text-lg font-semibold text-application-detail-text-primary">Personal Information</h3>
                        <div className="mt-3 space-y-3 text-content-secondary">
                            <div className="flex items-center gap-3">
                                <User className="text-primary" />
                                <span className="text-black text-sm">{data.name}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Mail className="text-primary" />
                                <span className="text-black text-sm">{data.contact.email}</span>
                            </div>
                            {data.contact.phone && (
                                <div className="flex items-center gap-3">
                                    <Phone className="text-primary" />
                                    <span className="text-black text-sm">{data.contact.phone}</span>
                                </div>
                            )}
                            {data.contact.address && (
                                <div className="flex items-center gap-3">
                                    <MapPin className="text-primary" />
                                    <span className="text-black text-sm">{data.contact.address}</span>
                                </div>
                            )}
                        </div>
                    </div>
                    <hr className="border-application-detail-border-50" />
                    <div>
                        <h3 className="text-lg font-semibold text-application-detail-text-primary">Membership Information</h3>
                        <div className="mt-4">
                            <div className="flex flex-wrap gap-2 mb-4">
                                {data.interests.map((interest, idx) => (
                                    <span key={idx} className="rounded-full border border-content-secondary px-3 py-1.5 text-content-secondary text-sm">
                                        {interest}
                                    </span>
                                ))}
                            </div>
                            <p className="rounded-2xl border border-application-detail-border-50 bg-card-background-gray p-4 text-content-primary text-sm">
                                {data.reason}
                            </p>
                        </div>
                    </div>
                </div>
                {error && (
                    <div className="rounded-3xl bg-surface-rejected border border-content-error p-4">
                        <div className="flex items-start gap-3">
                            <AlertCircle className="h-5 w-5 text-content-error flex-shrink-0 mt-0.5" />
                            <div className="flex-1">
                                <p className="text-sm font-semibold text-content-error">Error</p>
                                <p className="mt-1 text-sm text-content-error">{error}</p>
                            </div>
                        </div>
                    </div>
                )}
                <DialogFooter className="mt-4 gap-3">
                    <Button variant="outline" onClick={onClose} className="px-6 py-4" disabled={isSubmitting}>
                        Go Back
                    </Button>
                    <Button onClick={handleSubmit} className="px-6 py-4 bg-primary text-white hover:bg-primary-hover" disabled={isSubmitting}>
                        {isSubmitting ? 'Submitting...' : 'Submit Renewal'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

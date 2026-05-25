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
import type { MemberDashboardData, OrganizationMemberDashboardData } from '@/types/membership.types';
import { bodyStyles } from '@/app/fonts';

interface MembershipActionModalProps {
    isOpen: boolean;
    onClose: () => void;
    data: MemberDashboardData | null;
}

export default function MembershipActionModal({ isOpen, onClose, data }: MembershipActionModalProps) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (!data) return null;

    const handleSubmit = async () => {
        setError(null);
        setIsSubmitting(true);
        try {
            const result = await submitMembershipRenewal();
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
            <DialogContent className="min-w-3xl max-h-screen overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-semibold">Submit Membership Renewal</DialogTitle>
                </DialogHeader>
                <hr className="mt-2 mb-2 border border-1" />
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
                        {data.type === 'individual' ? (
                            <>
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

                                    <div className="flex items-center gap-3">
                                        <Phone className="text-primary" />
                                        <span className="text-black text-sm">{data.contact.phone}</span>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <MapPin className="text-primary" />
                                        <span className="text-black text-sm">{data.contact.address}</span>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                <h3 className="text-base md:text-lg lg:text-xl font-medium p-3">Organization Information</h3>
                                <div className="flex p-2 items-center gap-2 mb-5">
                                    <User className="text-primary" />
                                    <p className={bodyStyles.lg}>{data?.name ?? ''}</p>
                                </div>
                                <div className="flex p-2 items-center gap-2">
                                    <Mail className="text-primary" />
                                    <p className={bodyStyles.lg}>{data?.contact?.email ?? ''}</p>
                                </div>
                                <div className="flex p-2 items-center gap-2">
                                    <MapPin className="text-primary" />
                                    <p className={bodyStyles.lg}>{data?.contact?.address ?? ''}</p>
                                </div>
                                <h3 className="text-base md:text-lg lg:text-xl font-medium p-3">Contact Information</h3>

                                <div className="flex p-2 items-center gap-2">
                                    <Phone className="text-primary" />
                                    <p className={bodyStyles.lg}>{data?.contact?.phone ?? ''}</p>
                                </div>
                                <h3 className="text-base md:text-lg lg:text-xl font-medium p-3">Representative Information</h3>
                                <div className="mb-2">
                                    <div className="flex p-2 items-center gap-2">
                                        <User className="text-primary" />
                                        <p className={bodyStyles.lg}>{(data as OrganizationMemberDashboardData)?.representativeName ?? ''}</p>
                                    </div>
                                    {(data as OrganizationMemberDashboardData)?.representativeEmail && (
                                        <div className="flex p-2 items-center gap-2">
                                            <Mail className="text-primary" />
                                            <p className={bodyStyles.lg}>{(data as OrganizationMemberDashboardData)?.representativeEmail}</p>
                                        </div>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                    <hr className="border border-1" />
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
                            {(data as OrganizationMemberDashboardData)?.servicesOffered && (
                                <p className="mt-4 rounded-2xl border border-application-detail-border-50 bg-card-background-gray p-4 text-content-primary text-sm">
                                    {(data as OrganizationMemberDashboardData)?.servicesOffered ?? ''}
                                </p>
                            )}
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
                    <Button variant="outline" onClick={onClose} className="px-6 py-4 text-content-secondary" disabled={isSubmitting}>
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

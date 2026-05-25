'use client';

import { robotoCondensed, subheaderStyles, bodyStyles } from '@/app/fonts';
import Link from 'next/link';
import { MembershipStatusDescription } from '@/components/membership/MembershipStatusDescription';

import { STATUS_CONFIG } from '@/lib/constants/membership';
import { ApplicationStatus, UserRole } from '@/lib/constants/enums';

interface MembershipStatusProps {
    status: ApplicationStatus;
    dateFinalized?: string;
    ctaDisabled: boolean;
    role: UserRole;
    onConfirmInfo?: () => void;
}

export default function MembershipStatusCard({ status, dateFinalized, ctaDisabled, role, onConfirmInfo }: MembershipStatusProps) {
    const config = STATUS_CONFIG[status];

    // Determine valid until date based on status and finalized date of application (date accepted)
    // For active memberships, valid until December 31 of the following year if accepted after September, 
    // otherwise December 31 of the same year
    let validUntil: string | null = null;
    if (status === ApplicationStatus.ACTIVE && dateFinalized) {
        const finalized = new Date(dateFinalized);
        const year = finalized.getMonth() >= 8 // September = index 8
            ? finalized.getFullYear() + 1
            : finalized.getFullYear();
        validUntil = `December 31, ${year}`;
    }

    if (status === ApplicationStatus.EXPIRED) {
        validUntil = `December 31, ${new Date().getFullYear() - 1}`;
    }

    const handleCTAClick = () => {
        if (onConfirmInfo) {
            onConfirmInfo();
            return;
        }

        if (status === ApplicationStatus.PAYMENT_PENDING) {
            window.open('#', '_blank'); // stripe link to be added
        }
    };

    return (
        <div className={`bg-white rounded-3xl px-5 md:px-6 lg:px-8 py-6 md:py-8 lg:py-12 shadow-sm border-2 w-full md:max-w-xs lg:max-w-md ${config.borderColor}`}>
            <div className="mb-3">
                <span
                    className={`inline-block px-3 py-2 ${config.labelBg} ${config.labelText} ${robotoCondensed.className} text-xl md:text-2xl lg:text-3xl font-bold rounded-xl`}
                >
                    {config.label}
                </span>
            </div>

            {validUntil && (
                <p className={`${config.labelText} ${subheaderStyles.s} mb-4`}>
                    {status === ApplicationStatus.EXPIRED ? "Expired" : "Valid until"}: {validUntil}
                </p>
            )}

            <p className={`${bodyStyles.m} text-content-secondary`}>
                <MembershipStatusDescription status={status} role={role} />
            </p>

            {config.ctaText && (
                <button
                    type="button"
                    onClick={handleCTAClick}
                    disabled={ctaDisabled}
                    className={`mt-6 w-full py-2 rounded-xl text-center block disabled:opacity-50 ${config.ctaColor ?? 'bg-primary'} ${config.ctaTextColor ?? 'text-white'} ${robotoCondensed.className} text-lg font-normal transition-colors`}
                >
                    {config.ctaText}
                </button>
            )}
        </div>
    );
}

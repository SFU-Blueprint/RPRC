'use client';

import { robotoCondensed, subheaderStyles, bodyStyles } from '@/app/fonts';
import Link from 'next/link';
import {
    MEMBERSHIP_STATUS_DESCRIPTION_TEXT,
} from '@/lib/constants/membership-status-description';

import { STATUS_CONFIG } from '@/lib/constants/membership';
import { ApplicationStatus } from '@/lib/constants/enums';

interface MembershipStatusProps {
    status: ApplicationStatus;
    dateFinalized?: string;
}

export default function MembershipStatusCard({ status, dateFinalized }: MembershipStatusProps) {
    const config = STATUS_CONFIG[status];
    const descriptionText = MEMBERSHIP_STATUS_DESCRIPTION_TEXT[status];

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
                {descriptionText}
            </p>

            {config.ctaText && config.ctaHref && (
                <Link
                    href={config.ctaHref}
                    className={`mt-6 w-full py-2 rounded-xl text-center block ${config.ctaColor} ${config.ctaTextColor} ${robotoCondensed.className} text-lg font-normal transition-colors`}
                >
                    {config.ctaText}
                </Link>
            )}
        </div>
    );
}

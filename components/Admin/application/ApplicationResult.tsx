import React from 'react'
import { BackdropContainer } from '@/components/ui/BackdropContainer';
import { CheckCircle, XCircle } from 'lucide-react';
import { robotoCondensed } from '@/app/fonts';
import { ApplicationStatus } from '@/lib/constants/enums';

const getBackgroundColor = (result: ApplicationStatus) => {
    if (result === ApplicationStatus.PAYMENT_PENDING) {
        return 'bg-application-approved';
    }

    if (result === ApplicationStatus.REJECTED) {
        return 'bg-application-rejected';
    }
}

const getBorderColor = (result: ApplicationStatus) => {
    if (result === ApplicationStatus.PAYMENT_PENDING) {
        return 'border-application-approved-border';
    }

    if (result === ApplicationStatus.REJECTED) {
        return 'border-application-rejected-border';
    }
}

export default function ApplicationResult({ result }: { result: ApplicationStatus }) {

    const backgroundColor = getBackgroundColor(result);
    const borderColor = getBorderColor(result);

    const iconBackgroundColor = result === ApplicationStatus.PAYMENT_PENDING ? 'bg-primary' : 'bg-application-rejected-icon-background';

    return (
        <BackdropContainer className={`${backgroundColor} border ${borderColor} h-140 p-5 rounded-lg flex flex-col gap-y-6 mt-6 w-full`} >
            <div className="flex flex-col items-center justify-center h-screen">
                <div className={`${iconBackgroundColor} p-2 rounded-full text-white h-25 w-25 flex items-center justify-center`}>
                    {result === ApplicationStatus.PAYMENT_PENDING ? <CheckCircle className="w-15 h-15" /> : <XCircle className="w-15 h-15" />}
                </div>
                <p className={`${robotoCondensed.className} text-[32px] font-bold mt-6 mb-2 text-center`}>
                    {result === ApplicationStatus.PAYMENT_PENDING ? 'Application Approved' : 'Application Rejected'}
                </p>
                <p className="text-application-detail-text-secondary text-center text-lg">
                    {result === ApplicationStatus.PAYMENT_PENDING ? 'The applicant will be notified and receive a payment link via email.' : 'The applicant will be notified via email.'}
                </p>
            </div>
        </BackdropContainer>
    )
}

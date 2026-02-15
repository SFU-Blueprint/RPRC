import React from 'react'
import { BackdropContainer } from '@/components/ui/BackdropContainer';
import { CheckCircle, XCircle } from 'lucide-react';
import { robotoCondensed } from '@/app/fonts';

const getBackgroundColor = (result: 'approved' | 'rejected') => {
    if (result === 'approved') {
        return 'bg-application-approved';
    }

    if (result === 'rejected') {
        return 'bg-application-rejected';
    }
}

const getBorderColor = (result: 'approved' | 'rejected') => {
    if (result === 'approved') {
        return 'border-application-approved-border';
    }

    if (result === 'rejected') {
        return 'border-application-rejected-border';
    }
}

export default function ApplicationResult({ result }: { result: 'approved' | 'rejected' }) {

    const backgroundColor = getBackgroundColor(result);
    const borderColor = getBorderColor(result);

    const iconBackgroundColor = result === 'approved' ? 'bg-primary' : 'bg-application-rejected-icon-background';

    return (
        <BackdropContainer className={`${backgroundColor} border ${borderColor} h-140 p-5 rounded-lg flex flex-col gap-y-6 mt-6 w-full`} >
            <div className="flex flex-col items-center justify-center h-screen">
                <div className={`${iconBackgroundColor} p-2 rounded-full text-white h-25 w-25 flex items-center justify-center`}>
                    {result === 'approved' ? <CheckCircle className="w-15 h-15" /> : <XCircle className="w-15 h-15" />}
                </div>
                <p className={`${robotoCondensed.className} text-[32px] font-bold mt-6 mb-2 text-center`}>
                    {result === 'approved' ? 'Application Approved' : 'Application Rejected'}
                </p>
                <p className="text-application-detail-text-secondary text-center text-lg">
                    {result === 'approved' ? 'The applicant will be notified and receive a payment link via email.' : 'The applicant will be notified via email.'}
                </p>
            </div>
        </BackdropContainer>
    )
}

'use client';

import { BackdropContainer } from '@/components/admin/layout/BackdropContainer';
import { CheckCircle, XCircle } from 'lucide-react';
import { robotoCondensed } from '@/app/fonts';
import { ApplicationStatus } from '@/lib/constants/enums';

const isApproved = (result: ApplicationStatus) =>
  result === ApplicationStatus.PAYMENT_PENDING ||
  result === ApplicationStatus.ACTIVE;

const getBackgroundColor = (result: ApplicationStatus) => {
  if (isApproved(result)) return 'bg-application-approved';
  if (result === ApplicationStatus.REJECTED) return 'bg-application-rejected';
  return 'bg-signup-neutral-50';
};

const getBorderColor = (result: ApplicationStatus) => {
  if (isApproved(result)) return 'border-application-approved-border';
  if (result === ApplicationStatus.REJECTED)
    return 'border-destructive-default';
  return 'border-application-detail-border-50';
};

export default function ApplicationResult({
  result,
}: {
  result: ApplicationStatus;
}) {
  const approved = isApproved(result);
  const isPaymentDue = result === ApplicationStatus.PAYMENT_PENDING;

  const iconBackgroundColor = approved
    ? 'bg-primary'
    : 'bg-application-rejected-icon-background';
  return (
    <BackdropContainer
      className={`${getBackgroundColor(result)} border ${getBorderColor(result)} shadow-card min-h-96 p-5 rounded-lg flex flex-col gap-y-6 w-full`}
    >
      <div className="flex flex-col items-center justify-center min-h-80">
        <div
          className={`${iconBackgroundColor} p-2 rounded-full text-white h-25 w-25 flex items-center justify-center`}
        >
          {approved ? (
            <CheckCircle className="w-15 h-15" />
          ) : (
            <XCircle className="w-15 h-15" />
          )}
        </div>
        <p
          className={`${robotoCondensed.className} text-[32px] font-bold mt-6 mb-2 text-center`}
        >
          {isPaymentDue
            ? 'Application Approved'
            : result === ApplicationStatus.ACTIVE
              ? 'Membership Active'
              : 'Application Rejected'}
        </p>
        <p className="text-application-detail-text-secondary text-center text-lg">
          {isPaymentDue
            ? 'The application is approved and awaiting payment.'
            : result === ApplicationStatus.ACTIVE
              ? 'The member’s payment is confirmed and the membership is active.'
              : 'The application was rejected.'}
        </p>
      </div>
    </BackdropContainer>
  );
}

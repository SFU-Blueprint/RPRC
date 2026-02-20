'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { inter } from '@/app/fonts';
import { BackdropContainer } from '@/components/admin/layout/BackdropContainer';
import { APPLICATION_DETAILS_CONST } from '@/lib/constants/admin';
import { ApplicationStatus } from '@/lib/constants/enums';
import { ROUTES } from '@/lib/constants/routes';
import { formatDisplayDate } from '@/lib/utils';
import type { AdminApplicationDetailsData, ReviewHistoryItem } from '@/types/admin.types';
import StatusChip from './StatusChip';
import ApplicationDetails from './application/ApplicationDetails';
import SubmitReview from './application/SubmitReview';
import ApplicationResult from './application/ApplicationResult';
import ReviewHistory from './application/ReviewHistory';

type Props = {
  appId: string;
  headerName: string;
  headerStatus: ApplicationStatus | null;
  details: AdminApplicationDetailsData;
  reviewHistory: ReviewHistoryItem[];
};

export default function ApplicationDetailPage({
  appId,
  headerName,
  headerStatus,
  details,
  reviewHistory,
}: Props) {
  const currentStatus = headerStatus ?? ApplicationStatus.TO_REVIEW;

  const ableToReview =
    currentStatus === ApplicationStatus.TO_REVIEW ||
    currentStatus === ApplicationStatus.CONFLICT ||
    currentStatus === ApplicationStatus.ACTIVE;

  const isReviewFinalized =
    currentStatus === ApplicationStatus.PAYMENT_PENDING ||
    currentStatus === ApplicationStatus.REJECTED;

  return (
    <div className="overflow-hidden flex flex-col items-center">
      {/* Header / Breadcrumbs */}
      <BackdropContainer className="pb-0 md:pb-0 lg:pb-6 bg-card-background-gray shadow-md w-full rounded-none">
        <div className="max-w-screen-2xl mx-auto w-ful">
          <Link
            href={ROUTES.ADMIN_DASHBOARD}
            className={`inline-flex items-center gap-x-2 text-sm font-bold ${inter.className}`}
          >
            <ArrowLeft size={14} />
            {APPLICATION_DETAILS_CONST.breadcrumbs}
          </Link>

          <div className="mt-4 flex items-center gap-x-6">
            <h1 className="text-lg sm:text-4xl font-semibold leading-snug">
              {headerName || 'Unknown Applicant'}
            </h1>
            <StatusChip theme={currentStatus} />
          </div>
        </div>
      </BackdropContainer>


      {/* Page content */}
      <div className="max-w-screen-2xl mx-auto w-full flex flex-col">
        <div className="p-5 flex flex-col z-0">
          <ApplicationDetails
            type={details.type}
            interests={details.interests}
            reason={details.reason}
            contact={details.contact}
            dateReceived={formatDisplayDate(details.dateReceived)}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 xs:mt-[25px]">
            {ableToReview && <SubmitReview appId={appId} reviewHistory={reviewHistory} />}
            {isReviewFinalized && <ApplicationResult result={currentStatus} />}
            <ReviewHistory reviewHistory={reviewHistory} />
          </div>
        </div>
      </div>
    </div>
  );
} 
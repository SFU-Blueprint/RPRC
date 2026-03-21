'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { inter, robotoCondensed } from '@/app/fonts';
import { BackdropContainer } from '@/components/admin/layout/BackdropContainer';
import { APPLICATION_DETAILS_CONST, MOBILE_TABS } from '@/lib/constants/admin';
import { ApplicationStatus } from '@/lib/constants/enums';
import { ROUTES } from '@/lib/constants/routes';
import { formatDisplayDate } from '@/lib/utils';
import type { AdminApplicationDetailsData, ReviewHistoryItem } from '@/types/admin.types';
import StatusChip from './StatusChip';
import ApplicationDetails from './application/ApplicationDetails';
import ConflictResolution from './application/ConflictResolution';
import SubmitReview from './application/SubmitReview';
import ApplicationResult from './application/ApplicationResult';
import ReviewHistory from './application/ReviewHistory';
import { useIsMobile } from '@/lib/hooks/useIsMobile';
import { headerStyles } from '@/app/fonts';
import { useState } from 'react';
import ApplicationDetailMobileTabs from './application/ApplicationDetailMobileTabs';

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
  const isMobile = useIsMobile();
  const [currentTab, setCurrentTab] = useState<{ label: string, value: string }>(MOBILE_TABS[0])

  const ableToReview = ([
    ApplicationStatus.TO_REVIEW,
    ApplicationStatus.CONFLICT,
  ] as ApplicationStatus[]).includes(currentStatus);

  const isReviewFinalized = ([
    ApplicationStatus.PAYMENT_PENDING,
    ApplicationStatus.REJECTED,
    ApplicationStatus.ACTIVE,
  ] as ApplicationStatus[]).includes(currentStatus);

  return (
    <div className="overflow-hidden flex flex-col items-center">
      {/* Header / Breadcrumbs */}
      <BackdropContainer className="pb-0 md:pb-0 lg:pb-6 bg-card-background-gray shadow-md w-full rounded-none">
        <div className="max-w-screen-2xl mx-auto w-full">
          <Link
            href={ROUTES.ADMIN_DASHBOARD}
            className={`inline-flex items-center gap-x-2 text-sm font-bold ${inter.className}`}
          >
            <ArrowLeft size={14} />
            {APPLICATION_DETAILS_CONST.breadcrumbs}
          </Link>

          <div className={`mt-4 flex items-center gap-x-6 ${isMobile ? 'mb-8' : ''}`}>
            <h1 className={`${isMobile ? headerStyles.l : headerStyles.xlResponsive} sm:text-4xl font-semibold leading-snug ${robotoCondensed.className}`}>
              {headerName || 'Unknown Applicant'}
            </h1>
            <StatusChip theme={currentStatus} />
          </div>
          {isMobile ? (
            <ApplicationDetailMobileTabs currentTab={currentTab} setCurrentTab={setCurrentTab} />
          ) : ''}
        </div>
      </BackdropContainer>


      {/* Page content */}
      <div className={`max-w-screen-2xl mx-auto w-full mt-8 gap-x-10 ${isMobile ? '': 'flex flex-row '}`}>
        {/* Submit Review Section */}
        {(!isMobile || currentTab.value === MOBILE_TABS[1].value) && (
          <div className={`p-5 ${ isMobile ? '' : 'w-1/3 shrink-0'}`}>
            {ableToReview && currentStatus === ApplicationStatus.CONFLICT && (
                <ConflictResolution appId={appId} reviewHistory={reviewHistory} />
            )}
            {ableToReview && currentStatus !== ApplicationStatus.CONFLICT && (
                <SubmitReview appId={appId} reviewHistory={reviewHistory} />
            )}
            {isReviewFinalized && <ApplicationResult result={currentStatus} />}
          </div>
        )}
        <div className="py-5 z-0 flex-1 min-w-0">
          {(!isMobile || currentTab.value === MOBILE_TABS[0].value) && <ApplicationDetails
            type={details.type}
            interests={details.interests}
            reason={details.reason}
            contact={details.contact}
            dateReceived={formatDisplayDate(details.dateReceived)}
            isMobile={isMobile}
          />}

          <div className={`${isMobile ? 'px-5' : ''}`}>
            {(!isMobile || currentTab.value === MOBILE_TABS[2].value) && (
              <ReviewHistory reviewHistory={reviewHistory} isMobile={isMobile} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 
'use client';

import { inter, robotoCondensed } from '@/app/fonts';
import Link from 'next/link';
import {
  APPLICATIONS_MOCK,
  APPLICATION_DETAILS_CONST,
  REVIEW_HISTORY_MOCK_APPROVAL,
  USERS_MOCK,
  USER_ADDRESSES_MOCK,
  INDIVIDUAL_PROFILES_MOCK,
  INDIVIDUAL_APPLICATION_DETAILS_MOCK,
} from '@/lib/constants/admin';
import ApplicationDetails from '@/components/admin/application/ApplicationDetails';
import SubmitReview from '@/components/admin/application/SubmitReview';
import ReviewHistory from '@/components/admin/application/ReviewHistory';
import { ArrowLeft } from 'lucide-react';
import { useMemo, useState } from 'react';
import { BackdropContainer } from '@/components/ui/BackdropContainer';
import ApplicationResult from '@/components/admin/application/ApplicationResult';
import { Button } from '@/components/ui/button';
import { Activity } from 'react';
import {
  ApplicationStatus,
  ApplicationType,
  MembershipInterest,
  ReviewDecision,
} from '@/lib/constants/enums';
import { ROUTES } from '@/lib/constants/routes';
import StatusChip from './StatusChip';

type Props = {
  appId: string;
  headerName: string;
  headerStatus: ApplicationStatus | null;
};

export default function ApplicationDetailPage({
  appId,
  headerName,
  headerStatus,
}: Props) {
  const application = APPLICATIONS_MOCK.find((app) => app.id === appId);
  const user = USERS_MOCK.find((mockUser) => mockUser.id === application?.user_id);
  const userAddress = USER_ADDRESSES_MOCK.find(
    (address) => address.user_id === application?.user_id,
  );
  const userProfile = INDIVIDUAL_PROFILES_MOCK.find(
    (profile) => profile.user_id === application?.user_id,
  );
  const applicationDetails = INDIVIDUAL_APPLICATION_DETAILS_MOCK.find(
    (details) => details.application_id === application?.id,
  );
  const reviewHistory =
    REVIEW_HISTORY_MOCK_APPROVAL.filter(
      (review) => review.application_id === application?.id,
    ) || [];

  const applicationInterests = useMemo(
    () => Object.values(MembershipInterest),
    [],
  );

  const [showDetails, setShowDetails] = useState(true);
  const [showSubmitReview, setShowSubmitReview] = useState(true);
  const [showReviewHistory, setShowReviewHistory] = useState(true);

  const contactInfo = {
    email: user?.email ?? '',
    phone: userProfile?.phone_number ?? '',
    address: `${userAddress?.mailing_address ?? ''}, ${userAddress?.city ?? ''}, ${userAddress?.province ?? ''}, ${userAddress?.country ?? ''} ${userAddress?.postal_code ?? ''}`.trim(),
  };

  const ableToReview =
    application?.status === ApplicationStatus.TO_REVIEW ||
    application?.status === ApplicationStatus.CONFLICT ||
    application?.status === ApplicationStatus.ACTIVE;

  const isReviewFinalized =
    application?.status === ApplicationStatus.PAYMENT_PENDING ||
    application?.status === ApplicationStatus.REJECTED;

  return (
    <div className="overflow-hidden flex justify-center items-center">
      <div className="max-w-screen-2xl mx-auto w-full flex flex-col">
        <BackdropContainer className="pb-0 md:pb-0 lg:pb-6 bg-card-background-gray shadow-md rounded-none mb-2 z-1 w-screen left-0 absolute">
          <Link
            href={ROUTES.ADMIN_DASHBOARD}
            className={`inline-flex items-center gap-x-2 text-sm font-bold ${inter.className}`}
          >
            <ArrowLeft size={14} />
            {APPLICATION_DETAILS_CONST.breadcrumbs}
          </Link>

          <div className="mt-4 flex items-center gap-x-6">
            <h1 className="text-lg sm:text-4xl font-semibold leading-snug">
              {headerName || userProfile?.name || 'Unknown Applicant'}
            </h1>
            <StatusChip
              theme={
                (headerStatus ?? application?.status) as
                | ApplicationStatus
                | ReviewDecision
              }
            />
          </div>

          <div className="mt-5 lg:hidden w-full flex flex-row items-center justify-center">
            <Button
              onClick={() => {
                setShowDetails(true);
                setShowSubmitReview(false);
                setShowReviewHistory(false);
              }}
              className={`flex-1 bg-transparent font-bold text-${showDetails ? 'application-approved-border' : 'gray-400'} border-b border-${showDetails ? 'application-approved-border' : 'gray-400'} rounded-none`}
            >
              Details
            </Button>
            <Button
              onClick={() => {
                setShowDetails(false);
                setShowSubmitReview(true);
                setShowReviewHistory(false);
              }}
              className={`flex-1 bg-transparent font-bold text-${showSubmitReview ? 'application-approved-border' : 'gray-400'} border-b border-${showSubmitReview ? 'application-approved-border' : 'gray-400'} rounded-none`}
            >
              Submit Review
            </Button>
            <Button
              onClick={() => {
                setShowDetails(false);
                setShowSubmitReview(false);
                setShowReviewHistory(true);
              }}
              className={`flex-1 bg-transparent font-bold text-${showReviewHistory ? 'application-approved-border' : 'gray-400'} border-b border-${showReviewHistory ? 'application-approved-border' : 'gray-400'} rounded-none`}
            >
              Review History
            </Button>
          </div>
        </BackdropContainer>

        <div className="p-5 bg-white mt-40 xs:mt-45 flex flex-col z-0">
          <Activity mode={showDetails ? 'visible' : 'hidden'}>
            <ApplicationDetails
              type={application?.type as ApplicationType}
              interests={applicationInterests}
              reason={applicationDetails?.reason ?? ''}
              contact={contactInfo}
              dateReceived={application?.created_at ?? ''}
            />
          </Activity>

          <div className="flex flex-col lg:flex-row gap-x-10 xs:mt-[25px] justify-between items-start">
            <Activity mode={showSubmitReview && ableToReview ? 'visible' : 'hidden'}>
              <SubmitReview reviewHistory={reviewHistory} />
            </Activity>
            <Activity
              mode={showSubmitReview && isReviewFinalized ? 'visible' : 'hidden'}
            >
              <ApplicationResult result={application?.status as ApplicationStatus} />
            </Activity>
            <Activity mode={showReviewHistory ? 'visible' : 'hidden'}>
              <ReviewHistory reviewHistory={reviewHistory} />
            </Activity>
          </div>
        </div>
      </div>
    </div>
  );
}

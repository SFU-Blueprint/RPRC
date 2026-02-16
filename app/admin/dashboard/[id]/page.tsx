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
import { StatusChip } from '@/components/Admin';
import ApplicationDetails from '@/components/Admin/application/ApplicationDetails';
import SubmitReview from '@/components/Admin/application/SubmitReview';
import ReviewHistory from '@/components/Admin/application/ReviewHistory';
import { ArrowLeft } from 'lucide-react';
import React from 'react';
import { BackdropContainer } from '@/components/ui/BackdropContainer';
import ApplicationResult from '@/components/Admin/application/ApplicationResult';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Activity } from 'react';
import { ApplicationStatus, ApplicationType, ReviewDecision } from '@/lib/constants/enums';

export default function Application() {
  // TODO: Fetch application details using appId, using mock for now
  const params = useParams();
  const { id } = params;
  console.log('Application ID from URL:', id); // Log the application ID

  // replace left side of equals with supabase queries in but not anything else or it will break
  // (w/ state variables and useeffect)
  // also i did not do application organization type yet cuz there wasnt a design for it
  const application = APPLICATIONS_MOCK.find(app => app.id === id);
  const user = USERS_MOCK.find(user => user.id === application?.user_id);
  const userAddress = USER_ADDRESSES_MOCK.find(address => address.user_id === application?.user_id);
  const userProfile = INDIVIDUAL_PROFILES_MOCK.find(profile => profile.user_id === application?.user_id);
  const applicationDetails = INDIVIDUAL_APPLICATION_DETAILS_MOCK.find(details => details.application_id === application?.id);
  const reviewHistory = REVIEW_HISTORY_MOCK_APPROVAL.filter(review => review.application_id === application?.id) || [];

  // did not figure out how the membership interests / application interest tables worked
  const applicationInterests = ['Health', 'Environment', 'Arts + Culture'];

  const [showDetails, setShowDetails] = React.useState(true);
  const [showSubmitReview, setShowSubmitReview] = React.useState(true);
  const [showReviewHistory, setShowReviewHistory] = React.useState(true);

  // to maintain compatbility with ApplicationDetails component prop type
  const contactInfo = {
    email: user?.email!,
    phone: userProfile?.phone_number!,
    address: `${userAddress?.mailing_address}, ${userAddress?.city}, ${userAddress?.province}, ${userAddress?.country} ${userAddress?.postal_code}`
  };

  const ableToReview =
    application?.status === ApplicationStatus.TO_REVIEW ||
    application?.status === ApplicationStatus.CONFLICT ||
    application?.status === ApplicationStatus.ACTIVE;

  const isReviewFinalized = application?.status === ApplicationStatus.PAYMENT_PENDING || application?.status === ApplicationStatus.REJECTED;

  return (
    <div className="overflow-hidden flex justify-center items-center">
      <div className="max-w-screen-2xl mx-auto w-full flex flex-col">
        <BackdropContainer className="pb-0 md:pb-0 lg:pb-6 bg-card-background-gray shadow-md rounded-none mb-2 z-1 w-screen left-0 absolute">
          <span className={`flex items-center gap-x-2 ${inter.className} cursor-pointer`}>
            <ArrowLeft />
            <Link
              href="/admin"
              className={`text-[12px] sm:text-[16px] font-bold ${inter.className}`}
            >
              {APPLICATION_DETAILS_CONST.breadcrumbs}
            </Link>
          </span>

          <div className="mt-8 flex items-center gap-x-6 sm:gap-x-12">
            <h1
              className={`text-[32px] sm:text-[48px] font-semibold leading-[110%] ${robotoCondensed.className}`}
            >
              {userProfile?.name}
            </h1>
            <StatusChip theme={application?.status as ApplicationStatus | ReviewDecision} />
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
          <Activity mode={showDetails ? "visible" : "hidden"}>
            <ApplicationDetails
              type={application?.type as ApplicationType}
              interests={applicationInterests}
              reason={applicationDetails?.reason!}
              contact={contactInfo}
              dateReceived={application?.created_at!}
            />
          </Activity>


          <div className="flex flex-col lg:flex-row gap-x-10 xs:mt-[25px] justify-between items-start">
            <Activity mode={showSubmitReview && ableToReview ? "visible" : "hidden"}>
              <SubmitReview reviewHistory={reviewHistory} />
            </Activity>
            <Activity mode={showSubmitReview && isReviewFinalized ? "visible" : "hidden"}>
              <ApplicationResult result={application?.status as ApplicationStatus} />
            </Activity>
            <Activity mode={showReviewHistory ? "visible" : "hidden"}>
              <ReviewHistory reviewHistory={reviewHistory} />
            </Activity>
          </div>
        </div>

      </div>
    </div>

  );
}

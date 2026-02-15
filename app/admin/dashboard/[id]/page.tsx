'use client';
import { inter, robotoCondensed } from '@/app/fonts';
import Link from 'next/link';
import { APPLICATION_DETAILS_MOCK, APPLICATION_DETAILS_CONST, REVIEW_HISTORY_MOCK_ONE_APPROVAL, REVIEW_HISTORY_MOCK_ONE_REJECT, REVIEW_HISTORY_MOCK_APPROVAL, REVIEW_HISTORY_MOCK_NO_APPROVAL, REVIEW_HISTORY_MOCK_CONFLICT } from './const';
import { StatusChip } from '@/components/Admin';
import ApplicationDetails from '@/components/Admin/application/ApplicationDetails';
import SubmitReview from '@/components/Admin/application/SubmitReview';
import ReviewHistory from '@/components/Admin/application/ReviewHistory';
import { ArrowLeft } from 'lucide-react';
import React from 'react';
import { BackdropContainer } from '@/components/ui/BackdropContainer';
import ApplicationResult from '@/components/Admin/application/ApplicationResult';
import { ReviewHistoryMockType } from '@/types/review-history-mock';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Activity } from 'react';

function determineReviewStatus(reviews: ReviewHistoryMockType[]): 'approved' | 'rejected' | 'pending' {
  const approvals = reviews.filter(review => review.decision === 'approve').length;
  const rejections = reviews.filter(review => review.decision === 'reject').length;

  if (approvals >= 2) {
    return 'approved';
  }

  if (rejections >= 2) {
    return 'rejected';
  }

  return 'pending';
}

export default function Application() {
  // TODO: Fetch application details u  sing appId, using mock for now
  const params = useParams();
  const { id } = params;
  console.log('Application ID from URL:', id); // Log the application ID
  const application = APPLICATION_DETAILS_MOCK;
  const reviewHistory = REVIEW_HISTORY_MOCK_CONFLICT;

  // should be a stateful variable in useEffect when fetching from supabase
  const reviewStatus = determineReviewStatus(reviewHistory);

  const [showDetails, setShowDetails] = React.useState(true);
  const [showSubmitReview, setShowSubmitReview] = React.useState(true);
  const [showReviewHistory, setShowReviewHistory] = React.useState(true);

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
              {application.name}
            </h1>
            <StatusChip theme={application.status} />
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
              type={application.type}
              interests={application.interests}
              reason={application.reason}
              contact={application.contact}
              dateReceived={application.dateReceived}
            />
          </Activity>


          <div className="flex flex-col lg:flex-row gap-x-10 xs:mt-[25px] justify-between items-start">
            <Activity mode={showSubmitReview && reviewStatus === 'pending' ? "visible" : "hidden"}>
              <SubmitReview reviewHistory={reviewHistory} />
            </Activity>
            <Activity mode={showSubmitReview && (reviewStatus === 'approved' || reviewStatus === 'rejected') ? "visible" : "hidden"}>
              <ApplicationResult result={reviewStatus as 'approved' | 'rejected'} />
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

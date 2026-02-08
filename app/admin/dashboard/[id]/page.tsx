import { inter, robotoCondensed } from '@/app/fonts';
import Link from 'next/link';
import { APPLICATION_DETAILS_MOCK, APPLICATION_DETAILS_CONST } from './const';
import StatusChip from '@/components/StatusChip';
import ApplicationDetails from './ApplicationDetails';
import SubmitReview from './SubmitReview';
import ReviewHistory from './ReviewHistory';

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function Application({ params }: PageProps) {
  // TODO: Fetch application details using appId, using mock for now
  const { id } = await params;
  const application = APPLICATION_DETAILS_MOCK;

  return (
    <div className="p-17 bg-[#F9F8F4]">
      <Link
        href="/admin"
        className={`text-[20px] underline underline-offset-3 ${inter.className}`}
      >
        {APPLICATION_DETAILS_CONST.breadcrumbs}
      </Link>

      <div className="mt-10 flex items-center gap-x-12.5">
        <h1
          className={`text-[48px] font-semibold leading-[110%] ${robotoCondensed.className}`}
        >
          {application.name}
        </h1>
        <StatusChip theme={application.status} />
      </div>

      <ApplicationDetails
        type={application.type}
        interests={application.interests}
        reason={application.reason}
        contact={application.contact}
      />
      <div className="flex mt-25 gap-x-9">
        <SubmitReview />
        <ReviewHistory />
      </div>
    </div>
  );
}

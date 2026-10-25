import { inter } from '@/lib/fonts';
import { Step3Success } from '@/components/signup/Pages/Step3Success';
import MembershipProfileBanner from '@/components/membership/MembershipProfileBanner';
import { MEMBER_DASHBOARD, ORGANIZATION_MEMBER_DASHBOARD } from '@/lib/mock-data';

type SearchParams = Promise<{ demoRole?: string }>;

export default async function MembershipRenewPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { demoRole } = await searchParams;
  const profile = demoRole === 'organization' ? ORGANIZATION_MEMBER_DASHBOARD : MEMBER_DASHBOARD;

  return (
    <div className={inter.className}>
      <MembershipProfileBanner name={profile.name} role={profile.type} />
      <div className="max-w-screen-2xl mx-auto pb-12 md:pb-16 lg:pb-20 mt-10">
        <div className="w-full flex justify-center">
          <div className="w-full max-w-[80%]">
            <Step3Success />
          </div>
        </div>
      </div>
    </div>
  );
}

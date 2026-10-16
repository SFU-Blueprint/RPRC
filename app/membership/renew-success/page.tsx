'use client';

import { SignUpProvider } from '@/lib/contexts/SignUpContext';
import { inter } from '@/lib/fonts';
import { Step3Success } from '@/components/signup/Pages/Step3Success';
import MembershipProfileBanner from '@/components/membership/MembershipProfileBanner';
import { MEMBER_DASHBOARD } from '@/lib/mock-data';

function MembershipRenewContent() {
  return (
    <div className={inter.className}>
      <MembershipProfileBanner name={MEMBER_DASHBOARD.name} role={MEMBER_DASHBOARD.type} />
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

export default function MembershipRenewPage() {
  return (
    <SignUpProvider initialStep={2}>
      <MembershipRenewContent />
    </SignUpProvider>
  );
}

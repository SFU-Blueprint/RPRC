'use client';

import { SignUpProvider } from '@/lib/contexts/SignUpContext';
import { ProgressIndicator } from '@/components/signup/layout/ProgressIndicator';
import { SIGNUP_STEPS } from '@/lib/constants/signup';
import { inter } from '@/lib/fonts';
import { Step2Form } from '@/components/signup/Pages/Step2Form';

function MembershipFormContent() {
  return (
    <div className={inter.className}>
      {/* Progress Indicator */}
      <ProgressIndicator currentStep={2} steps={SIGNUP_STEPS} />

      {/* Main Content Container - Responsive width with max-width cap */}
      <div className="max-w-screen-2xl mx-auto pb-12 md:pb-16 lg:pb-20">
        {/* Application Form - 80% width centered */}
        <div className="w-full flex justify-center">
          <div className="w-full max-w-[80%]">
            <Step2Form />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MembershipFormPage() {
  return (
    <SignUpProvider>
      <MembershipFormContent />
    </SignUpProvider>
  );
}

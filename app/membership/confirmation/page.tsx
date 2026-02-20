'use client';

import { SignUpProvider } from '@/lib/contexts/SignUpContext';
import { ProgressIndicator } from '@/components/signup/layout/ProgressIndicator';
import { SIGNUP_STEPS } from '../signup/const';
import { inter } from '@/app/fonts';
import { Step3Success } from '@/components/signup/Pages/Step3Success';
import { useAuth } from '@/lib/contexts/AuthContext';
import { Spinner } from '@/components/ui/spinner';

function MembershipFormConfirmation() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner className="size-6 text-gray-600" />
      </div>
    );
  }

  return (
    <div className={inter.className}>
      {/* Progress Indicator */}
      <ProgressIndicator currentStep={3} steps={SIGNUP_STEPS} />

      {/* Main Content Container - Responsive width with max-width cap */}
      <div className="max-w-screen-2xl mx-auto pb-12 md:pb-16 lg:pb-20">
        {/* Application Confirmation - 80% width centered */}
        <div className="w-full flex justify-center">
          <div className="w-full max-w-[80%]">
            <Step3Success />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ApplicationSubmittedPage() {
  return (
    <SignUpProvider>
      <MembershipFormConfirmation />
    </SignUpProvider>
  );
}

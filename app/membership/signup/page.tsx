'use client';

import { SignUpProvider, useSignUp } from '@/lib/contexts/SignUpContext';
import { ProgressIndicator } from '@/components/signup/layout/ProgressIndicator';
import { SignUpInfoBox } from '@/components/signup/cards/SignUpInfoBox';
import { SIGNUP_STEPS } from './const';
import { inter } from '@/app/fonts';
import { Step1Form } from '@/components/signup/Pages/Step1Form';
import { Step2Form } from '@/components/signup/Pages/Step2Form';
import { Step3Success } from '@/components/signup/Pages/Step3Success';

function SignUpContent() {
  const { currentStep } = useSignUp();

  return (
    <div >
      {/* Progress Indicator */}

      {/* Main Content Container - Responsive width with max-width cap */}
      <div className="max-w-screen-2xl mx-auto px-8 md:px-10 lg:px-12 pb-12 md:pb-16 lg:pb-20 mt-2">
      <ProgressIndicator currentStep={currentStep} steps={SIGNUP_STEPS} />

        {/* Step 1: Two halves - InfoBox + Form */}
        {currentStep === 1 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 lg:gap-12 xl:gap-16">
            <SignUpInfoBox />
            <Step1Form />
          </div>
        )}

        {/* Step 2: Single centered form - 80% width */}
        {currentStep === 2 && (
          <div className="w-full flex justify-center">
            <div className="w-full max-w-[80%]">
              <Step2Form />
            </div>
          </div>
        )}

        {/* Step 3: Single success page - 80% width */}
        {currentStep === 3 && (
          <div className="w-full flex justify-center">
            <div className="w-full max-w-[80%]">
              <Step3Success />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SignUpPage() {
  return (
    <SignUpProvider>
      <SignUpContent />
    </SignUpProvider>
  );
}

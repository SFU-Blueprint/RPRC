'use client';

import { SignUpProvider, useSignUp } from '@/lib/contexts/SignUpContext';
import { ProgressIndicator } from '@/components/signup/ProgressIndicator';
import { SignUpInfoBox } from '@/components/signup/SignUpInfoBox';
import { SIGNUP_STEPS } from './const';
import { inter } from '@/app/fonts';
import { Step1Form } from '@/components/signup/Step1Form';
import { Step2Form } from '@/components/signup/Step2Form';
import { Step3Success } from '@/components/signup/Step3Success';

function SignUpContent() {
  const { currentStep, goToPreviousStep, goToNextStep } = useSignUp();

  return (
    <div className={`min-h-screen bg-[#f7f6f1] ${inter.className}`}>
      {/* Progress Indicator */}
      <ProgressIndicator currentStep={currentStep} steps={SIGNUP_STEPS} />

      {/* Main Content */}
      <div className="max-w-[1920px] mx-auto px-6 md:px-12 lg:px-24 pb-12 md:pb-16 lg:pb-20">
        {/* Step 1: Show info box */}
        {currentStep === 1 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16">
            <SignUpInfoBox />
            <Step1Form />
          </div>
        )}

        {/* Step 2: Contact & Address Information */}
        {currentStep === 2 && (
          <div className="w-full flex justify-center">
            <Step2Form />
          </div>
        )}

        {/* Step 3: Success Page */}
        {currentStep === 3 && (
          <div className="w-full flex justify-center">
            <Step3Success />
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

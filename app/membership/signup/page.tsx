'use client';

import { SignUpProvider, useSignUp } from '@/lib/contexts/SignUpContext';
import { ProgressIndicator } from '@/components/signup/ProgressIndicator';
import { SignUpInfoBox } from '@/components/signup/SignUpInfoBox';
import { Step1Form } from '@/components/signup/Step1Form';
import { SIGNUP_STEPS } from './const';
import { inter } from '@/app/fonts';
import { Step2Form } from '@/components/signup/Step2Form';

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

        {/* Step 3: Placeholder */}
        {currentStep === 3 && (
          <div className="col-span-2">
            <div className="bg-[#eeebe0] rounded-[25px] p-8 md:p-10 lg:p-12">
              <h2 className="text-[24px] md:text-[28px] lg:text-[32px] font-bold mb-6 text-gray-900">
                Step 3: Membership Interests
              </h2>
              <p className="text-gray-700 mb-6">Step 3 form will go here...</p>

              <div className="flex gap-4">
                <button
                  onClick={goToPreviousStep}
                  className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 font-semibold"
                >
                  Back
                </button>
                <button className="px-6 py-3 bg-[#90cd5f] text-white rounded-lg hover:bg-[#80bd4f] font-semibold">
                  Submit
                </button>
              </div>
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

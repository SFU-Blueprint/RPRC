'use client';

import React from 'react';
import { StepInfo } from '@/types/signup';
import { robotoCondensed, headerStyles, bodyStyles } from '@/app/fonts';
import { LockIcon, FormIcon, CheckCircleIcon } from 'lucide-react';

type ProgressIndicatorProps = {
  currentStep: number;
  steps: StepInfo[];
};

export function ProgressIndicator({
  currentStep,
  steps,
}: ProgressIndicatorProps) {
  // Dynamic title based on step
  const title =
    currentStep === 3
      ? 'Application Submitted!'
      : 'RPRC Membership Application';

  return (
    <div className="w-full bg-signup-neutral-50 py-3 md:py-4">
      <h1
        className={`${robotoCondensed.className} mb-4 md:mb-6 ${headerStyles.lResponsive} text-left`}
      >
        {title}
      </h1>
      <div className="max-w-5xl lg:max-w-6xl xl:max-w-7xl mx-auto px-6 md:px-12 lg:px-16 xl:px-24 items-center justify-center">    

        {/* Progress Indicator - Centered */}
        <div className="flex items-center justify-center">
          {steps.map((step, index) => {
            const stepNumber = index + 1;
            const isCompleted = stepNumber <= currentStep;

            return (
              <React.Fragment key={step.id}>
                {/* Step Circle */}
                <div className="flex flex-col items-center">
                  {/* Circle with Icon */}
                  <div
                    className={`
                    w-12 h-12 md:w-14 md:h-14
                    rounded-full
                    flex items-center justify-center
                    transition-colors duration-300
                    ${isCompleted ? 'bg-signup-primary-green-400' : 'bg-signup-neutral-800'}
                    ${stepNumber == 3 ? 'ml-5' : ''}
                    ${stepNumber == 1 ? 'mr-0' : ''}
                  `}
                  >
                    <div className={isCompleted ? 'text-black' : 'text-white'}>
                      {stepNumber === 1 && (
                        // Lock icon for account creation
                        <span>
                          <LockIcon className="w-6 h-6 md:w-8 md:h-8" />
                        </span>
                        
                      )}
                      {stepNumber === 2 && (
                        // Form/pencil icon for form completion
                        <FormIcon className="w-6 h-6 md:w-8 md:h-8" />
                      )}
                      {stepNumber === 3 && (
                        // Document icon for submission
                        <CheckCircleIcon className="w-6 h-6 md:w-8 md:h-8" />
                      )}
                    </div>
                  </div>

                  {/* Label */}
                  <p
                    className={`mt-0.5 md:mt-1 text-center font-normal ${bodyStyles.s} max-w-[100px] min-h-[28px] flex items-center justify-center ${stepNumber == 3 ? 'ml-3' : ''}`}
                  >
                    {step.title}
                  </p>
                </div>

                {/* Connecting Line (center-to-center, except after last step) */}
                {index < steps.length - 1 && (
                  <div
                    className={`
                    h-0.5 md:h-1
                    w-16 md:w-24 lg:w-32
                    mx-1 md:mx-1.5
                    transition-colors duration-300
                    ${stepNumber < currentStep ? 'bg-signup-primary-green-400' : 'bg-signup-neutral-800'}
                  `}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
}

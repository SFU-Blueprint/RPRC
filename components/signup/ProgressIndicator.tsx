'use client';

import React from 'react';
import { StepInfo } from '@/types/signup';
import { robotoCondensed } from '@/app/fonts';

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
    <div className="w-full bg-[#FFFDFA] py-6 md:py-8">
      <div className="max-w-5xl lg:max-w-6xl xl:max-w-7xl mx-auto px-6 md:px-12 lg:px-16 xl:px-24">
        {/* Title - Full width, separate from progress indicator */}
        <h1
          className={`${robotoCondensed.className} font-semibold text-[32px] md:text-[40px] lg:text-[48px] mb-8 md:mb-10`}
        >
          {title}
        </h1>

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
                    w-16 h-16 md:w-18 md:h-18
                    rounded-full
                    flex items-center justify-center
                    transition-colors duration-300
                    ${isCompleted ? 'bg-[#90cd5f]' : 'bg-[#383533]'}
                  `}
                  >
                    <div className={isCompleted ? 'text-black' : 'text-white'}>
                      {stepNumber === 1 && (
                        // Lock icon for account creation
                        <svg
                          className="w-9 h-9 md:w-11 md:h-11"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 2C9.243 2 7 4.243 7 7v3H6c-1.103 0-2 .897-2 2v8c0 1.103.897 2 2 2h12c1.103 0 2-.897 2-2v-8c0-1.103-.897-2-2-2h-1V7c0-2.757-2.243-5-5-5zM9 7c0-1.654 1.346-3 3-3s3 1.346 3 3v3H9V7zm9 13H6v-8h12v8z" />
                        </svg>
                      )}
                      {stepNumber === 2 && (
                        // Form/pencil icon for form completion
                        <svg
                          className="w-9 h-9 md:w-11 md:h-11"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M19 3H5c-1.103 0-2 .897-2 2v14c0 1.103.897 2 2 2h14c1.103 0 2-.897 2-2V5c0-1.103-.897-2-2-2zM5 19V5h14l.002 14H5z" />
                          <path d="M7 7h10v2H7zm0 4h10v2H7zm0 4h7v2H7z" />
                        </svg>
                      )}
                      {stepNumber === 3 && (
                        // Document icon for submission
                        <svg
                          className="w-9 h-9 md:w-11 md:h-11"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M19.937 8.68c-.011-.032-.02-.063-.033-.094a.997.997 0 0 0-.196-.293l-6-6a.997.997 0 0 0-.293-.196c-.03-.014-.062-.022-.094-.033a.991.991 0 0 0-.259-.051C13.04 2.011 13.021 2 13 2H6c-1.103 0-2 .897-2 2v16c0 1.103.897 2 2 2h12c1.103 0 2-.897 2-2V9c0-.021-.011-.04-.013-.062a.99.99 0 0 0-.05-.258zM16.586 8H14V5.414L16.586 8zM6 20V4h6v5a1 1 0 0 0 1 1h5l.002 10H6z" />
                          <path d="M8 12h8v2H8zm0 3h8v2H8zm0 3h5v2H8z" />
                        </svg>
                      )}
                    </div>
                  </div>

                  {/* Label */}
                  <p className="mt-2 md:mt-3 text-center font-normal text-[12px] md:text-[14px] max-w-[100px]">
                    {step.title}
                  </p>
                </div>

                {/* Connecting Line (center-to-center, except after last step) */}
                {index < steps.length - 1 && (
                  <div
                    className={`
                    h-0.5 md:h-1
                    w-24 md:w-32 lg:w-40
                    mx-2 md:mx-3
                    transition-colors duration-300
                    ${stepNumber < currentStep ? 'bg-[#90cd5f]' : 'bg-[#383533]'}
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

'use client';

import React from 'react';
import { StepInfo } from '@/types/signup';

type ProgressIndicatorProps = {
  currentStep: number;
  steps: StepInfo[];
};

export function ProgressIndicator({
  currentStep,
  steps,
}: ProgressIndicatorProps) {
  return (
    <div className="w-full py-8 md:py-12">
      {/* Title */}
      <h2 className="text-center font-bold text-[18px] md:text-[24px] mb-8 md:mb-12">
        Application Process
      </h2>

      {/* Progress Steps */}
      <div className="flex items-center justify-center max-w-4xl mx-auto px-4">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber <= currentStep;
          const isActive = stepNumber === currentStep;

          return (
            <React.Fragment key={step.id}>
              {/* Step Circle */}
              <div className="flex flex-col items-center">
                {/* Circle with Icon */}
                <div
                  className={`
                    w-16 h-16 md:w-24 md:h-24 lg:w-32 lg:h-32
                    rounded-full
                    flex items-center justify-center
                    transition-colors duration-300
                    ${isCompleted ? 'bg-[#89CC62]' : 'bg-[#393533]'}
                  `}
                >
                  {/* Icon */}
                  <div className="text-white text-2xl md:text-3xl lg:text-4xl">
                    {stepNumber === 1 && (
                      // Lock icon for account creation
                      <svg
                        className="w-8 h-8 md:w-12 md:h-12 lg:w-16 lg:h-16"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 2C9.243 2 7 4.243 7 7v3H6c-1.103 0-2 .897-2 2v8c0 1.103.897 2 2 2h12c1.103 0 2-.897 2-2v-8c0-1.103-.897-2-2-2h-1V7c0-2.757-2.243-5-5-5zM9 7c0-1.654 1.346-3 3-3s3 1.346 3 3v3H9V7zm9 13H6v-8h12v8z" />
                      </svg>
                    )}
                    {stepNumber === 2 && (
                      // Form/pencil icon for form completion
                      <svg
                        className="w-8 h-8 md:w-12 md:h-12 lg:w-16 lg:h-16"
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
                        className="w-8 h-8 md:w-12 md:h-12 lg:w-16 lg:h-16"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M19.937 8.68c-.011-.032-.02-.063-.033-.094a.997.997 0 0 0-.196-.293l-6-6a.997.997 0 0 0-.293-.196c-.03-.014-.062-.022-.094-.033a.991.991 0 0 0-.259-.051C13.04 2.011 13.021 2 13 2H6c-1.103 0-2 .897-2 2v16c0 1.103.897 2 2 2h12c1.103 0 2-.897 2-2V9c0-.021-.011-.04-.013-.062a.99.99 0 0 0-.05-.258zM16.586 8H14V5.414L16.586 8zM6 20V4h6v5a1 1 0 0 0 1 1h5l.002 10H6z" />
                      </svg>
                    )}
                  </div>
                </div>

                {/* Label */}
                <p className="mt-3 md:mt-4 text-center font-normal text-[12px] md:text-[14px] lg:text-[16px] max-w-[100px] md:max-w-[120px]">
                  {step.title}
                </p>
              </div>

              {/* Connecting Line (except after last step) */}
              {index < steps.length - 1 && (
                <div
                  className={`
                    h-1 md:h-1.5
                    w-16 md:w-32 lg:w-48
                    mx-2 md:mx-4
                    transition-colors duration-300
                    ${stepNumber < currentStep ? 'bg-[#89CC62]' : 'bg-[#393533]'}
                  `}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

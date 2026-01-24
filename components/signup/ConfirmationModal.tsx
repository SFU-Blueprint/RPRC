'use client';

import React from 'react';
import { inter } from '@/app/fonts';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
}: ConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop - shaded overlay */}
      <div
        className="fixed inset-0 bg-black/60 z-40 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${inter.className}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="bg-white rounded-[25px] w-full max-w-[90%] sm:max-w-md md:max-w-lg lg:max-w-xl p-6 sm:p-8 md:p-10 relative shadow-2xl">
          {/* Close Button (X) */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 sm:top-6 sm:right-6 text-gray-500 hover:text-gray-700 transition-colors"
            aria-label="Close modal"
          >
            <svg
              className="w-6 h-6 sm:w-7 sm:h-7"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          {/* Green Checkmark Icon */}
          <div className="flex justify-center mb-6 sm:mb-8">
            <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 bg-[#90cd5f] rounded-full flex items-center justify-center">
              <svg
                className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={3}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>

          {/* Heading */}
          <h2
            id="modal-title"
            className="text-center text-[24px] sm:text-[28px] md:text-[32px] font-normal text-gray-900 mb-4 sm:mb-5"
          >
            Confirm Submission
          </h2>

          {/* Description Text */}
          <p className="text-center text-[14px] sm:text-[15px] md:text-[16px] text-gray-700 mb-6 sm:mb-7 leading-relaxed">
            Are you sure you want to submit your membership application?
            <br />
            Please review all your information before submitting.
          </p>

          {/* Info Box */}
          <div className="bg-gray-100 rounded-lg p-4 sm:p-5 md:p-6 mb-6 sm:mb-8">
            <p className="text-[13px] sm:text-[14px] md:text-[15px] text-gray-800 leading-relaxed text-center">
              Once submitted, your application will be reviewed by our team. You
              will receive a confirmation email and updates about your
              application status.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            {/* Go Back Button */}
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 sm:py-3.5 md:py-4 
                bg-white border-2 border-[#383533] 
                text-[#383533] font-semibold 
                text-[15px] sm:text-[16px] md:text-[18px]
                rounded-lg 
                hover:bg-gray-50 
                transition-colors"
            >
              Go Back
            </button>

            {/* Confirm & Submit Button */}
            <button
              onClick={onConfirm}
              className="flex-1 px-6 py-3 sm:py-3.5 md:py-4 
                bg-[#90cd5f] 
                text-[#383533] font-semibold 
                text-[15px] sm:text-[16px] md:text-[18px]
                rounded-lg 
                hover:bg-[#7ab84f] 
                transition-colors"
            >
              Confirm & Submit
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

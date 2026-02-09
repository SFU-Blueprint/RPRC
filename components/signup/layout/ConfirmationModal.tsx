'use client';

import React from 'react';
import {
  inter,
  robotoCondensed,
  headerStyles,
  bodyStyles,
  buttonStyles,
} from '@/app/fonts';

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
        <div className="bg-white rounded-[20px] w-full max-w-lg p-6 sm:p-8 relative shadow-2xl">
          {/* Heading */}
          <h2
            id="modal-title"
            className={`text-gray-900 mb-4 ${headerStyles.sResponsive} ${robotoCondensed.className}`}
          >
            Confirm Submission
          </h2>

          {/* Description Text */}
          <p className={`text-gray-700 mb-6 leading-relaxed ${bodyStyles.m}`}>
            Please review all information carefully before submitting. You
            won&apos;t be able to make changes after submission
          </p>

          {/* Buttons - Right aligned */}
          <div className="flex justify-end gap-3">
            {/* Cancel Button */}
            <button
              onClick={onClose}
              className={`
                px-6 py-2.5
                bg-white border-2 border-[#383533]
                text-[#383533] font-medium
                rounded-lg
                hover:bg-gray-50
                transition-colors
                ${buttonStyles.text}
              `}
            >
              Cancel
            </button>

            {/* Confirm Button */}
            <button
              onClick={onConfirm}
              className={`
                px-6 py-2.5
                bg-[#5EB42D]
                hover:bg-[#2B8100]
                active:bg-[#004E00]
                text-white font-semibold
                rounded-lg
                transition-colors
                ${buttonStyles.text}
              `}
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

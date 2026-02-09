'use client';

import React from 'react';
import Link from 'next/link';
import {
  inter,
  robotoCondensed,
  headerStyles,
  bodyStyles,
  buttonStyles,
} from '@/app/fonts';
import { SuccessInfoCard } from '../cards/SuccessInfoCard';

export function Step3Success() {
  return (
    <div
      className={`bg-[#f6f6f6] rounded-[25px] shadow-lg p-8 sm:p-10 md:p-12 lg:p-14 ${inter.className}`}
    >
      {/* Dark Logo with Checkmark */}
      <div className="flex justify-center mb-6 sm:mb-8">
        <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 bg-[#383533] rounded-full flex items-center justify-center shadow-lg">
          <svg
            className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 text-white"
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

      {/* Main Heading */}
      <h1
        className={`text-center text-gray-900 mb-4 sm:mb-5 ${headerStyles.lResponsive} ${robotoCondensed.className}`}
      >
        Application Submitted Successfully!
      </h1>

      {/* Thank You Text */}
      <p
        className={`text-center text-gray-700 mb-10 sm:mb-12 md:mb-14 leading-relaxed ${bodyStyles.m}`}
      >
        Thank you for applying to become a member of the Richmond Poverty
        Reduction Coalition.
      </p>

      {/* Info Cards - 4 columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6 mb-10 sm:mb-12">
        {/* Card 1: Check Your Email */}
        <SuccessInfoCard
          icon={
            <svg
              className="w-16 h-16 sm:w-20 sm:h-20 text-[#B2DC93]"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          }
          heading="Check Your Email"
          description="A confirmation email has been sent to your registered email address, further about your application status will bw sent here."
        />

        {/* Card 2: View Your Profile */}
        <SuccessInfoCard
          icon={
            <svg
              className="w-16 h-16 sm:w-20 sm:h-20 text-[#B2DC93]"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          }
          heading="View Your Profile"
          description="All following steps will be done through the applicant profile including viewing membership status ."
        />

        {/* Card 3: Review Period */}
        <SuccessInfoCard
          icon={
            <svg
              className="w-16 h-16 sm:w-20 sm:h-20 text-[#B2DC93]"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zM9 14H7v-2h2v2zm4 0h-2v-2h2v2zm4 0h-2v-2h2v2zm-8 4H7v-2h2v2zm4 0h-2v-2h2v2zm4 0h-2v-2h2v2z" />
            </svg>
          }
          heading="Review Period"
          description="Our team will review your application within 14 business days."
        />

        {/* Card 4: Next Steps */}
        <SuccessInfoCard
          icon={
            <svg
              className="w-16 h-16 sm:w-20 sm:h-20 text-[#B2DC93]"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          }
          heading="Next Steps"
          description="Once approved, you'll receive payment instructions. After confirmation, your membership will be activated."
        />
      </div>

      {/* Buttons - Centered */}
      <div className="flex justify-center gap-3 sm:gap-4">
        {/* View Profile Button */}
        <Link
          href="/profile"
          className={`
            bg-[#5EB42D]
            hover:bg-[#2B8100]
            active:bg-[#004E00]
            text-white font-semibold
            px-8 sm:px-10 py-2.5 sm:py-3
            rounded-lg
            transition-colors
            ${buttonStyles.text}
          `}
        >
          View Profile
        </Link>

        {/* Back to Home Button */}
        <Link
          href="/"
          className={`
            bg-[#383533]
            hover:bg-[#2a2725]
            active:bg-[#1a1816]
            text-white font-semibold
            px-8 sm:px-10 py-2.5 sm:py-3
            rounded-lg
            transition-colors
            ${buttonStyles.text}
          `}
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}

'use client';

import React from 'react';
import Link from 'next/link';
import { inter } from '@/app/fonts';
import { InfoCard } from './InfoCard';

export function Step3Success() {
  return (
    <div
      className={`w-full max-w-6xl mx-auto bg-white rounded-[25px] shadow-lg p-8 sm:p-10 md:p-12 lg:p-14 ${inter.className}`}
    >
      {/* Green Checkmark Icon */}
      <div className="flex justify-center mb-6 sm:mb-8">
        <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 bg-[#90cd5f] rounded-full flex items-center justify-center">
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
      <h1 className="text-center font-normal text-[28px] sm:text-[32px] md:text-[36px] lg:text-[40px] text-gray-900 mb-4 sm:mb-5">
        Application Submitted Successfully!
      </h1>

      {/* Thank You Text */}
      <p className="text-center text-[15px] sm:text-[16px] md:text-[17px] lg:text-[18px] text-gray-700 mb-10 sm:mb-12 md:mb-14 leading-relaxed">
        Thank you for applying to become a member of the Richmond Policy
        Research Collective.
      </p>

      {/* Info Cards - 3 columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6 mb-10 sm:mb-12 md:mb-14">
        {/* Card 1: Check Your Email */}
        <InfoCard
          icon={
            <svg
              className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 text-[#90cd5f]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          }
          heading="Check Your Email"
          description="A confirmation email has been sent to your registered email address."
        />

        {/* Card 2: Review Period */}
        <InfoCard
          icon={
            <svg
              className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 text-[#90cd5f]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          }
          heading="Review Period"
          description="Your application will be reviewed within 2-3 business days."
        />

        {/* Card 3: Application ID */}
        <InfoCard
          icon={
            <svg
              className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 text-[#90cd5f]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          }
          heading="Application ID"
          description="Reference: APP-561995"
        />
      </div>

      {/* What Happens Next Section */}
      <div className="bg-[#eeebe0] rounded-[25px] p-6 sm:p-8 md:p-10 mb-8 sm:mb-10 md:mb-12">
        <h2 className="font-semibold text-[20px] sm:text-[22px] md:text-[24px] text-gray-900 mb-5 sm:mb-6">
          What happens next?
        </h2>

        <ol className="space-y-3 sm:space-y-4 list-decimal list-inside text-[14px] sm:text-[15px] md:text-[16px] text-gray-800 leading-relaxed">
          <li className="pl-2">
            Our team will review your application details
          </li>
          <li className="pl-2">
            You will receive an email notification about your application status
          </li>
          <li className="pl-2">
            Once approved, you&apos;ll receive payment instructions to complete
            your membership
          </li>
          <li className="pl-2">
            After payment confirmation, your membership will be activated
          </li>
        </ol>
      </div>

      {/* Return to Home Button */}
      <div className="flex justify-center">
        <Link
          href="/"
          className="inline-block bg-[#383533] hover:bg-[#2a2725] text-white font-semibold text-[16px] sm:text-[17px] md:text-[18px] px-10 sm:px-12 md:px-14 py-3 md:py-4 rounded-lg transition-colors"
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
}

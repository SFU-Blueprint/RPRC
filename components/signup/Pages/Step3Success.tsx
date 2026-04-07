'use client';

import Link from 'next/link';
import '@/app/globals.css';
import {
  inter,
  robotoCondensed,
  headerStyles,
  bodyStyles,
  buttonStyles,
} from '@/app/fonts';
import { SuccessInfoCard } from '../cards/SuccessInfoCard';
import { INFO_CARDS } from '@/lib/constants/membership';

export function Step3Success() {
  return (
    <div
      className={`bg-signup-neutral-100 rounded-[25px] shadow-[0px_-1px_2px_-1px_rgba(0,0,0,0.15),0px_1px_3px_1px_rgba(0,0,0,0.15)] p-6 sm:p-8 md:p-10 lg:p-12 w-full mx-auto ${inter.className} mt-16.25`}
    >
      {/* Dark Logo with Checkmark */}
      <div className="flex justify-center mb-6 sm:mb-8">
        <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 bg-signup-neutral-800 rounded-full flex items-center justify-center shadow-lg">
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
        className={`text-center text-gray-700 mb-10 sm:mb-12 md:mb-14 leading-relaxed ${bodyStyles.lg}`}
      >
        Thank you for applying to become a member of the Richmond Poverty
        Reduction Coalition.
      </p>

      {/* Info Cards - 4 columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6 mb-10 sm:mb-12">
        {INFO_CARDS.map((card) => {
          const Icon = card.ICON;
          return (
            <SuccessInfoCard
              key={card.ID}
              icon={
                <Icon className="w-16 h-16 sm:w-20 sm:h-20 text-signup-primary-green-300" />
              }
              heading={card.HEADING}
              description={card.DESCRIPTION}
            />
          );
        })}
      </div>

      {/* Buttons - Centered */}
      <div className="flex justify-center gap-3 sm:gap-4">
        {/* View Profile Button */}
        <Link
          href="/membership/dashboard"
          className={`
            bg-signup-primary-green-500
            hover:bg-signup-primary-green-600
            active:bg-signup-primary-green-700
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
            bg-signup-neutral-800
            hover:bg-signup-neutral-900
            active:bg-signup-neutral-950
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

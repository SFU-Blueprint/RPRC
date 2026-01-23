'use client';

import React from 'react';
import { inter } from '@/app/fonts';

export function SignUpInfoBox() {
  return (
    <div
      className={`bg-[#383533] rounded-[25px] text-white ${inter.className} min-h-[350px] md:min-h-[400px] lg:min-h-[450px] flex items-center justify-center p-6 md:p-8 overflow-hidden`}
    >
      <div className="flex flex-col items-center space-y-6 md:space-y-8 w-full">
        {/* Three Circles - spanning edge to edge */}
        <div className="flex items-center justify-between w-full px-0 gap-3 md:gap-4 lg:gap-5">
          {/* Left Circle (darker green, LARGE - 70% inside, 30% outside) */}
          <div className="w-56 h-56 md:w-64 md:h-64 lg:w-72 lg:h-72 rounded-full bg-[#638149] flex items-center justify-center -ml-16 md:-ml-19 lg:-ml-22">
            {/* Empty */}
          </div>

          {/* Center Circle (lighter green, bigger) */}
          <div className="w-42 h-42 md:w-52 md:h-52 lg:w-60 lg:h-60 rounded-full bg-[#90cd5f] flex flex-col items-center justify-center gap-2 md:gap-3">
            {/* Email Icon - Outline */}
            <svg
              className="w-16 h-16 md:w-18 md:h-18 lg:w-24 lg:h-24 text-[#383533]"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>

            {/* Bell Icon - Outline */}
            <svg
              className="w-13 h-13 md:w-15 md:h-15 lg:w-18 lg:h-18 text-[#383533]"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
          </div>

          {/* Right Circle (darker green, LARGE - 70% inside, 30% outside) */}
          <div className="w-56 h-56 md:w-64 md:h-64 lg:w-72 lg:h-72 rounded-full bg-[#638149] flex items-center justify-center -mr-16 md:-mr-19 lg:-mr-22">
            {/* Empty */}
          </div>
        </div>

        {/* Text */}
        <div className="text-center">
          <p className="text-[14px] md:text-[16px] lg:text-[18px] leading-relaxed">
            This is where you will receive
            <br />
            updates about membership
          </p>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-4 md:mt-5">
            <div className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-white"></div>
            <div className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-white opacity-50"></div>
            <div className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-white opacity-50"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

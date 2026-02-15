'use client';

import React from 'react';
import { inter, robotoCondensed, bodyStyles } from '@/app/fonts';
import '@/app/globals.css';
export function SignUpInfoBox() {
  return (
    <div
      className={`hidden lg:flex bg-signup-neutral-700 rounded-[25px] text-white ${inter.className} min-h-[250px] md:min-h-[300px] lg:min-h-[350px] flex flex-col items-center justify-center relative overflow-hidden`}
    >
      {/* Email Circle - Top Left Corner */}
      <div className="absolute top-1 left-1 md:top-2 md:left-2 lg:top-4 lg:left-4">
        <div className="w-20 h-20 md:w-28 md:h-28 lg:w-36 lg:h-36 rounded-full bg-signup-neutral-750 flex items-center justify-center p-[20%]">
          <svg
            className="w-full h-full text-signup-primary-green-300"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
          </svg>
        </div>
      </div>

      {/* Bell Circle - Top Right Corner (slightly lower) */}
      <div className="absolute top-4 right-1 md:top-6 md:right-2 lg:top-8 lg:right-4">
        <div className="w-20 h-20 md:w-28 md:h-28 lg:w-36 lg:h-36 rounded-full bg-signup-neutral-750 flex items-center justify-center p-[20%]">
          <svg
            className="w-full h-full text-signup-primary-green-300"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
          </svg>
        </div>
      </div>

      {/* Center Content - Person Circle + Text */}
      <div className="flex flex-col items-center justify-center gap-2 md:gap-3 lg:gap-4">
        {/* Person Circle - Center (both horizontally and vertically) */}
        <div className="w-48 h-48 md:w-56 md:h-56 lg:w-72 lg:h-72 rounded-full bg-signup-neutral-750 flex items-center justify-center p-[20%]">
          <svg
            className="w-full h-full text-signup-primary-green-300"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
          </svg>
        </div>

        {/* Text - Directly under person circle */}
        <div className={`text-center px-3 ${robotoCondensed.className}`}>
          <p className={`font-semibold ${bodyStyles.lg}`}>
            Your membership portal is where you will
            <br />
            receive updates about membership,
            <br />
            renewals and events.
          </p>
        </div>
      </div>
    </div>
  );
}

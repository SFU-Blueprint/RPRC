'use client';

import React from 'react';
import { inter, robotoCondensed, bodyStyles } from '@/app/fonts';

export function SignUpInfoBox() {
  return (
    <div
      className={`bg-[#403f39] rounded-[25px] text-white ${inter.className} min-h-[350px] md:min-h-[400px] lg:min-h-[450px] flex flex-col items-center justify-center relative overflow-hidden`}
    >
      {/* Email Circle - Top Left Corner */}
      <div className="absolute top-4 left-4 md:top-6 md:left-6 lg:top-8 lg:left-8">
        <div className="w-30 h-30 md:w-36 md:h-36 lg:w-42 lg:h-42 rounded-full bg-[#25221a] flex items-center justify-center p-[20%]">
          <svg
            className="w-full h-full text-[#b2dc93]"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
          </svg>
        </div>
      </div>

      {/* Bell Circle - Top Right Corner (slightly lower) */}
      <div className="absolute top-8 right-4 md:top-10 md:right-6 lg:top-12 lg:right-8">
        <div className="w-30 h-30 md:w-36 md:h-36 lg:w-42 lg:h-42 rounded-full bg-[#25221a] flex items-center justify-center p-[20%]">
          <svg
            className="w-full h-full text-[#b2dc93]"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
          </svg>
        </div>
      </div>

      {/* Center Content - Person Circle + Text */}
      <div className="flex flex-col items-center justify-center gap-4 md:gap-5 lg:gap-6">
        {/* Person Circle - Center (both horizontally and vertically) */}
        <div className="w-60 h-60 md:w-72 md:h-72 lg:w-84 lg:h-84 rounded-full bg-[#25221a] flex items-center justify-center p-[20%]">
          <svg
            className="w-full h-full text-[#b2dc93]"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
          </svg>
        </div>

        {/* Text - Directly under person circle */}
        <div className={`text-center px-6 ${robotoCondensed.className}`}>
          <p className={`font-semibold ${bodyStyles.m}`}>
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

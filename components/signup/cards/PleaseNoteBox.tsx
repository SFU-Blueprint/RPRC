'use client';

import React from 'react';
import { inter, bodyStyles } from '@/app/fonts';

export function PleaseNoteBox() {
  return (
    <div
      className={`mb-8 md:mb-10 bg-blue-50 border-l-4 border-blue-500 p-3 sm:p-4 rounded-r-lg flex gap-2 ${inter.className}`}
    >
      {/* Info Icon */}
      <div className="flex-shrink-0">
        <svg
          className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
            clipRule="evenodd"
          />
        </svg>
      </div>

      {/* Text Content */}
      <div>
        <h3 className={`font-semibold text-gray-900 mb-1 ${bodyStyles.m}`}>
          Please Note
        </h3>
        <ul
          className={`text-gray-800 space-y-1 ${bodyStyles.s} leading-relaxed`}
        >
          <li className="flex gap-2">
            <span>•</span>
            <span>
              Be eligible to vote at our Annual General Meeting, members must
              have been registered for at least 30 days prior to the meeting.
            </span>
          </li>
          <li className="flex gap-2">
            <span>•</span>
            <span>
              All memberships require a renewal every January. If you join after
              October 1st, your membership carries over, and you won't need to
              renew until January of the year after next.
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}

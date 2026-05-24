'use client';

import React from 'react';
import { inter, bodyStyles } from '@/app/fonts';

type Props = {
  heading: string;
  primaryLine?: string;
  secondaryLine?: string;
}

export function InfoBox({
  heading,
  primaryLine,
  secondaryLine
}: Props) {
  return (
    <div
      className={`mb-6 bg-feedback-info border-l-8 border-feedback-info-accent sm:p-4 rounded-lg flex gap-2 ${inter.className}`}
    >
      {/* Info Icon */}
      <div className="shrink-0">
        <svg
          className="w-4 h-4 sm:w-5 sm:h-5 text-feedback-info-accent"
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
          {heading}
        </h3>
        <ul
          className={`text-gray-800 space-y-1 ${bodyStyles.s} leading-relaxed`}
        >
          { primaryLine &&
            (
              <li className="flex gap-2">
                <span>•</span>
                <span>
                  {primaryLine}
                </span>
              </li>
            )
          }
          {
            secondaryLine &&
            (
              <li className="flex gap-2">
                <span>•</span>
                <span>
                  {secondaryLine}
                </span>
              </li>
            )
          }
        </ul>
      </div>
    </div>
  );
}

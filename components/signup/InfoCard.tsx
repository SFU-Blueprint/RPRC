'use client';

import React from 'react';
import { inter } from '@/app/fonts';

interface InfoCardProps {
  icon: React.ReactNode;
  heading: string;
  description: string;
}

export function InfoCard({ icon, heading, description }: InfoCardProps) {
  return (
    <div
      className={`bg-[#f5f5f0] rounded-2xl p-6 sm:p-7 md:p-8 flex flex-col items-center text-center ${inter.className}`}
    >
      {/* Icon */}
      <div className="mb-5 sm:mb-6">{icon}</div>

      {/* Heading */}
      <h3 className="font-semibold text-[18px] sm:text-[19px] md:text-[20px] lg:text-[21px] text-gray-900 mb-3 sm:mb-4">
        {heading}
      </h3>

      {/* Description */}
      <p className="text-[14px] sm:text-[15px] md:text-[16px] text-gray-700 leading-relaxed">
        {description}
      </p>
    </div>
  );
}

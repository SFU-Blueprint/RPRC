'use client';

import React from 'react';
import { inter, bodyStyles } from '@/app/fonts';

interface SuccessInfoCardProps {
  icon: React.ReactNode;
  heading: string;
  description: string;
}

export function SuccessInfoCard({
  icon,
  heading,
  description,
}: SuccessInfoCardProps) {
  return (
    <div
      className={`
        bg-[#FFFDFA] 
        border border-[#28231a]
        rounded-[20px] 
        p-6 sm:p-7 
        flex flex-col items-center text-center
        ${inter.className}
      `}
    >
      {/* Icon */}
      <div className="mb-4 sm:mb-5">{icon}</div>

      {/* Heading */}
      <h3 className={`font text-gray-900 mb-3 ${bodyStyles.m}`}>{heading}</h3>

      {/* Description */}
      <p className={`text-gray-700 leading-relaxed ${bodyStyles.s}`}>
        {description}
      </p>
    </div>
  );
}

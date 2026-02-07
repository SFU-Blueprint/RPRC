'use client';

import React from 'react';
import { inter, robotoCondensed, headerStyles, bodyStyles } from '@/app/fonts';

type MembershipInfoCardProps = {
  type: 'individual' | 'organization';
  title: string;
  price: string;
  description: string;
  isSelected: boolean;
  onSelect: () => void;
};

export function MembershipInfoCard({
  type,
  title,
  price,
  description,
  isSelected,
  onSelect,
}: MembershipInfoCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`
        w-full p-6 md:p-8
        border-2 border-gray-800
        rounded-[25px]
        text-left
        transition-all duration-200
        hover:border-[#90cd5f]
        focus:outline-none focus:ring-2 focus:ring-[#90cd5f] focus:ring-offset-2
        ${isSelected ? 'bg-[#d6d9f0]' : 'bg-[#fffdfa]'}
      `}
      aria-pressed={isSelected}
      aria-label={`Select ${title} membership`}
    >
      {/* Header: Title and Price */}
      <div className="flex items-start justify-between mb-4">
        {/* Title */}
        <h3
          className={`text-gray-900 ${headerStyles.sResponsive} ${robotoCondensed.className}`}
        >
          {title}
        </h3>

        {/* Price */}
        <span
          className={`text-gray-900 ${headerStyles.sResponsive} ${robotoCondensed.className}`}
        >
          {price}
        </span>
      </div>

      {/* Description */}
      <p className={`text-gray-700 ${bodyStyles.m} ${inter.className}`}>
        {description}
      </p>
    </button>
  );
}

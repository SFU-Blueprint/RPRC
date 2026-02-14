'use client';

import React from 'react';
import { inter, bodyStyles } from '@/app/fonts';

type InterestCardProps = {
  label: string;
  isSelected: boolean;
  onToggle: () => void;
};

export function InterestCard({
  label,
  isSelected,
  onToggle,
}: InterestCardProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`
        w-full px-6 py-4
        border-2 border-gray-800
        rounded-full
        flex items-center justify-center gap-3
        transition-all duration-200
        hover:border-signup-medium-green
        focus:outline-none focus:ring-2 focus:ring-signup-medium-green focus:ring-offset-2
        ${isSelected ? 'bg-signup-light-gray' : 'bg-signup-off-white'}
        ${inter.className}
      `}
      aria-pressed={isSelected}
      aria-label={`${isSelected ? 'Deselect' : 'Select'} ${label}`}
    >
      {/* Icon - Plus or X */}
      <span className="text-signup-medium-green text-[28px] font-bold leading-none">
        {isSelected ? '×' : '+'}
      </span>

      {/* Label */}
      <span className={`text-gray-800 font-medium ${bodyStyles.lg}`}>
        {label}
      </span>
    </button>
  );
}

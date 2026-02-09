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
        hover:border-[#90cd5f]
        focus:outline-none focus:ring-2 focus:ring-[#90cd5f] focus:ring-offset-2
        ${isSelected ? 'bg-[#e9e9e8]' : 'bg-[#fffdfa]'}
        ${inter.className}
      `}
      aria-pressed={isSelected}
      aria-label={`${isSelected ? 'Deselect' : 'Select'} ${label}`}
    >
      {/* Icon - Plus or X */}
      <span className="text-[#90cd5f] text-[28px] font-bold leading-none">
        {isSelected ? '×' : '+'}
      </span>

      {/* Label */}
      <span className={`text-gray-800 font-medium ${bodyStyles.m}`}>
        {label}
      </span>
    </button>
  );
}

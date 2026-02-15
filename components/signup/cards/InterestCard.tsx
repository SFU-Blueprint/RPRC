'use client';

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
        border border-interactive-feature-stroke
        rounded-full
        flex items-center justify-center gap-3
        transition-all duration-200
        hover:border-signup-primary-green-500
        focus:outline-none focus:ring-2 focus:ring-signup-primary-green-500 focus:ring-offset-2
        cursor-pointer
        ${isSelected ? 'bg-signup-neutral-200' : 'bg-signup-neutral-50'}
        ${inter.className}
      `}
      aria-pressed={isSelected}
      aria-label={`${isSelected ? 'Deselect' : 'Select'} ${label}`}
    >
      {/* Icon - Plus or X */}
      <span className="text-signup-primary-green-500 text-[28px] font-normal leading-none">
        {isSelected ? '×' : '+'}
      </span>

      {/* Label */}
      <span className={`text-gray-800 font-medium ${bodyStyles.lg}`}>
        {label}
      </span>
    </button>
  );
}

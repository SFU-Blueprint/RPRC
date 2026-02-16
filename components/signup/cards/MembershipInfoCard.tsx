'use client';

import { inter, robotoCondensed, headerStyles, bodyStyles } from '@/app/fonts';

type MembershipInfoCardProps = {
  title: string;
  price: string;
  description: string;
  isSelected: boolean;
  onSelect: () => void;
};

export function MembershipInfoCard({
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
        w-full p-4 md:p-5
        flex flex-col
        border-2 border-gray-800
        rounded-[25px]
        text-left
        transition-all duration-200
        hover:border-signup-primary-green-400
        focus:outline-none focus:ring-2 focus:ring-signup-primary-green-400 focus:ring-offset-2
        ${isSelected ? 'bg-signup-membership-option-selected' : 'bg-signup-neutral-50'}
      `}
      aria-pressed={isSelected}
      aria-label={`Select ${title} membership`}
    >
      {/* Header: Title and Price */}
      <div className="flex items-start justify-between mb-2">
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

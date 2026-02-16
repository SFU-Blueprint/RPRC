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
        border-2 border-gray-200
        rounded-xl
        text-left
        transition-all duration-200
        ${isSelected ? 'bg-primary-light' : 'bg-white'}
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

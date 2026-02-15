'use client';

import React from 'react';
import { inter, bodyStyles } from '@/app/fonts';

type RadioButtonProps = {
  label: string;
  value: string;
  checked: boolean;
  onChange: (value: string) => void;
  name: string;
};

export function FormRadioButton({
  label,
  value,
  checked,
  onChange,
  name,
}: RadioButtonProps) {
  return (
    <label className="flex items-center cursor-pointer group">
      {/* Custom Radio Button */}
      <div className="relative flex items-center justify-center">
        {/* Hidden native radio */}
        <input
          type="radio"
          name={name}
          value={value}
          checked={checked}
          onChange={() => onChange(value)}
          className="sr-only"
        />

        {/* Custom Radio Circle */}
        <div
          className={`
            w-6 h-6 rounded-full border-2 flex items-center justify-center
            transition-all duration-200
            ${
              checked
                ? 'bg-signup-primary-green-500 border-signup-primary-green-500'
                : 'bg-white border-gray-400 group-hover:border-signup-primary-green-400 group-hover:bg-signup-primary-green-100'
            }
          `}
        >
          {/* Inner white dot when selected */}
          {checked && <div className="w-2.5 h-2.5 bg-white rounded-full" />}
        </div>
      </div>

      {/* Label Text */}
      <span
        className={`ml-3 text-gray-900 select-none ${bodyStyles.lg} ${inter.className}`}
      >
        {label}
      </span>
    </label>
  );
}

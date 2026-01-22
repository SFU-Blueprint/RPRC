'use client';

import React from 'react';
import { inter } from '@/app/fonts';

type FormSelectProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  error?: string;
  placeholder?: string;
  required?: boolean;
  showValidation?: boolean;
};

export function FormSelect({
  label,
  value,
  onChange,
  options,
  error,
  placeholder = 'Select an option',
  required = false,
  showValidation = false,
}: FormSelectProps) {
  const getBorderClass = () => {
    if (!showValidation) {
      return 'border-gray-300 focus:border-blue-500 focus:ring-blue-500';
    }
    if (error) {
      return 'border-red-500 focus:border-red-500 focus:ring-red-500';
    }
    if (value && !error) {
      return 'border-green-500 focus:border-green-500 focus:ring-green-500';
    }
    return 'border-gray-300 focus:border-blue-500 focus:ring-blue-500';
  };

  return (
    <div className={`w-full ${inter.className}`}>
      <label
        htmlFor={label}
        className="block font-medium text-[14px] md:text-[16px] text-gray-700 mb-1"
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <select
        id={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`
          w-full px-3 py-2 
          border-2 rounded-md
          text-[14px] md:text-[16px]
          focus:outline-none focus:ring-2
          transition-colors
          bg-white
          ${getBorderClass()}
        `}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${label}-error` : undefined}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      {showValidation && error && (
        <p
          id={`${label}-error`}
          className="text-red-500 text-[14px] mt-1"
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
}

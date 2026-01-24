'use client';

import React from 'react';
import { inter } from '@/app/fonts';

type FormTextAreaProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
  rows?: number;
  required?: boolean;
  showValidation?: boolean;
};

export function FormTextArea({
  label,
  value,
  onChange,
  error,
  placeholder,
  rows = 4,
  required = false,
  showValidation = false,
}: FormTextAreaProps) {
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
      <textarea
        id={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className={`
          w-full px-3 py-2 
          border-2 rounded-md
          bg-white
          text-[14px] md:text-[16px]
          focus:outline-none focus:ring-2
          transition-colors
          resize-vertical
          ${getBorderClass()}
        `}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${label}-error` : undefined}
      />
      {showValidation && error && (
        <p id={`${label}-error`} className="text-[14px] mt-1" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

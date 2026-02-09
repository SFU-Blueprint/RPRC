'use client';

import React from 'react';

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
  // Determine border color based on validation state
  const getBorderClass = () => {
    // Only show validation colors if showValidation is true
    if (!showValidation) {
      return 'border-gray-300 focus:border-blue-500 focus:ring-blue-500';
    }

    // Show red if there's an error
    if (error) {
      return 'border-red-500 focus:border-red-500 focus:ring-red-500';
    }

    // Show green if value exists and no error
    if (value && !error) {
      return 'border-green-500 focus:border-green-500 focus:ring-green-500';
    }

    // Default
    return 'border-gray-300 focus:border-blue-500 focus:ring-blue-500';
  };

  return (
    <div className="w-full">
      {/* Label */}
      <label
        htmlFor={label}
        className="block font-medium text-[14px] md:text-[16px] text-gray-700 mb-1"
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {/* TextArea */}
      <textarea
        id={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className={`
          w-full px-3 py-2 
          border-2 rounded-md
          text-[14px] md:text-[16px]
          focus:outline-none focus:ring-2
          transition-colors
          resize-vertical
          ${getBorderClass()}
        `}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${label}-error` : undefined}
      />

      {/* Error message - only show if validation attempted */}
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

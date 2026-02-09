'use client';

import React from 'react';
import {
  inter,
  robotoCondensed,
  headerStyles,
  bodyStyles,
  buttonStyles,
} from '@/app/fonts';

type FormTextAreaProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
  helperText?: string;
  rows?: number;
  disabled?: boolean;
  showValidation?: boolean;
};

export function FormTextArea({
  label,
  value,
  onChange,
  error,
  placeholder,
  helperText,
  rows = 5,
  disabled = false,
  showValidation = false,
}: FormTextAreaProps) {
  const getBorderClass = () => {
    if (disabled) {
      return 'border-gray-200';
    }
    if (!showValidation) {
      return 'border-gray-300 focus:border-blue-500';
    }
    if (error) {
      return 'border-red-500 focus:border-red-500';
    }
    if (value && !error) {
      return 'border-[#90cd5f] focus:border-[#90cd5f]';
    }
    return 'border-gray-300 focus:border-blue-500';
  };

  const getBackgroundClass = () => {
    if (disabled) {
      return 'bg-gray-50';
    }
    if (error && showValidation) {
      return 'bg-red-50';
    }
    return 'bg-white';
  };

  return (
    <div className={`w-full ${inter.className}`}>
      {/* Label - Bold with Roboto Condensed */}
      <label
        htmlFor={label}
        className={`block text-gray-900 mb-2 ${headerStyles.mResponsive} ${robotoCondensed.className}`}
      >
        {label}
      </label>

      {/* Textarea Field */}
      <div className="relative">
        <textarea
          id={label}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={rows}
          disabled={disabled}
          className={`
            w-full px-4 py-3 
            border rounded-[20px]
            ${bodyStyles.m}
            text-gray-900
            placeholder:text-gray-400
            focus:outline-none
            transition-colors
            resize-vertical
            disabled:cursor-not-allowed disabled:text-gray-500
            ${getBorderClass()}
            ${getBackgroundClass()}
          `}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={
            error
              ? `${label}-error`
              : helperText
                ? `${label}-helper`
                : undefined
          }
        />

        {/* Error Icon (exclamation mark in red circle) */}
        {showValidation && error && (
          <div className="absolute right-3 top-3">
            <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-white text-[12px] font-bold">!</span>
            </div>
          </div>
        )}
      </div>

      {/* Helper Text or Error Message */}
      {showValidation && error ? (
        <p
          id={`${label}-error`}
          className="text-red-500 ${bodyStyles.s} mt-1"
          role="alert"
        >
          {error}
        </p>
      ) : (
        helperText && (
          <p
            id={`${label}-helper`}
            className="text-gray-400 ${bodyStyles.s} mt-1"
          >
            {helperText}
          </p>
        )
      )}
    </div>
  );
}

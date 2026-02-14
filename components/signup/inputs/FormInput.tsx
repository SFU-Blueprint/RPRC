'use client';

import React from 'react';
import { inter, bodyStyles } from '@/app/fonts';

type FormInputProps = {
  label: string;
  type?: 'text' | 'email' | 'password' | 'tel';
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
  helperText?: string;
  required?: boolean;
  disabled?: boolean;
  showValidation?: boolean;
};

export function FormInput({
  label,
  type = 'text',
  value,
  onChange,
  error,
  placeholder,
  helperText,
  required = false,
  disabled = false,
  showValidation = false,
}: FormInputProps) {
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
      return 'border-signup-primary-green-400 focus:border-signup-primary-green-400';
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
      {/* Label */}
      <label
        htmlFor={label}
        className={`block text-gray-600 mb-1 ${bodyStyles.m}`}
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {/* Input Field */}
      <div className="relative">
        <input
          id={label}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className={`
            w-full px-3 py-2 
            border rounded-lg
            ${bodyStyles.m}
            text-gray-900
            placeholder:text-gray-400
            focus:outline-none
            transition-colors
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
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-white text-[12px] font-bold">!</span>
            </div>
          </div>
        )}
      </div>

      {/* Error Message */}
      {showValidation && error ? (
        <p
          id={`${label}-error`}
          className="text-red-400 ${bodyStyles.s} mt-1"
          role="alert"
        >
          {error}
        </p>
      ) : (
        helperText && (
          <p
            id={`${label}-helper`}
            className="text-red-400 ${bodyStyles.s} mt-1"
          >
            {helperText}
          </p>
        )
      )}
    </div>
  );
}

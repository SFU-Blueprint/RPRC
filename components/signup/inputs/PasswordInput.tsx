'use client';

import React, { useState, useMemo } from 'react';
import { Check, Eye, EyeOff, X, XCircle, AlertCircle } from 'lucide-react';
import { inter } from '@/app/fonts';

interface PasswordInputProps {
  label: string;
  value: string;
  error?: string;
  helperText?: string;
  showValidation: boolean;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  showRequirements?: boolean;
}

type PasswordRequirement = {
  id: string;
  label: string;
  test: (password: string) => boolean;
};

const PASSWORD_REQUIREMENTS: PasswordRequirement[] = [
  {
    id: 'length',
    label: 'At least 8 characters',
    test: (pwd) => pwd.length >= 8,
  },
  {
    id: 'symbol',
    label: 'At least one symbol (!@#$%^&*)',
    test: (pwd) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd),
  },
];

export function PasswordInput({
  label,
  value,
  error,
  helperText,
  showValidation,
  onChange,
  placeholder = '',
  required = false,
  showRequirements = true,
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  // Calculate which requirements are met
  const requirementStatus = useMemo(() => {
    return PASSWORD_REQUIREMENTS.map((req) => ({
      ...req,
      met: req.test(value),
    }));
  }, [value]);

  const allRequirementsMet = requirementStatus.every((req) => req.met);
  const showRequirementsList = showRequirements && (isFocused || value.length > 0);

  return (
    <div className={`${inter.className}`}>
      {/* Label */}
      <label className="block mb-2 text-sm font-medium text-gray-900">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {/* Input Container */}
      <div className="relative">
        <input
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className={`
            w-full px-4 py-3 pr-12
            border-2 rounded-xl
            text-gray-900 text-base
            focus:outline-none focus:ring-2
            transition-colors
            ${
              showValidation && error
                ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
                : 'border-[#D4D0C5] focus:border-[#5EB42D] focus:ring-green-200'
            }
          `}
        />

        {/* Eye Icon Toggle */}
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className={`absolute top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none transition-colors ${
            showValidation && error ? 'right-10' : 'right-3'
          }`}
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? (
            <EyeOff/>
          ) : (
            <Eye />
          )}
        </button>

        {/* Error Icon */}
        {showValidation && error && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <XCircle className="w-5 h-5 text-red-500" />
          </div>
        )}
      </div>

      {/* Password Requirements List */}
      {showRequirementsList && (
        <div className="mt-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-xs font-semibold text-gray-700 mb-2.5">
            Password requirements:
          </p>
          <ul className="space-y-2">
            {requirementStatus.map((req) => (
              <li
                key={req.id}
                className={`flex items-start gap-2 text-xs transition-colors ${
                  req.met ? 'text-green-600' : 'text-gray-600'
                }`}
              >
                <span className="flex-shrink-0 mt-0.5">
                  {req.met ? (
                    <Check className="w-4 h-4" strokeWidth={2.5} />
                  ) : (
                    <X className="w-4 h-4" strokeWidth={2.5} />
                  )}
                </span>
                <span className={req.met ? 'font-medium' : ''}>{req.label}</span>
              </li>
            ))}
          </ul>
          {allRequirementsMet && value.length > 0 && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              <p className="text-xs font-semibold text-green-600 flex items-center gap-1.5">
                <Check className="w-4 h-4" strokeWidth={2.5} />
                All requirements met!
              </p>
            </div>
          )}
        </div>
      )}

      {/* Helper Text */}
      {helperText && !error && !showRequirementsList && (
        <p className="mt-2 text-sm text-gray-600">{helperText}</p>
      )}

      {/* Error Message */}
      {showValidation && error && (
        <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}

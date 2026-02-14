'use client';

import React, { useState } from 'react';
import { FormInput } from './FormInput';
import { EyeIcon, EyeOffIcon } from 'lucide-react';

interface PasswordInputProps {
  label: string;
  value: string;
  error?: string;
  helperText?: string;
  showValidation: boolean;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
}

export function PasswordInput({
  label,
  value,
  error,
  helperText,
  showValidation,
  onChange,
  placeholder = '',
  required = false,
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      <FormInput
        label={label}
        type={showPassword ? 'text' : 'password'}
        value={value}
        error={error}
        helperText={helperText}
        showValidation={showValidation}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
      />

      {/* Eye Icon Toggle - Positioned to align with input field */}
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className={`absolute text-gray-500 hover:text-gray-700 focus:outline-none transition-colors ${
          showValidation && error ? 'right-10' : 'right-3'
        }`}
        style={{
          top: '50%',
          transform: 'translateY(-50%)',
          marginTop: '12px', // Adjust this value to account for the label height
        }}
        aria-label={showPassword ? 'Hide password' : 'Show password'}
      >
        {showPassword ? (
          <EyeOffIcon className="w-5 h-5" />
        ) : (
          <EyeIcon className="w-5 h-5" />
        )}
      </button>
    </div>
  );
}
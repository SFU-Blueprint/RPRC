'use client';

import { inter, bodyStyles } from '@/app/fonts';

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
  const getBorderColor = () => {
    if (!showValidation) {
      return 'border-gray-300';
    }
    if (error) {
      return 'border-red-500';
    }
    if (value && !error) {
      return 'border-green-500';
    }
    return 'border-gray-300';
  };

  return (
    <div className={`w-full ${inter.className}`}>
      <label className={`block text-gray-700 mb-2 ${bodyStyles.m}`}>
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`
          w-full px-2 py-3 rounded-lg 
          bg-white
          text-gray-900 ${bodyStyles.m}
          border-2
          focus:outline-none focus:ring-2 focus:ring-signup-primary-green-400
          transition-all
          ${getBorderColor()}
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
          className={`text-red-500 ${bodyStyles.s}] mt-1`}
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
}

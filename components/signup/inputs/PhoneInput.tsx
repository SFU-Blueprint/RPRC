'use client';

import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { AlertCircle } from 'lucide-react';

type PhoneInputProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
  showValidation?: boolean;
};

// Format phone number as (xxx)-xxx-xxxx
function formatPhoneNumber(value: string): string {
  // Remove all non-digits
  const digits = value.replace(/\D/g, '');

  // Apply formatting
  if (digits.length === 0) return '';
  if (digits.length <= 3) return `(${digits}`;
  if (digits.length <= 6) return `(${digits.slice(0, 3)})-${digits.slice(3)}`;
  return `(${digits.slice(0, 3)})-${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
}

export function PhoneInput({
  label,
  value,
  onChange,
  error,
  required = false,
  showValidation = false,
}: PhoneInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;

    // Only allow digits, parentheses, hyphens, and spaces
    const cleaned = inputValue.replace(/[^\d()-\s]/g, '');

    // Format the phone number
    const formatted = formatPhoneNumber(cleaned);

    // Update with formatted value
    onChange(formatted);
  };

  return (
    <div className="w-full space-y-2">
      {/* Label */}
      <Label htmlFor={label} className="text-gray-700">
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </Label>

      {/* Phone Input with Country Code */}
      <div className="flex gap-2">
        {/* Country Code Selector */}
        <div className="flex-shrink-0">
          <Input
            value="+1"
            readOnly
            className="w-16 text-center bg-white"
            aria-label="Country code"
          />
        </div>

        {/* Phone Number Input */}
        <div className="relative flex-1">
          <Input
            id={label}
            type="tel"
            value={value}
            onChange={handleChange}
            placeholder="(555)-123-4567"
            className={cn(
              showValidation && error && "border-destructive bg-destructive/5",
              showValidation && value && !error && "border-green-500",
              "bg-white"
            )}
            maxLength={14}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={error ? `${label}-error` : undefined}
          />

          {/* Error Icon */}
          {showValidation && error && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <AlertCircle className="w-5 h-5 text-destructive" />
            </div>
          )}
        </div>
      </div>

      {/* Error Message */}
      {showValidation && error && (
        <p
          id={`${label}-error`}
          className="text-sm text-destructive"
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
}

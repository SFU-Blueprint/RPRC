'use client';

import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { AlertCircle } from 'lucide-react';

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
  return (
    <div className="w-full flex flex-col gap-2">
      {/* Label */}
      <Label htmlFor={label} className="text-gray-700">
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </Label>

      {/* Input Field */}
      <div className="relative">
        <Input
          id={label}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            showValidation && error && "border-destructive bg-destructive/5",
            showValidation && value && !error && "border-green-500"
          )}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={
            error
              ? `${label}-error`
              : helperText
                ? `${label}-helper`
                : undefined
          }
        />

        {/* Error Icon */}
        {showValidation && error && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <AlertCircle className="w-5 h-5 text-destructive" />
          </div>
        )}
      </div>

      {/* Error or Helper Message */}
      {showValidation && error ? (
        <p
          id={`${label}-error`}
          className="text-sm text-destructive"
          role="alert"
        >
          {error}
        </p>
      ) : (
        helperText && (
          <p
            id={`${label}-helper`}
            className="text-sm text-muted-foreground"
          >
            {helperText}
          </p>
        )
      )}
    </div>
  );
}

'use client';

import React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { AlertCircle } from 'lucide-react';
import { robotoCondensed, headerStyles } from '@/app/fonts';

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
  required?: boolean;
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
  required = false
}: FormTextAreaProps) {
  return (
    <div className="w-full flex flex-col gap-2">
      {/* Label - Bold with Roboto Condensed */}
      <Label
        htmlFor={label}
        className={cn("text-gray-900", headerStyles.mResponsive, robotoCondensed.className)}
      >
        {label}
      </Label>

      {/* Textarea Field */}
      <div className="relative">
        <Textarea
          id={label}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={rows}
          disabled={disabled}
          className={cn(
            "rounded-[20px] resize-vertical",
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
          <div className="absolute right-3 top-3">
            <AlertCircle className="w-5 h-5 text-destructive" />
          </div>
        )}
      </div>

      {/* Helper Text or Error Message */}
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

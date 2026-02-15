'use client';

import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

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
  return (
    <div className="w-full space-y-2">
      <Label htmlFor={label} className="text-gray-700">
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </Label>
      
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger
          id={label}
          className={cn(
            "w-full",
            showValidation && error && "border-destructive bg-destructive/5",
            showValidation && value && !error && "border-green-500"
          )}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${label}-error` : undefined}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

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

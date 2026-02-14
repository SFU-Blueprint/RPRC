'use client';

import React, { useState, useMemo } from 'react';
import { Check, Eye, EyeOff, X, XCircle, AlertCircle } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

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
    <div className="flex flex-col gap-2">
      {/* Label */}
      <Label htmlFor={label.toLowerCase().replace(/\s+/g, '-')}>
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </Label>

      {/* Input Container */}
      <div className="relative">
        <Input
          id={label.toLowerCase().replace(/\s+/g, '-')}
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className={cn(
            'pr-12',
            showValidation && error && 'border-destructive aria-invalid:border-destructive'
          )}
          aria-invalid={showValidation && !!error}
        />

        {/* Eye Icon Toggle */}
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className={cn(
            'absolute top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none transition-colors',
            showValidation && error ? 'right-10' : 'right-3'
          )}
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>

        {/* Error Icon */}
        {showValidation && error && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <XCircle className="w-5 h-5 text-destructive" />
          </div>
        )}
      </div>

      {/* Password Requirements List */}
      {showRequirementsList && (
        <div className="mt-3 p-4 bg-muted rounded-lg border border-border">
          <p className="text-xs font-semibold text-muted-foreground mb-2.5">
            Password requirements:
          </p>
          <ul className="space-y-2">
            {requirementStatus.map((req) => (
              <li
                key={req.id}
                className={cn(
                  'flex items-start gap-2 text-xs transition-colors',
                  req.met ? 'text-green-600 dark:text-green-500' : 'text-muted-foreground'
                )}
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
            <div className="mt-3 pt-3 border-t border-border">
              <p className="text-xs font-semibold text-green-600 dark:text-green-500 flex items-center gap-1.5">
                <Check className="w-4 h-4" strokeWidth={2.5} />
                All requirements met!
              </p>
            </div>
          )}
        </div>
      )}

      {/* Helper Text */}
      {helperText && !error && !showRequirementsList && (
        <p className="mt-2 text-sm text-muted-foreground">{helperText}</p>
      )}

      {/* Error Message */}
      {showValidation && error && (
        <p className="mt-2 text-sm text-destructive flex items-center gap-1">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}

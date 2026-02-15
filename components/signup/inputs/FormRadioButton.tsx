'use client';

import React from 'react';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

type RadioButtonProps = {
  label: string;
  value: string;
  checked: boolean;
  onChange: (value: string) => void;
  name: string;
};

export function FormRadioButton({
  label,
  value,
  checked,
  onChange,
  name,
}: RadioButtonProps) {
  return (
    <label className="flex items-center cursor-pointer group space-x-2">
      {/* Custom Radio Button */}
      <div className="relative flex items-center justify-center">
        {/* Hidden native radio */}
        <input
          type="radio"
          name={name}
          value={value}
          checked={checked}
          onChange={() => onChange(value)}
          className="sr-only"
        />

        {/* Custom Radio Circle */}
        <div
          className={cn(
            "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200",
            checked
              ? "bg-primary border-primary"
              : "bg-background border-input group-hover:border-primary/50"
          )}
        >
          {/* Inner white dot when selected */}
          {checked && <div className="w-2.5 h-2.5 bg-primary-foreground rounded-full" />}
        </div>
      </div>

      {/* Label Text */}
      <Label className="text-foreground select-none cursor-pointer font-normal">
        {label}
      </Label>
    </label>
  );
}

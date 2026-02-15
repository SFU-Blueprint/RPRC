'use client';

import React from 'react';
import { inter, bodyStyles } from '@/app/fonts';
import { Plus, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

type InterestCardProps = {
  label: string;
  isSelected: boolean;
  onToggle: () => void;
};

export function InterestCard({
  label,
  isSelected,
  onToggle,
}: InterestCardProps) {
  return (
    <Button
      type="button"
      variant="outline"
      onClick={onToggle}
      className={cn(
        "w-full px-4 py-2 h-auto",
        "border-1 border-gray-600",
        "rounded-full",
        "flex items-center justify-center gap-3",
        "hover:border-primary",
        isSelected ? "bg-signup-neutral-200" : "bg-signup-off-white",
      )}
      aria-pressed={isSelected}
      aria-label={`${isSelected ? 'Deselect' : 'Select'} ${label}`}
    >
      {/* Icon - Plus or X */}
      {isSelected ? (
        <X className="w-7 h-7 text-primary" strokeWidth={2.5} />
      ) : (
        <Plus className="w-7 h-7 text-primary" strokeWidth={2.5} />
      )}

      {/* Label */}
      <span className={cn("text-gray-800 font-medium", bodyStyles.lg)}>
        {label}
      </span>
    </Button>
  );
}

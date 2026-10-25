'use client';

import { Controller, type FieldValues } from 'react-hook-form';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { getDescribedBy, getFieldIds } from '@/lib/utils/field-utils';
import type { BaseFieldProps, FieldOption } from '@/types/sign-up-fields.types';

import { FormFieldShell } from './FormFieldShell';

type SelectFieldProps<T extends FieldValues, TTransformed> = BaseFieldProps<
  T,
  TTransformed
> & {
  options: readonly FieldOption[];
  placeholder?: string;
  /** Extra hook for dependent fields, e.g. clearing province on country change. */
  onValueChange?: (value: string) => void;
};

export function SelectField<T extends FieldValues, TTransformed = T>({
  control,
  name,
  label,
  description,
  required,
  className,
  options,
  placeholder = 'Select an option',
  onValueChange,
}: SelectFieldProps<T, TTransformed>) {
  const ids = getFieldIds(name);

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormFieldShell
          ids={ids}
          label={label}
          description={description}
          required={required}
          error={fieldState.error}
          className={className}
        >
          <Select
            name={field.name}
            value={field.value ?? ''}
            onValueChange={(value) => {
              field.onChange(value);
              onValueChange?.(value);
            }}
            disabled={field.disabled || options.length === 0}
          >
            <SelectTrigger
              id={ids.control}
              ref={field.ref}
              onBlur={field.onBlur}
              className="h-9 bg-white aria-invalid:border-destructive"
              aria-required={required}
              aria-invalid={fieldState.invalid}
              aria-describedby={getDescribedBy(
                !!description && ids.description,
                fieldState.invalid && ids.error,
              )}
            >
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormFieldShell>
      )}
    />
  );
}

'use client';

import type { ComponentProps } from 'react';
import { Controller, type FieldValues } from 'react-hook-form';

import { Input } from '@/components/ui/input';
import {
  getDescribedBy,
  getFieldIds,
  toOptionalString,
} from '@/lib/utils/field-utils';
import type { BaseFieldProps } from '@/types/sign-up-fields.types';

import { FormFieldShell } from './FormFieldShell';

type TextFieldProps<T extends FieldValues, TTransformed> = BaseFieldProps<
  T,
  TTransformed
> & {
  type?: 'text' | 'email' | 'url';
  /** Extra native attributes such as `autoComplete` or `placeholder`. */
  inputProps?: Omit<
    ComponentProps<'input'>,
    'id' | 'name' | 'type' | 'value' | 'onChange' | 'onBlur' | 'ref'
  >;
};

export function TextField<T extends FieldValues, TTransformed = T>({
  control,
  name,
  label,
  description,
  required,
  className,
  type = 'text',
  inputProps,
}: TextFieldProps<T, TTransformed>) {
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
          <Input
            {...inputProps}
            id={ids.control}
            name={field.name}
            type={type}
            ref={field.ref}
            value={field.value ?? ''}
            onChange={(event) =>
              field.onChange(toOptionalString(event.target.value))
            }
            onBlur={field.onBlur}
            disabled={field.disabled || inputProps?.disabled}
            aria-required={required}
            aria-invalid={fieldState.invalid}
            aria-describedby={getDescribedBy(
              !!description && ids.description,
              fieldState.invalid && ids.error,
            )}
          />
        </FormFieldShell>
      )}
    />
  );
}

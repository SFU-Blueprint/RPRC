'use client';

import { Controller, type FieldValues } from 'react-hook-form';

import { Textarea } from '@/components/ui/textarea';
import { countWords } from '@/lib/schema';
import { cn } from '@/lib/utils';
import {
  getDescribedBy,
  getFieldIds,
  toOptionalString,
} from '@/lib/utils/field-utils';
import type { BaseFieldProps } from '@/types/sign-up-fields.types';

import { FormFieldShell } from './FormFieldShell';

type TextareaFieldProps<T extends FieldValues, TTransformed> = BaseFieldProps<
  T,
  TTransformed
> & {
  rows?: number;
  /** Shows a live word count against the schema's word limit. */
  maxWords?: number;
};

export function TextareaField<T extends FieldValues, TTransformed = T>({
  control,
  name,
  label,
  description,
  required,
  className,
  rows = 5,
  maxWords,
}: TextareaFieldProps<T, TTransformed>) {
  const ids = getFieldIds(name);
  const counterId = `${ids.control}-word-count`;

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const value: string = field.value ?? '';
        const wordCount = countWords(value);
        const isOverLimit = maxWords !== undefined && wordCount > maxWords;

        return (
          <FormFieldShell
            ids={ids}
            label={label}
            description={description}
            required={required}
            error={fieldState.error}
            className={className}
          >
            <Textarea
              id={ids.control}
              name={field.name}
              rows={rows}
              ref={field.ref}
              value={value}
              onChange={(event) =>
                field.onChange(toOptionalString(event.target.value))
              }
              onBlur={field.onBlur}
              disabled={field.disabled}
              className="resize-y bg-white aria-invalid:border-destructive"
              aria-required={required}
              aria-invalid={fieldState.invalid}
              aria-describedby={getDescribedBy(
                maxWords !== undefined && counterId,
                !!description && ids.description,
                fieldState.invalid && ids.error,
              )}
            />
            {maxWords !== undefined && (
              <p
                id={counterId}
                className={cn(
                  'text-right text-sm',
                  isOverLimit ? 'text-destructive' : 'text-muted-foreground',
                )}
              >
                {wordCount} / {maxWords} words
              </p>
            )}
          </FormFieldShell>
        );
      }}
    />
  );
}

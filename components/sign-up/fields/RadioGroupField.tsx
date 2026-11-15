'use client';

import { Controller, type FieldValues } from 'react-hook-form';

import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from '@/components/ui/field';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { cn } from '@/lib/utils';
import {
  getDescribedBy,
  getFieldIds,
  getOptionId,
} from '@/lib/utils/field-utils';
import type { BaseFieldProps, FieldOption } from '@/types/sign-up-fields.types';

import { RequiredMarker } from './FormFieldShell';

type RadioGroupFieldProps<T extends FieldValues, TTransformed> = BaseFieldProps<
  T,
  TTransformed
> & {
  options: readonly FieldOption[];
  orientation?: 'horizontal' | 'vertical';
};

export function RadioGroupField<T extends FieldValues, TTransformed = T>({
  control,
  name,
  label,
  description,
  required,
  className,
  options,
  orientation = 'horizontal',
}: RadioGroupFieldProps<T, TTransformed>) {
  const ids = getFieldIds(name);

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FieldSet data-invalid={fieldState.invalid} className={className}>
          <FieldLegend variant="label" className="flex gap-2">
            {label}
            {required && <RequiredMarker />}
          </FieldLegend>
          {description && (
            <FieldDescription id={ids.description}>
              {description}
            </FieldDescription>
          )}
          <RadioGroup
            data-slot="radio-group"
            ref={field.ref}
            name={field.name}
            value={field.value ?? ''}
            onValueChange={field.onChange}
            onBlur={field.onBlur}
            disabled={field.disabled}
            orientation={orientation}
            className={cn(
              orientation === 'horizontal' && 'flex flex-wrap gap-6',
            )}
            aria-required={required}
            aria-invalid={fieldState.invalid}
            aria-describedby={getDescribedBy(
              !!description && ids.description,
              fieldState.invalid && ids.error,
            )}
          >
            {options.map((option) => {
              const optionId = getOptionId(ids, option.value);

              return (
                <Field
                  key={option.value}
                  orientation="horizontal"
                  data-invalid={fieldState.invalid}
                  className="w-auto"
                >
                  <RadioGroupItem
                    id={optionId}
                    value={option.value}
                    aria-invalid={fieldState.invalid}
                  />
                  <FieldLabel htmlFor={optionId} className="font-normal">
                    {option.label}
                  </FieldLabel>
                </Field>
              );
            })}
          </RadioGroup>
          <FieldError id={ids.error} errors={[fieldState.error]} />
        </FieldSet>
      )}
    />
  );
}

'use client';

import { Controller, type FieldValues } from 'react-hook-form';

import { Checkbox } from '@/components/ui/checkbox';
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from '@/components/ui/field';
import { getDescribedBy, getFieldIds } from '@/lib/utils/field-utils';
import type { BaseFieldProps } from '@/types/sign-up-fields.types';

import { RequiredMarker } from './FormFieldShell';

type CheckboxFieldProps<T extends FieldValues, TTransformed> = BaseFieldProps<
  T,
  TTransformed
> & {
  /** Extra hook for dependent fields, e.g. clearing a reason when unticked. */
  onValueChange?: (checked: boolean) => void;
};

/** A single checkbox bound to a `boolean` value. */
export function CheckboxField<T extends FieldValues, TTransformed = T>({
  control,
  name,
  label,
  description,
  required,
  className,
  onValueChange,
}: CheckboxFieldProps<T, TTransformed>) {
  const ids = getFieldIds(name);

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Field
          orientation="horizontal"
          data-invalid={fieldState.invalid}
          className={className}
        >
          <Checkbox
            id={ids.control}
            name={field.name}
            ref={field.ref}
            checked={field.value === true}
            onCheckedChange={(checked) => {
              field.onChange(checked === true);
              onValueChange?.(checked === true);
            }}
            onBlur={field.onBlur}
            disabled={field.disabled}
            aria-required={required}
            aria-invalid={fieldState.invalid}
            aria-describedby={getDescribedBy(
              !!description && ids.description,
              fieldState.invalid && ids.error,
            )}
          />
          <FieldContent>
            <FieldLabel htmlFor={ids.control} className="font-normal">
              {label}
              {required && <RequiredMarker />}
            </FieldLabel>
            {description && (
              <FieldDescription id={ids.description}>
                {description}
              </FieldDescription>
            )}
            <FieldError id={ids.error} errors={[fieldState.error]} />
          </FieldContent>
        </Field>
      )}
    />
  );
}

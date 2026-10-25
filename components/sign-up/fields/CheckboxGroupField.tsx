'use client';

import { Controller, type FieldValues } from 'react-hook-form';

import { Checkbox } from '@/components/ui/checkbox';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from '@/components/ui/field';
import {
  getDescribedBy,
  getFieldIds,
  getOptionId,
} from '@/lib/utils/field-utils';
import type { BaseFieldProps, FieldOption } from '@/types/sign-up-fields.types';

import { RequiredMarker } from './FormFieldShell';

type CheckboxGroupFieldProps<
  T extends FieldValues,
  TTransformed,
> = BaseFieldProps<T, TTransformed> & {
  options: readonly FieldOption[];
  /** Layout of the option list, e.g. a responsive grid. */
  optionsClassName?: string;
};

/** A list of checkboxes bound to a `string[]` value. */
export function CheckboxGroupField<T extends FieldValues, TTransformed = T>({
  control,
  name,
  label,
  description,
  required,
  className,
  options,
  optionsClassName,
}: CheckboxGroupFieldProps<T, TTransformed>) {
  const ids = getFieldIds(name);

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const selected: string[] = field.value ?? [];

        const toggle = (value: string, checked: boolean) => {
          const next = checked
            ? [...selected, value]
            : selected.filter((item) => item !== value);
          // Keep the stored order stable and matching the option order.
          field.onChange(
            options
              .map((option) => option.value)
              .filter((optionValue) => next.includes(optionValue)),
          );
        };

        return (
          <FieldSet
            data-invalid={fieldState.invalid}
            className={className}
            aria-describedby={getDescribedBy(
              !!description && ids.description,
              fieldState.invalid && ids.error,
            )}
          >
            <FieldLegend variant="label" className="flex gap-2">
              {label}
              {required && <RequiredMarker />}
            </FieldLegend>
            {description && (
              <FieldDescription id={ids.description}>
                {description}
              </FieldDescription>
            )}
            <FieldGroup data-slot="checkbox-group" className={optionsClassName}>
              {options.map((option, index) => {
                const optionId = getOptionId(ids, option.value);

                return (
                  <Field
                    key={option.value}
                    orientation="horizontal"
                    data-invalid={fieldState.invalid}
                  >
                    <Checkbox
                      id={optionId}
                      name={field.name}
                      value={option.value}
                      ref={index === 0 ? field.ref : undefined}
                      checked={selected.includes(option.value)}
                      onCheckedChange={(checked) =>
                        toggle(option.value, checked === true)
                      }
                      onBlur={field.onBlur}
                      disabled={field.disabled}
                      aria-invalid={fieldState.invalid}
                    />
                    <FieldLabel htmlFor={optionId} className="font-normal">
                      {option.label}
                    </FieldLabel>
                  </Field>
                );
              })}
            </FieldGroup>
            <FieldError id={ids.error} errors={[fieldState.error]} />
          </FieldSet>
        );
      }}
    />
  );
}

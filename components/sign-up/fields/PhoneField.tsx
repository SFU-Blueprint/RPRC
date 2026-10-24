'use client';

import { Controller, type FieldValues } from 'react-hook-form';

import { Input } from '@/components/ui/input';
import { getDescribedBy, getFieldIds } from '@/lib/utils/field-utils';
import type { BaseFieldProps } from '@/types/sign-up-fields.types';

import { FormFieldShell } from './FormFieldShell';

/** North American numbers: +1 followed by a 10 digit national number. */
const COUNTRY_CODE = '+1';
const NATIONAL_NUMBER_LENGTH = 10;

/** Pulls the national digits out of whatever was typed or pasted. */
function toNationalDigits(input: string): string {
  let digits = input.replace(/\D/g, '');

  // A pasted "+1 604 123 4567" or "16041234567" carries the country code.
  if (digits.length > NATIONAL_NUMBER_LENGTH && digits.startsWith('1')) {
    digits = digits.slice(1);
  }

  return digits.slice(0, NATIONAL_NUMBER_LENGTH);
}

/** Display format: (604) 123-4567, built up as the user types. */
function formatNational(digits: string): string {
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

/** Stored format: E.164, as `phoneNumberSchema` expects (+16041234567). */
function toE164(digits: string): string | undefined {
  return digits ? `${COUNTRY_CODE}${digits}` : undefined;
}

function fromE164(value: string | undefined): string {
  if (!value) return '';
  const national = value.startsWith(COUNTRY_CODE)
    ? value.slice(COUNTRY_CODE.length)
    : value;
  return formatNational(toNationalDigits(national));
}

export function PhoneField<T extends FieldValues, TTransformed = T>({
  control,
  name,
  label,
  description,
  required,
  className,
}: BaseFieldProps<T, TTransformed>) {
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
          <div className="flex items-center gap-2">
            <span
              aria-hidden="true"
              className="flex h-9 shrink-0 items-center rounded-md border border-input bg-white px-3 text-sm text-muted-foreground"
            >
              {COUNTRY_CODE}
            </span>
            <Input
              id={ids.control}
              name={field.name}
              type="tel"
              inputMode="tel"
              autoComplete="tel-national"
              placeholder="(604) 123-4567"
              ref={field.ref}
              value={fromE164(field.value)}
              onChange={(event) =>
                field.onChange(toE164(toNationalDigits(event.target.value)))
              }
              onBlur={field.onBlur}
              disabled={field.disabled}
              aria-required={required}
              aria-invalid={fieldState.invalid}
              aria-describedby={getDescribedBy(
                !!description && ids.description,
                fieldState.invalid && ids.error,
              )}
            />
          </div>
        </FormFieldShell>
      )}
    />
  );
}

'use client';

import { useState } from 'react';
import { Check, Eye, EyeOff, X } from 'lucide-react';
import { Controller, type FieldValues } from 'react-hook-form';

import { Input } from '@/components/ui/input';
import { passwordSchema } from '@/lib/schema';
import { cn } from '@/lib/utils';
import { getDescribedBy, getFieldIds } from '@/lib/utils/field-utils';
import type { BaseFieldProps } from '@/types/sign-up-fields.types';

import { FormFieldShell } from './FormFieldShell';

/**
 * Every rule in `passwordSchema`, read from the schema itself: an empty value
 * fails all of them, so the list can never drift from what is enforced.
 */
const PASSWORD_RULES =
  passwordSchema.safeParse('').error?.issues.map((issue) => issue.message) ??
  [];

function getUnmetRules(value: string): Set<string> {
  const result = passwordSchema.safeParse(value);
  return new Set(result.error?.issues.map((issue) => issue.message) ?? []);
}

type PasswordFieldProps<T extends FieldValues, TTransformed> = BaseFieldProps<
  T,
  TTransformed
> & {
  autoComplete?: 'new-password' | 'current-password';
  /** Lists the schema's password rules and ticks off the ones that pass. */
  showRules?: boolean;
};

export function PasswordField<T extends FieldValues, TTransformed = T>({
  control,
  name,
  label,
  description,
  required,
  className,
  autoComplete = 'new-password',
  showRules = false,
}: PasswordFieldProps<T, TTransformed>) {
  const [isVisible, setIsVisible] = useState(false);
  const ids = getFieldIds(name);
  const rulesId = `${ids.control}-rules`;

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const value: string = field.value ?? '';
        const unmetRules = getUnmetRules(value);

        return (
          <FormFieldShell
            ids={ids}
            label={label}
            description={description}
            required={required}
            error={fieldState.error}
            className={className}
          >
            <div className="relative">
              <Input
                id={ids.control}
                name={field.name}
                type={isVisible ? 'text' : 'password'}
                autoComplete={autoComplete}
                ref={field.ref}
                value={value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                disabled={field.disabled}
                className="pr-10"
                aria-required={required}
                aria-invalid={fieldState.invalid}
                aria-describedby={getDescribedBy(
                  showRules && rulesId,
                  !!description && ids.description,
                  fieldState.invalid && ids.error,
                )}
              />
              <button
                type="button"
                onClick={() => setIsVisible((visible) => !visible)}
                disabled={field.disabled}
                className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground disabled:pointer-events-none"
                aria-label={isVisible ? 'Hide password' : 'Show password'}
                aria-controls={ids.control}
              >
                {isVisible ? (
                  <EyeOff className="size-4" aria-hidden="true" />
                ) : (
                  <Eye className="size-4" aria-hidden="true" />
                )}
              </button>
            </div>

            {showRules && (
              <ul id={rulesId} className="flex flex-col gap-1 text-sm">
                {PASSWORD_RULES.map((rule) => {
                  const isMet = value.length > 0 && !unmetRules.has(rule);
                  const Icon = isMet ? Check : X;

                  return (
                    <li
                      key={rule}
                      className={cn(
                        'flex items-center gap-2',
                        isMet
                          ? 'text-signup-primary-green-600'
                          : 'text-muted-foreground',
                      )}
                    >
                      <Icon className="size-4 shrink-0" aria-hidden="true" />
                      <span>
                        {rule}
                        <span className="sr-only">
                          {isMet ? ' (met)' : ' (not met)'}
                        </span>
                      </span>
                    </li>
                  );
                })}
              </ul>
            )}
          </FormFieldShell>
        );
      }}
    />
  );
}

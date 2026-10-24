'use client';

import type { ReactNode } from 'react';
import type { FieldError as RHFFieldError } from 'react-hook-form';

import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from '@/components/ui/field';
import type { FieldIds } from '@/types/sign-up-fields.types';

export function RequiredMarker() {
  return (
    <span aria-hidden="true" className="text-destructive">
      *
    </span>
  );
}

type FormFieldShellProps = {
  ids: FieldIds;
  label: string;
  description?: ReactNode;
  required?: boolean;
  error?: RHFFieldError;
  className?: string;
  /** The control itself, rendered between the label and the description. */
  children: ReactNode;
};

/**
 * Layout shared by single-control fields: label, control, description, error.
 * Follows the shadcn React Hook Form guide (`Field` + `FieldLabel` +
 * `FieldError`), with the description and error ids wired for
 * `aria-describedby`.
 */
export function FormFieldShell({
  ids,
  label,
  description,
  required,
  error,
  className,
  children,
}: FormFieldShellProps) {
  return (
    <Field data-invalid={!!error} className={className}>
      <FieldLabel htmlFor={ids.control}>
        {label}
        {required && <RequiredMarker />}
      </FieldLabel>
      {children}
      {description && (
        <FieldDescription id={ids.description}>{description}</FieldDescription>
      )}
      <FieldError id={ids.error} errors={[error]} />
    </Field>
  );
}

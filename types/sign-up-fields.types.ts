import type { ReactNode } from 'react';
import type { Control, FieldPath, FieldValues } from 'react-hook-form';

/**
 * Props shared by every schema-driven field component.
 *
 * `T` is the form's input type (`z.input<typeof schema>`) and `TTransformed`
 * is the parsed output type (`z.output<typeof schema>`), so the components
 * accept the `control` returned by `useForm` with `zodResolver` as is.
 */
export type BaseFieldProps<T extends FieldValues, TTransformed = T> = {
  control: Control<T, unknown, TTransformed>;
  name: FieldPath<T>;
  label: string;
  description?: ReactNode;
  /** Shows the required marker. Validation itself always comes from the schema. */
  required?: boolean;
  className?: string;
};

/** A selectable option for select, radio and checkbox group fields. */
export type FieldOption<TValue extends string = string> = {
  value: TValue;
  label: string;
};

/** DOM ids that link a field's label, description and error to its control. */
export type FieldIds = {
  control: string;
  description: string;
  error: string;
};

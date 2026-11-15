import { z } from 'zod';

import { passwordSchema } from './password.schema';
import { emailSchema } from './shared.schema';

/**
 * Account fields for sign-up. Kept as an unrefined object so the sign-up
 * schemas can `.extend()` an application object with its shape: zod 4 throws
 * on `.omit()` / `.pick()` / `.merge()` once a schema has refinements, so the
 * password check is added only on the final schemas (`withPasswordsMatch`).
 */
export const accountObject = z.object({
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string({ error: 'Please confirm your password' }),
});

const passwordFields = accountObject.pick({
  password: true,
  confirmPassword: true,
});

/**
 * Adds the "Passwords do not match" check. `when` runs it as soon as both
 * password fields are valid, instead of only once the whole form is valid
 * (zod 4 skips object-level refinements while any field has an error).
 */
export function withPasswordsMatch<
  T extends z.ZodType<{ password: string; confirmPassword: string }>,
>(schema: T) {
  return schema.refine((data) => data.password === data.confirmPassword, {
    error: 'Passwords do not match',
    path: ['confirmPassword'],
    when: (payload) => passwordFields.safeParse(payload.value).success,
  });
}

export const accountSchema = withPasswordsMatch(accountObject);

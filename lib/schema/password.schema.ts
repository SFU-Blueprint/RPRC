import { z } from 'zod';

/**
 * Password rules.
 *
 * 15 character minimum follows the OWASP Authentication Cheat Sheet
 * recommendation for applications without MFA.
 *
 * 72 character maximum exists because Supabase Auth hashes with bcrypt, which
 * silently truncates anything past 72 bytes.
 */
export const PASSWORD_MIN_LENGTH = 15;
export const PASSWORD_MAX_LENGTH = 72;

const UPPERCASE_REGEX = /[A-Z]/;
const LOWERCASE_REGEX = /[a-z]/;
const NUMERIC_REGEX = /[0-9]/;
const SPECIAL_CHARACTER_REGEX = /[^A-Za-z0-9]/;

export const passwordSchema = z
  .string({ error: 'Password is required' })
  .min(PASSWORD_MIN_LENGTH, {
    error: `Password must be at least ${PASSWORD_MIN_LENGTH} characters`,
  })
  .max(PASSWORD_MAX_LENGTH, {
    error: `Password must be at most ${PASSWORD_MAX_LENGTH} characters`,
  })
  .regex(UPPERCASE_REGEX, {
    error: 'Password must contain at least one uppercase letter',
  })
  .regex(LOWERCASE_REGEX, {
    error: 'Password must contain at least one lowercase letter',
  })
  .regex(NUMERIC_REGEX, {
    error: 'Password must contain at least one number',
  })
  .regex(SPECIAL_CHARACTER_REGEX, {
    error: 'Password must contain at least one special character',
  });

export type Password = z.infer<typeof passwordSchema>;

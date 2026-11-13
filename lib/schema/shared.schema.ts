import { z } from 'zod';

/**
 * Pieces shared by both the individual and the organization application, kept
 * here so the two application schemas cannot drift apart.
 */

/**
 * Letters (including accented ones), spaces, hyphens, apostrophes and periods,
 * so names like "Mary-Jane O'Connor", "Renée Lévesque" and "J. R. Smith" are
 * accepted.
 */
const PERSON_NAME_REGEX = /^[\p{L}][\p{L}\s.'-]*$/u;

/**
 * Organization names are far looser than person names: they carry digits,
 * ampersands, periods, commas and brackets, as in "Richmond Food Bank Society
 * (est. 1983)" or "A & W Canada".
 */
const ORGANIZATION_NAME_REGEX = /^[\p{L}\p{N}][\p{L}\p{N}\s.,&'()/-]*$/u;

/** 10 digit North American number, the same rule as `validatePhone`. */
const PHONE_NUMBER_REGEX = /^\d{10}$/;

/**
 * The digits of a phone number, without a leading country code `1`, so an
 * already stored `+1 (604)-123-4567` reads back as `6041234567`.
 */
export function toPhoneDigits(value: string): string {
  const digits = value.replace(/\D/g, '');
  return digits.length === 11 && digits.startsWith('1')
    ? digits.slice(1)
    : digits;
}

/**
 * The format phone numbers are stored in: `+1 (604)-123-4567`, the same as the
 * existing signup (`PhoneInput` plus `formatPhoneWithAreaCode`). Expects the
 * 10 digits from `toPhoneDigits`.
 */
export function formatStoredPhone(digits: string): string {
  return `+1 (${digits.slice(0, 3)})-${digits.slice(3, 6)}-${digits.slice(6)}`;
}

export const emailSchema = z
  .email({ error: 'Enter a valid email address' })
  .trim()
  .toLowerCase();

export const nameSchema = z
  .string({ error: 'Name is required' })
  .trim()
  .min(1, { error: 'Name is required' })
  .max(100, { error: 'Name must be at most 100 characters' })
  .regex(PERSON_NAME_REGEX, {
    error:
      'Name can only contain letters, spaces, hyphens, apostrophes and periods',
  });

export const organizationNameSchema = z
  .string({ error: 'Organization name is required' })
  .trim()
  .min(1, { error: 'Organization name is required' })
  .max(200, { error: 'Organization name must be at most 200 characters' })
  .regex(ORGANIZATION_NAME_REGEX, {
    error: 'Enter a valid organization name',
  });

/**
 * Accepts any formatting (spaces, brackets, hyphens, a leading `+1`) and
 * requires exactly 10 digits, like `validatePhone`. Outputs the stored format,
 * `+1 (604)-123-4567`, so callers can pass the parsed value straight to the DB.
 */
export const phoneNumberSchema = z
  .string({ error: 'Phone number is required' })
  .transform(toPhoneDigits)
  .refine((digits) => PHONE_NUMBER_REGEX.test(digits), {
    error: 'Phone number must be 10 digits',
  })
  .transform(formatStoredPhone);

/** Lowercase to match the `phone_type` enum in the database. */
export const PHONE_TYPES = ['home', 'cell'] as const;

export const phoneTypeSchema = z.enum(PHONE_TYPES, {
  error: 'Select either Home or Cell',
});

export type PhoneType = z.infer<typeof phoneTypeSchema>;

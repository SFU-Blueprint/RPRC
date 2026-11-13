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

/** 10 digit North American number, matching what `PhoneInput` stores. */
const PHONE_NUMBER_REGEX = /^\d{10}$/;

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
 * Stored and submitted as 10 digits with no country code, matching
 * `validatePhone` and the existing rows. Any formatting the user types
 * (spaces, brackets, hyphens) is stripped before validating.
 */
export const phoneNumberSchema = z
  .string({ error: 'Phone number is required' })
  .transform((value) => value.replace(/\D/g, ''))
  .refine((value) => PHONE_NUMBER_REGEX.test(value), {
    error: 'Enter a valid 10 digit phone number (e.g. 6041234567)',
  });

/** Lowercase to match the `phone_type` enum in the database. */
export const PHONE_TYPES = ['home', 'cell'] as const;

export const phoneTypeSchema = z.enum(PHONE_TYPES, {
  error: 'Select either Home or Cell',
});

export type PhoneType = z.infer<typeof phoneTypeSchema>;

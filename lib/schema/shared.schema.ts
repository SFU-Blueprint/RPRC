import { z } from 'zod';

/**
 * Pieces shared by both the individual and the organization application, kept
 * here so the two application schemas cannot drift apart.
 */

/**
 * Letters (including accented ones), spaces, hyphens and apostrophes, so names
 * like "Mary-Jane O'Connor" and "Renée Lévesque" are accepted.
 */
const PERSON_NAME_REGEX = /^[\p{L}][\p{L}\s'-]*$/u;

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
    error: 'Name can only contain letters, spaces, hyphens and apostrophes',
  });

export const phoneNumberSchema = z.e164({
  error: 'Enter a valid phone number in international format (+16041234567)',
});

export const PHONE_TYPES = ['Home', 'Cell'] as const;

export const phoneTypeSchema = z.enum(PHONE_TYPES, {
  error: 'Select either Home or Cell',
});

export type PhoneType = z.infer<typeof phoneTypeSchema>;

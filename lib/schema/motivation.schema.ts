import { z } from 'zod';

export const MOTIVATION_MAX_WORDS = 200;

/** Words are whitespace separated runs of characters. */
export function countWords(value: string): number {
  return value.trim().split(/\s+/).filter(Boolean).length;
}

/**
 * Builds a required free text schema capped at a number of words.
 * Reused by `motivation`, `waiverReason` and `programsOrServices`.
 */
export function wordLimitedStringSchema(
  label: string,
  maxWords: number = MOTIVATION_MAX_WORDS,
) {
  return z
    .string({ error: `${label} is required` })
    .trim()
    .min(1, { error: `${label} is required` })
    .refine((value) => countWords(value) <= maxWords, {
      error: `${label} must be at most ${maxWords} words`,
    });
}

export const motivationSchema = wordLimitedStringSchema(
  'Reason for joining',
  MOTIVATION_MAX_WORDS,
);

export type Motivation = z.infer<typeof motivationSchema>;

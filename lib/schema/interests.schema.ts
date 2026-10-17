import { z } from 'zod';

export const MEMBERSHIP_INTERESTS = [
  'Health',
  'Education',
  'Environment',
  'Arts+Culture',
  'Housing',
  'Other',
] as const;

export const interestSchema = z.enum(MEMBERSHIP_INTERESTS, {
  error: 'Please choose a membership interest from the list',
});

export const interestsSchema = z.array(interestSchema, {
  error: 'Membership interests must be a list of options',
});

export type Interest = z.infer<typeof interestSchema>;
export type Interests = z.infer<typeof interestsSchema>;

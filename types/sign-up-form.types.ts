import type { z } from 'zod';

import type { individualSchema, organizationSchema } from '@/lib/schema';

/**
 * Form value types derived from the zod schemas, which are the single source
 * of truth. `Input` is what the form holds while editing; `Values` is what
 * the schema returns after a successful parse (trimmed, lowercased, ...).
 */
export type IndividualSignUpInput = z.input<typeof individualSchema>;
export type IndividualSignUpValues = z.output<typeof individualSchema>;

export type OrganizationSignUpInput = z.input<typeof organizationSchema>;
export type OrganizationSignUpValues = z.output<typeof organizationSchema>;

type SharedSignUpKey = Extract<
  keyof IndividualSignUpInput,
  keyof OrganizationSignUpInput
>;

/** Fields both applications have; shared sections are typed against these. */
export type SharedSignUpInput = Pick<IndividualSignUpInput, SharedSignUpKey>;

/** Countries the address section offers (see `ALLOWED_COUNTRIES`). */
export type AllowedCountry = 'Canada' | 'United States';

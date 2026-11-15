import type { z } from 'zod';

import type { ALLOWED_COUNTRIES } from '@/lib/constants/sign-up';
import type {
  individualApplicationSchema,
  individualSchema,
  organizationApplicationSchema,
  organizationSchema,
} from '@/lib/schema';

/**
 * Form value types derived from the zod schemas, which are the single source
 * of truth. `Input` is what the form holds while editing; `Values` is what
 * the schema returns after a successful parse (trimmed, lowercased, ...).
 */
export type IndividualSignUpInput = z.input<typeof individualSchema>;
export type IndividualSignUpValues = z.output<typeof individualSchema>;

export type OrganizationSignUpInput = z.input<typeof organizationSchema>;
export type OrganizationSignUpValues = z.output<typeof organizationSchema>;

/** The application fields only (no account fields). */
export type IndividualApplicationValues = z.output<
  typeof individualApplicationSchema
>;
export type OrganizationApplicationValues = z.output<
  typeof organizationApplicationSchema
>;

type SharedSignUpKey = Extract<
  keyof IndividualSignUpInput,
  keyof OrganizationSignUpInput
>;

/** Fields both applications have; shared sections are typed against these. */
export type SharedSignUpInput = Pick<IndividualSignUpInput, SharedSignUpKey>;

/**
 * Logged out: the full form (account + application). Logged in without an
 * application: the application only, e.g. after the application step failed.
 */
export type SignUpFormMode = 'sign-up' | 'application-only';

/** What the sign-up and application-only actions return. */
export type SubmitResult =
  | { ok: true }
  | {
      ok: false;
      /** Nothing was created. */
      stage: 'account';
      reason: 'invalid' | 'email_exists' | 'duplicate_org_phone' | 'failed';
    }
  | {
      ok: false;
      /** The account exists (and the user is signed in); the application wasn't created. */
      stage: 'application';
      reason:
        | 'invalid'
        | 'not_signed_in'
        | 'already_has_application'
        | 'duplicate_org_phone'
        | 'failed';
    };

export type SubmitFailure = Exclude<SubmitResult, { ok: true }>;
export type AccountFailure = Extract<SubmitResult, { stage: 'account' }>;
export type ApplicationFailure = Extract<
  SubmitResult,
  { stage: 'application' }
>;

/** Countries the address section offers (see `ALLOWED_COUNTRIES`). */
export type AllowedCountry = (typeof ALLOWED_COUNTRIES)[number];

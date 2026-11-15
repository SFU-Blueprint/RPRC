import { z } from 'zod';

import { accountObject, withPasswordsMatch } from './account.schema';
import { addressSchema } from './address.schema';
import { interestsSchema } from './interests.schema';
import { motivationSchema, wordLimitedStringSchema } from './motivation.schema';
import { optionalProfileEmailSchema } from './profile-edit.shared.schema';
import {
  nameSchema,
  organizationNameSchema,
  phoneNumberSchema,
  phoneTypeSchema,
} from './shared.schema';

/**
 * The organization application without account fields (application-only
 * mode). The account email is the organization's email (`users.email`).
 */
export const organizationApplicationSchema = z.object({
  /** Maps to `p_org_name`. Required, since `org_name` is NOT NULL. */
  organizationName: organizationNameSchema,
  /** The organization representative's name. Maps to `p_org_rep_name`. */
  name: nameSchema,
  /**
   * Only if different from the organization email. Maps to `p_org_rep_email`.
   * A blank input becomes undefined, as in profile edit.
   */
  representativeEmail: optionalProfileEmailSchema,
  phoneNumber: phoneNumberSchema,
  phoneType: phoneTypeSchema,
  address: addressSchema,
  membershipInterests: interestsSchema,
  motivation: motivationSchema,
  programsOrServices: wordLimitedStringSchema(
    'Programs or services',
  ).optional(),
});

/** Sign-up: account + organization application. */
export const organizationSchema = withPasswordsMatch(
  organizationApplicationSchema.extend(accountObject.shape),
);

export type OrganizationApplication = z.infer<typeof organizationSchema>;

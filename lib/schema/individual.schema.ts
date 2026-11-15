import { z } from 'zod';

import { accountObject, withPasswordsMatch } from './account.schema';
import { addressSchema } from './address.schema';
import { interestsSchema } from './interests.schema';
import { motivationSchema, wordLimitedStringSchema } from './motivation.schema';
import { nameSchema, phoneNumberSchema, phoneTypeSchema } from './shared.schema';

/** The individual application without account fields (application-only mode). */
export const individualApplicationSchema = z.object({
  name: nameSchema,
  phoneNumber: phoneNumberSchema,
  phoneType: phoneTypeSchema,
  address: addressSchema,
  membershipInterests: interestsSchema,
  motivation: motivationSchema,
  waiverRequest: z.boolean().optional(),
  waiverReason: wordLimitedStringSchema('Waiver reason').optional(),
});

/** Sign-up: account + individual application. */
export const individualSchema = withPasswordsMatch(
  individualApplicationSchema.extend(accountObject.shape),
);

export type IndividualApplication = z.infer<typeof individualSchema>;

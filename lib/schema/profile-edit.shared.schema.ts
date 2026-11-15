import { z } from 'zod';

import { addressSchema } from './address.schema';
import { interestsSchema } from './interests.schema';
import { wordLimitedStringSchema } from './motivation.schema';
import {
  emailSchema,
  phoneNumberSchema,
  phoneTypeSchema,
} from './shared.schema';

/**
 * Blank optional text inputs send `''`, so treat that (and a missing value)
 * as not provided before validating.
 */
function optionalText<T extends z.ZodType<string, string>>(schema: T) {
  return z
    .string()
    .trim()
    .optional()
    .transform((value) => (value ? value : undefined))
    .pipe(schema.optional());
}

export const optionalProfileEmailSchema = optionalText(emailSchema);

export const optionalProgramsOrServicesSchema = optionalText(
  wordLimitedStringSchema('Programs or services'),
);

/**
 * `phoneNumberSchema` accepts the form's `(604)-123-4567` and a stored
 * `+1 (604)-123-4567`, and outputs the stored format, so no adapter is needed.
 */
export const profileEditCommonFields = {
  email: emailSchema,
  phoneNumber: phoneNumberSchema,
  phoneType: phoneTypeSchema,
  address: addressSchema,
  membershipInterests: interestsSchema,
  motivation: wordLimitedStringSchema('Reason for joining'),
};

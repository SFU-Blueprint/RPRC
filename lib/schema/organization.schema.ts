import { z } from 'zod';

import { addressSchema } from './address.schema';
import { interestsSchema } from './interests.schema';
import { motivationSchema, wordLimitedStringSchema } from './motivation.schema';
import { passwordSchema } from './password.schema';
import {
  emailSchema,
  nameSchema,
  phoneNumberSchema,
  phoneTypeSchema,
} from './shared.schema';

export const organizationSchema = z
  .object({
    email: emailSchema,
    /** The organization representative's name. */
    name: nameSchema,
    organizationEmail: emailSchema.optional(),
    password: passwordSchema,
    confirmPassword: z.string({ error: 'Please confirm your password' }),
    phoneNumber: phoneNumberSchema,
    phoneType: phoneTypeSchema,
    address: addressSchema,
    membershipInterests: interestsSchema,
    motivation: motivationSchema,
    programsOrServices: wordLimitedStringSchema(
      'Programs or services',
    ).optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    error: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type OrganizationApplication = z.infer<typeof organizationSchema>;

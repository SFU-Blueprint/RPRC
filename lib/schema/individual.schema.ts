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

export const individualSchema = z
  .object({
    email: emailSchema,
    name: nameSchema,
    password: passwordSchema,
    confirmPassword: z.string({ error: 'Please confirm your password' }),
    phoneNumber: phoneNumberSchema,
    phoneType: phoneTypeSchema,
    address: addressSchema,
    membershipInterests: interestsSchema,
    motivation: motivationSchema,
    waiverRequest: z.boolean().optional(),
    waiverReason: wordLimitedStringSchema('Waiver reason').optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    error: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type IndividualApplication = z.infer<typeof individualSchema>;

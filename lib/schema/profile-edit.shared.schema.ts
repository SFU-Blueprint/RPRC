import { z } from 'zod';

import { addressSchema } from './address.schema';
import { interestsSchema } from './interests.schema';
import { wordLimitedStringSchema } from './motivation.schema';
import { emailSchema, phoneNumberSchema, phoneTypeSchema } from './shared.schema';

export const profileEditPhoneNumberSchema = z
  .string({ error: 'Phone number is required' })
  .trim()
  .transform((value) => {
    const digits = value.replace(/\D/g, '');
    return digits.length === 10 ? `+1${digits}` : value;
  })
  .pipe(phoneNumberSchema);

export const profileEditPhoneTypeSchema = z
  .enum(['home', 'cell'], { error: 'Select either Home or Cell' })
  .transform((value) => (value === 'home' ? 'Home' : 'Cell'))
  .pipe(phoneTypeSchema);

export const optionalProfileEmailSchema = z
  .string()
  .trim()
  .transform((value) => (value === '' ? undefined : value))
  .pipe(emailSchema.optional());

export const optionalProgramsOrServicesSchema = z
  .string()
  .trim()
  .transform((value) => (value === '' ? undefined : value))
  .pipe(wordLimitedStringSchema('Programs or services').optional());

export const profileEditCommonFields = {
  email: emailSchema,
  phoneNumber: profileEditPhoneNumberSchema,
  phoneType: profileEditPhoneTypeSchema,
  address: addressSchema,
  membershipInterests: interestsSchema,
  motivation: wordLimitedStringSchema('Reason for joining'),
};

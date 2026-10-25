import { z } from 'zod';

import { nameSchema } from './shared.schema';
import {
  optionalProfileEmailSchema,
  optionalProgramsOrServicesSchema,
  profileEditCommonFields,
} from './profile-edit.shared.schema';

const organizationNameSchema = z
  .string({ error: 'Organization name is required' })
  .trim()
  .min(1, { error: 'Organization name is required' })
  .max(150, { error: 'Organization name must be at most 150 characters' });

export const organizationProfileEditSchema = z.object({
  role: z.literal('organization'),
  name: organizationNameSchema,
  ...profileEditCommonFields,
  representativeName: nameSchema,
  representativeEmail: optionalProfileEmailSchema,
  programsOrServices: optionalProgramsOrServicesSchema,
});

export type OrganizationProfileEditInput = z.input<typeof organizationProfileEditSchema>;
export type OrganizationProfileEditValues = z.output<typeof organizationProfileEditSchema>;

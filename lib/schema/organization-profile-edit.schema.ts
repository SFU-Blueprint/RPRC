import { z } from 'zod';

import { nameSchema, organizationNameSchema } from './shared.schema';
import {
  optionalProfileEmailSchema,
  optionalProgramsOrServicesSchema,
  profileEditCommonFields,
} from './profile-edit.shared.schema';

export const organizationProfileEditSchema = z.object({
  role: z.literal('organization'),
  /** The organization's name (`org_name`). */
  name: organizationNameSchema,
  ...profileEditCommonFields,
  representativeName: nameSchema,
  representativeEmail: optionalProfileEmailSchema,
  programsOrServices: optionalProgramsOrServicesSchema,
});

export type OrganizationProfileEditInput = z.input<
  typeof organizationProfileEditSchema
>;
export type OrganizationProfileEditValues = z.output<
  typeof organizationProfileEditSchema
>;

import { z } from 'zod';

import { individualProfileEditSchema } from './individual-profile-edit.schema';
import { organizationProfileEditSchema } from './organization-profile-edit.schema';

export const memberProfileEditSchema = z.discriminatedUnion('role', [
  individualProfileEditSchema,
  organizationProfileEditSchema,
]);

export type MemberProfileEditInput = z.input<typeof memberProfileEditSchema>;
export type MemberProfileEditValues = z.output<typeof memberProfileEditSchema>;

import { z } from 'zod';

import { nameSchema } from './shared.schema';
import { profileEditCommonFields } from './profile-edit.shared.schema';

export const individualProfileEditSchema = z.object({
  role: z.literal('individual'),
  name: nameSchema,
  ...profileEditCommonFields,
});

export type IndividualProfileEditInput = z.input<typeof individualProfileEditSchema>;
export type IndividualProfileEditValues = z.output<typeof individualProfileEditSchema>;

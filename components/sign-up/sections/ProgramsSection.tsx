'use client';

import { TextareaField } from '@/components/sign-up/fields/TextareaField';
import {
  SIGN_UP_FIELD_LABELS,
  SIGN_UP_SECTION_TITLES,
} from '@/lib/constants/sign-up';
import { useOrganizationSignUpForm } from '@/lib/hooks/useSignUpFormContext';
import { MOTIVATION_MAX_WORDS } from '@/lib/schema';

import { SignUpSection } from './SignUpSection';

/** Organization only: optional `programsOrServices`. */
export function ProgramsSection() {
  const { control } = useOrganizationSignUpForm();

  return (
    <SignUpSection title={SIGN_UP_SECTION_TITLES.PROGRAMS} layout="stack">
      <TextareaField
        control={control}
        name="programsOrServices"
        label={SIGN_UP_FIELD_LABELS.PROGRAMS}
        rows={5}
        maxWords={MOTIVATION_MAX_WORDS}
      />
    </SignUpSection>
  );
}

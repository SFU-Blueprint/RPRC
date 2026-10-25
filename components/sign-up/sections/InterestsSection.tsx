'use client';

import { CheckboxGroupField } from '@/components/sign-up/fields/CheckboxGroupField';
import {
  INTEREST_OPTIONS,
  SIGN_UP_FIELD_LABELS,
  SIGN_UP_FIELD_DESCRIPTIONS,
  SIGN_UP_SECTION_TITLES,
} from '@/lib/constants/sign-up';
import { useSharedSignUpForm } from '@/lib/hooks/useSignUpFormContext';

import { SignUpSection } from './SignUpSection';

/** `membershipInterests` as checkboxes (one per `MEMBERSHIP_INTERESTS`). */
export function InterestsSection() {
  const { control } = useSharedSignUpForm();

  return (
    <SignUpSection title={SIGN_UP_SECTION_TITLES.INTERESTS} layout="stack">
      <CheckboxGroupField
        control={control}
        name="membershipInterests"
        label={SIGN_UP_FIELD_LABELS.INTERESTS}
        description={SIGN_UP_FIELD_DESCRIPTIONS.INTERESTS}
        options={INTEREST_OPTIONS}
        optionsClassName="grid grid-cols-2 gap-3 md:grid-cols-3"
      />
    </SignUpSection>
  );
}

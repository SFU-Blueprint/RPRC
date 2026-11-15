'use client';

import { TextareaField } from '@/components/sign-up/fields/TextareaField';
import {
  SIGN_UP_FIELD_LABELS,
  SIGN_UP_SECTION_TITLES,
} from '@/lib/constants/sign-up';
import { useSharedSignUpForm } from '@/lib/hooks/useSignUpFormContext';
import { MOTIVATION_MAX_WORDS } from '@/lib/schema';

import { SignUpSection } from './SignUpSection';

/** `motivation`, capped at the schema's word limit. */
export function MotivationSection() {
  const { control } = useSharedSignUpForm();

  return (
    <SignUpSection title={SIGN_UP_SECTION_TITLES.MOTIVATION} layout="stack">
      <TextareaField
        control={control}
        name="motivation"
        label={SIGN_UP_FIELD_LABELS.MOTIVATION}
        rows={6}
        maxWords={MOTIVATION_MAX_WORDS}
        required
      />
    </SignUpSection>
  );
}

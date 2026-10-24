'use client';

import { PasswordField } from '@/components/sign-up/fields/PasswordField';
import { TextField } from '@/components/sign-up/fields/TextField';
import {
  SIGN_UP_FIELD_LABELS,
  SIGN_UP_SECTION_TITLES,
} from '@/lib/constants/sign-up';
import { useSharedSignUpForm } from '@/lib/hooks/useSignUpFormContext';

import { SignUpSection } from './SignUpSection';

/** `email`, `password`, `confirmPassword` from the application schemas. */
export function AccountSection() {
  const { control } = useSharedSignUpForm();

  return (
    <SignUpSection title={SIGN_UP_SECTION_TITLES.ACCOUNT}>
      <TextField
        control={control}
        name="email"
        type="email"
        label={SIGN_UP_FIELD_LABELS.EMAIL}
        required
        className="md:col-span-2"
        inputProps={{ autoComplete: 'email' }}
      />
      <PasswordField
        control={control}
        name="password"
        label={SIGN_UP_FIELD_LABELS.PASSWORD}
        required
        showRules
      />
      <PasswordField
        control={control}
        name="confirmPassword"
        label={SIGN_UP_FIELD_LABELS.CONFIRM_PASSWORD}
        required
      />
    </SignUpSection>
  );
}

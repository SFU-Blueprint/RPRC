'use client';

import type { ReactNode } from 'react';

import { PhoneField } from '@/components/sign-up/fields/PhoneField';
import { RadioGroupField } from '@/components/sign-up/fields/RadioGroupField';
import { TextField } from '@/components/sign-up/fields/TextField';
import {
  PHONE_TYPE_OPTIONS,
  SIGN_UP_FIELD_LABELS,
  SIGN_UP_SECTION_TITLES,
} from '@/lib/constants/sign-up';
import { useSharedSignUpForm } from '@/lib/hooks/useSignUpFormContext';

import { SignUpSection } from './SignUpSection';

type ContactSectionProps = {
  /** "Name" for individuals, the representative's name for organizations. */
  nameLabel: string;
  /** Form-specific fields placed after the name, e.g. `organizationEmail`. */
  children?: ReactNode;
};

/** `name`, `phoneNumber`, `phoneType`, plus any form-specific contact fields. */
export function ContactSection({ nameLabel, children }: ContactSectionProps) {
  const { control } = useSharedSignUpForm();

  return (
    <SignUpSection title={SIGN_UP_SECTION_TITLES.CONTACT}>
      <TextField
        control={control}
        name="name"
        label={nameLabel}
        required
        inputProps={{ autoComplete: 'name' }}
      />
      {children}
      <PhoneField
        control={control}
        name="phoneNumber"
        label={SIGN_UP_FIELD_LABELS.PHONE_NUMBER}
        required
        // Phone and phone type always share a row, as in the old form.
        className="md:col-start-1"
      />
      <RadioGroupField
        control={control}
        name="phoneType"
        label={SIGN_UP_FIELD_LABELS.PHONE_TYPE}
        options={PHONE_TYPE_OPTIONS}
        required
      />
    </SignUpSection>
  );
}

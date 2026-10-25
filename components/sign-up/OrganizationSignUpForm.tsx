'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { signUpOrganization } from '@/app/actions/auth';
import { TextField } from '@/components/sign-up/fields/TextField';
import { AccountSection } from '@/components/sign-up/sections/AccountSection';
import { AddressSection } from '@/components/sign-up/sections/AddressSection';
import { ContactSection } from '@/components/sign-up/sections/ContactSection';
import { InterestsSection } from '@/components/sign-up/sections/InterestsSection';
import { MotivationSection } from '@/components/sign-up/sections/MotivationSection';
import { ProgramsSection } from '@/components/sign-up/sections/ProgramsSection';
import {
  ORGANIZATION_SIGN_UP_DEFAULTS,
  SIGN_UP_FIELD_DESCRIPTIONS,
  SIGN_UP_FIELD_LABELS,
  SIGN_UP_FORM_COPY,
} from '@/lib/constants/sign-up';
import { organizationSchema } from '@/lib/schema';
import type {
  OrganizationSignUpInput,
  OrganizationSignUpValues,
} from '@/types/sign-up-form.types';

import { SignUpFormInterface } from './SignUpFormInterface';

/** `/sign-up/organization`: account + organization application on one page. */
export function OrganizationSignUpForm() {
  const form = useForm<
    OrganizationSignUpInput,
    unknown,
    OrganizationSignUpValues
  >({
    resolver: zodResolver(organizationSchema),
    defaultValues: ORGANIZATION_SIGN_UP_DEFAULTS,
  });

  return (
    <SignUpFormInterface
      form={form}
      heading={SIGN_UP_FORM_COPY.ORGANIZATION_HEADING}
      onSubmit={signUpOrganization}
    >
      <AccountSection />
      <ContactSection nameLabel={SIGN_UP_FIELD_LABELS.REPRESENTATIVE_NAME}>
        <TextField
          control={form.control}
          name="organizationEmail"
          type="email"
          label={SIGN_UP_FIELD_LABELS.ORGANIZATION_EMAIL}
          description={SIGN_UP_FIELD_DESCRIPTIONS.ORGANIZATION_EMAIL}
          inputProps={{ autoComplete: 'email' }}
        />
      </ContactSection>
      <AddressSection />
      <InterestsSection />
      <MotivationSection />
      <ProgramsSection />
    </SignUpFormInterface>
  );
}

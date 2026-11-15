'use client';

import { useForm } from 'react-hook-form';

import { applyAsOrganization, signUpOrganization } from '@/app/actions/sign-up';
import { TextField } from '@/components/sign-up/fields/TextField';
import { AccountSection } from '@/components/sign-up/sections/AccountSection';
import { AddressSection } from '@/components/sign-up/sections/AddressSection';
import { ContactSection } from '@/components/sign-up/sections/ContactSection';
import { InterestsSection } from '@/components/sign-up/sections/InterestsSection';
import { MotivationSection } from '@/components/sign-up/sections/MotivationSection';
import { ProgramsSection } from '@/components/sign-up/sections/ProgramsSection';
import { SignedInAccountSection } from '@/components/sign-up/sections/SignedInAccountSection';
import {
  ORGANIZATION_SIGN_UP_DEFAULTS,
  SIGN_UP_FIELD_LABELS,
  SIGN_UP_FORM_COPY,
} from '@/lib/constants/sign-up';
import {
  modeAwareResolver,
  useSignUpFormMode,
} from '@/lib/hooks/useSignUpFormMode';
import {
  organizationApplicationSchema,
  organizationSchema,
} from '@/lib/schema';
import type {
  OrganizationSignUpInput,
  OrganizationSignUpValues,
  SignUpFormMode,
} from '@/types/sign-up-form.types';

import { SignUpFormInterface } from './SignUpFormInterface';

type OrganizationSignUpFormProps = {
  /** From the page: application-only when signed in without an application. */
  initialMode?: SignUpFormMode;
  /** The signed-in user's email, shown read-only in application-only mode. */
  accountEmail?: string;
};

/** `/sign-up/organization`: account + organization application on one page. */
export function OrganizationSignUpForm({
  initialMode = 'sign-up',
  accountEmail,
}: OrganizationSignUpFormProps) {
  const { mode, modeRef, onFailure } = useSignUpFormMode(initialMode);
  const form = useForm<
    OrganizationSignUpInput,
    unknown,
    OrganizationSignUpValues
  >({
    resolver: modeAwareResolver(
      modeRef,
      organizationSchema,
      organizationApplicationSchema,
    ),
    defaultValues: ORGANIZATION_SIGN_UP_DEFAULTS,
  });

  return (
    <SignUpFormInterface
      form={form}
      heading={SIGN_UP_FORM_COPY.ORGANIZATION_HEADING}
      mode={mode}
      onSubmit={(values) =>
        mode === 'sign-up'
          ? signUpOrganization(values)
          : applyAsOrganization(values)
      }
      onFailure={onFailure}
    >
      {mode === 'sign-up' ? (
        <AccountSection
          emailLabel={SIGN_UP_FIELD_LABELS.ORGANIZATION_ACCOUNT_EMAIL}
        />
      ) : (
        <SignedInAccountSection
          email={accountEmail ?? form.getValues('email') ?? ''}
          emailLabel={SIGN_UP_FIELD_LABELS.ORGANIZATION_ACCOUNT_EMAIL}
        />
      )}
      {/* Same fields, labels and order as the old organization form. */}
      <ContactSection
        nameLabel={SIGN_UP_FIELD_LABELS.REPRESENTATIVE_NAME}
        leadingFields={
          <TextField
            control={form.control}
            name="organizationName"
            label={SIGN_UP_FIELD_LABELS.ORGANIZATION_NAME}
            required
            inputProps={{ autoComplete: 'organization' }}
          />
        }
      >
        <TextField
          control={form.control}
          name="representativeEmail"
          type="email"
          label={SIGN_UP_FIELD_LABELS.REPRESENTATIVE_EMAIL}
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

'use client';

import { useForm } from 'react-hook-form';

import { applyAsIndividual, signUpIndividual } from '@/app/actions/sign-up';
import { AccountSection } from '@/components/sign-up/sections/AccountSection';
import { AddressSection } from '@/components/sign-up/sections/AddressSection';
import { ContactSection } from '@/components/sign-up/sections/ContactSection';
import { InterestsSection } from '@/components/sign-up/sections/InterestsSection';
import { MotivationSection } from '@/components/sign-up/sections/MotivationSection';
import { SignedInAccountSection } from '@/components/sign-up/sections/SignedInAccountSection';
import { WaiverSection } from '@/components/sign-up/sections/WaiverSection';
import {
  INDIVIDUAL_SIGN_UP_DEFAULTS,
  SIGN_UP_FIELD_LABELS,
  SIGN_UP_FORM_COPY,
} from '@/lib/constants/sign-up';
import {
  modeAwareResolver,
  useSignUpFormMode,
} from '@/lib/hooks/useSignUpFormMode';
import { individualApplicationSchema, individualSchema } from '@/lib/schema';
import type {
  IndividualSignUpInput,
  IndividualSignUpValues,
  SignUpFormMode,
} from '@/types/sign-up-form.types';

import { SignUpFormInterface } from './SignUpFormInterface';

type IndividualSignUpFormProps = {
  /** From the page: application-only when signed in without an application. */
  initialMode?: SignUpFormMode;
  /** The signed-in user's email, shown read-only in application-only mode. */
  accountEmail?: string;
};

/** `/sign-up/individual`: account + individual application on one page. */
export function IndividualSignUpForm({
  initialMode = 'sign-up',
  accountEmail,
}: IndividualSignUpFormProps) {
  const { mode, modeRef, onFailure } = useSignUpFormMode(initialMode);
  const form = useForm<IndividualSignUpInput, unknown, IndividualSignUpValues>({
    resolver: modeAwareResolver(
      modeRef,
      individualSchema,
      individualApplicationSchema,
    ),
    defaultValues: INDIVIDUAL_SIGN_UP_DEFAULTS,
  });

  return (
    <SignUpFormInterface
      form={form}
      heading={SIGN_UP_FORM_COPY.INDIVIDUAL_HEADING}
      mode={mode}
      onSubmit={(values) =>
        mode === 'sign-up'
          ? signUpIndividual(values)
          : applyAsIndividual(values)
      }
      onFailure={onFailure}
    >
      {mode === 'sign-up' ? (
        <AccountSection />
      ) : (
        <SignedInAccountSection
          email={accountEmail ?? form.getValues('email') ?? ''}
        />
      )}
      <ContactSection nameLabel={SIGN_UP_FIELD_LABELS.NAME} />
      <AddressSection />
      <InterestsSection />
      <MotivationSection />
      <WaiverSection />
    </SignUpFormInterface>
  );
}

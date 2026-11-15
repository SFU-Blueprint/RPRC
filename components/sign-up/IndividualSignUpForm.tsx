'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { signUpIndividual } from '@/app/actions/auth';
import { AccountSection } from '@/components/sign-up/sections/AccountSection';
import { AddressSection } from '@/components/sign-up/sections/AddressSection';
import { ContactSection } from '@/components/sign-up/sections/ContactSection';
import { InterestsSection } from '@/components/sign-up/sections/InterestsSection';
import { MotivationSection } from '@/components/sign-up/sections/MotivationSection';
import { WaiverSection } from '@/components/sign-up/sections/WaiverSection';
import {
  INDIVIDUAL_SIGN_UP_DEFAULTS,
  SIGN_UP_FIELD_LABELS,
  SIGN_UP_FORM_COPY,
} from '@/lib/constants/sign-up';
import { individualSchema } from '@/lib/schema';
import type {
  IndividualSignUpInput,
  IndividualSignUpValues,
} from '@/types/sign-up-form.types';

import { SignUpFormInterface } from './SignUpFormInterface';

/** `/sign-up/individual`: account + individual application on one page. */
export function IndividualSignUpForm() {
  const form = useForm<IndividualSignUpInput, unknown, IndividualSignUpValues>({
    resolver: zodResolver(individualSchema),
    defaultValues: INDIVIDUAL_SIGN_UP_DEFAULTS,
  });

  return (
    <SignUpFormInterface
      form={form}
      heading={SIGN_UP_FORM_COPY.INDIVIDUAL_HEADING}
      onSubmit={signUpIndividual}
    >
      <AccountSection />
      <ContactSection nameLabel={SIGN_UP_FIELD_LABELS.NAME} />
      <AddressSection />
      <InterestsSection />
      <MotivationSection />
      <WaiverSection />
    </SignUpFormInterface>
  );
}

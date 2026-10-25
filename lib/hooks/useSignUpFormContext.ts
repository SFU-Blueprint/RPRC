'use client';

import { useFormContext } from 'react-hook-form';

import type {
  IndividualSignUpInput,
  OrganizationSignUpInput,
  SharedSignUpInput,
} from '@/types/sign-up-form.types';

/**
 * Typed access to the surrounding sign-up form (`<FormProvider>`).
 *
 * Shared sections use the shared variant so the same section works inside
 * both the individual and the organization form. Each form provides its own
 * context, so no state is shared between pages.
 */
export function useSharedSignUpForm() {
  return useFormContext<SharedSignUpInput>();
}

export function useIndividualSignUpForm() {
  return useFormContext<IndividualSignUpInput>();
}

export function useOrganizationSignUpForm() {
  return useFormContext<OrganizationSignUpInput>();
}

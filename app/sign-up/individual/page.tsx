import type { Metadata } from 'next';

import { IndividualSignUpForm } from '@/components/sign-up/IndividualSignUpForm';
import { SIGN_UP_FORM_COPY } from '@/lib/constants/sign-up';
import { getSignUpFormProps } from '@/lib/helpers/sign-up-page';

export const metadata: Metadata = {
  title: SIGN_UP_FORM_COPY.INDIVIDUAL_HEADING,
};

export default async function IndividualSignUpPage() {
  return <IndividualSignUpForm {...await getSignUpFormProps()} />;
}

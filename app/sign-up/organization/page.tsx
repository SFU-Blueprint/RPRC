import type { Metadata } from 'next';

import { OrganizationSignUpForm } from '@/components/sign-up/OrganizationSignUpForm';
import { SIGN_UP_FORM_COPY } from '@/lib/constants/sign-up';
import { getSignUpFormProps } from '@/lib/helpers/sign-up-page';

export const metadata: Metadata = {
  title: SIGN_UP_FORM_COPY.ORGANIZATION_HEADING,
};

export default async function OrganizationSignUpPage() {
  return <OrganizationSignUpForm {...await getSignUpFormProps()} />;
}

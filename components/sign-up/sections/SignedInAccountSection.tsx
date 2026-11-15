import { FormFieldShell } from '@/components/sign-up/fields/FormFieldShell';
import { Input } from '@/components/ui/input';
import {
  SIGN_UP_FIELD_LABELS,
  SIGN_UP_FORM_COPY,
  SIGN_UP_SECTION_TITLES,
} from '@/lib/constants/sign-up';

import { SignUpSection } from './SignUpSection';

const IDS = {
  control: 'field-signed-in-email',
  description: 'field-signed-in-email-description',
  error: 'field-signed-in-email-error',
};

type SignedInAccountSectionProps = {
  email: string;
  /** "Email Address" for individuals, the organization's email for organizations. */
  emailLabel?: string;
};

/**
 * Application-only mode: the account already exists, so the account fields
 * are replaced by the signed-in email, read-only (like the old form's
 * disabled email field).
 */
export function SignedInAccountSection({
  email,
  emailLabel = SIGN_UP_FIELD_LABELS.EMAIL,
}: SignedInAccountSectionProps) {
  return (
    <SignUpSection title={SIGN_UP_SECTION_TITLES.ACCOUNT}>
      <FormFieldShell
        ids={IDS}
        label={emailLabel}
        description={SIGN_UP_FORM_COPY.SIGNED_IN_NOTE}
        className="md:col-span-2"
      >
        <Input
          id={IDS.control}
          type="email"
          value={email}
          readOnly
          aria-readonly="true"
          aria-describedby={IDS.description}
          className="bg-muted"
        />
      </FormFieldShell>
    </SignUpSection>
  );
}

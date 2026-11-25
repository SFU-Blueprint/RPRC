import { CONTACT_EMAILS } from '@/lib/constants/contact';
import { EMAIL_COPY } from '@/lib/constants/email';
import { ROUTES } from '@/lib/constants/routes';
import { ContactLine } from './_components/ContactLine';
import { EmailButton } from './_components/EmailButton';
import { EmailHero } from './_components/EmailHero';
import { EmailLayout } from './_components/EmailLayout';
import { SignOff } from './_components/SignOff';
import { PREVIEW_BASE_PROPS, type BaseEmailProps } from './_components/types';

export type ApplicationRejectedProps = BaseEmailProps;

/** Links to the dashboard, whose REJECTED button runs the re-apply flow. */
export default function ApplicationRejected({
  name,
  siteUrl,
}: ApplicationRejectedProps) {
  const copy = EMAIL_COPY.REJECTED;
  return (
    <EmailLayout preview={copy.HEADLINE} siteUrl={siteUrl}>
      <EmailHero
        name={name}
        headline={copy.HEADLINE}
        tone="error"
        lead={copy.LEAD}
        body={copy.BODY}
      />
      <EmailButton
        href={`${siteUrl}${ROUTES.MEMBERSHIP_DASHBOARD}`}
        label={copy.BUTTON}
      />
      <ContactLine email={CONTACT_EMAILS.GENERAL} />
      <SignOff />
    </EmailLayout>
  );
}

ApplicationRejected.PreviewProps =
  PREVIEW_BASE_PROPS satisfies ApplicationRejectedProps;

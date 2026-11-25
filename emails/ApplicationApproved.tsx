import { ROUTES } from '@/lib/constants/routes';
import { EMAIL_CARDS, EMAIL_COPY } from '@/lib/constants/email';
import { EmailButton } from './_components/EmailButton';
import { EmailHero } from './_components/EmailHero';
import { EmailLayout } from './_components/EmailLayout';
import { NextSteps } from './_components/NextSteps';
import { SignOff } from './_components/SignOff';
import { PREVIEW_BASE_PROPS, type BaseEmailProps } from './_components/types';

export type ApplicationApprovedProps = BaseEmailProps & {
  /** Processing fee in whole dollars (CAD). */
  fee: number;
};

/** Approved and waiting for payment. Links to the dashboard, which starts checkout. */
export default function ApplicationApproved({
  name,
  siteUrl,
  fee,
}: ApplicationApprovedProps) {
  const copy = EMAIL_COPY.APPROVED;
  return (
    <EmailLayout preview={copy.HEADLINE} siteUrl={siteUrl}>
      <EmailHero
        name={name}
        headline={copy.HEADLINE}
        tone="success"
        lead={copy.LEAD}
        body={copy.BODY}
      />
      <EmailButton
        href={`${siteUrl}${ROUTES.MEMBERSHIP_DASHBOARD}`}
        label={copy.BUTTON}
      />
      <NextSteps
        cards={[EMAIL_CARDS.MAKE_PAYMENT(fee), EMAIL_CARDS.VIEW_PROFILE]}
      />
      <SignOff />
    </EmailLayout>
  );
}

ApplicationApproved.PreviewProps = {
  ...PREVIEW_BASE_PROPS,
  fee: 5,
} satisfies ApplicationApprovedProps;

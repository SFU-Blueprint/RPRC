import { EMAIL_CARDS, EMAIL_COPY } from '@/lib/constants/email';
import { EmailHero } from './_components/EmailHero';
import { EmailLayout } from './_components/EmailLayout';
import { NextSteps } from './_components/NextSteps';
import { SignOff } from './_components/SignOff';
import { PREVIEW_BASE_PROPS, type BaseEmailProps } from './_components/types';

export type MembershipActiveProps = BaseEmailProps & {
  /** Activated by a granted fee waiver, so no payment happened. */
  feeWaived: boolean;
  /** The application has been active before (`applications.member_since` was set). */
  renewal: boolean;
};

export default function MembershipActive({
  name,
  siteUrl,
  feeWaived,
  renewal,
}: MembershipActiveProps) {
  const copy = EMAIL_COPY.ACTIVE;
  const headline = copy.HEADLINE({ feeWaived, renewal });
  return (
    <EmailLayout preview={headline} siteUrl={siteUrl}>
      <EmailHero
        name={name}
        headline={headline}
        tone="success"
        lead={copy.LEAD}
        body={copy.BODY}
      />
      <NextSteps cards={[EMAIL_CARDS.VIEW_PROFILE]} />
      <SignOff />
    </EmailLayout>
  );
}

MembershipActive.PreviewProps = {
  ...PREVIEW_BASE_PROPS,
  feeWaived: false,
  renewal: false,
} satisfies MembershipActiveProps;

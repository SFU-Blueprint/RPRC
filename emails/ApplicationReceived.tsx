import { EMAIL_CARDS, EMAIL_COPY } from '@/lib/constants/email';
import { EmailHero } from './_components/EmailHero';
import { EmailLayout } from './_components/EmailLayout';
import { NextSteps } from './_components/NextSteps';
import { SignOff } from './_components/SignOff';
import { PREVIEW_BASE_PROPS, type BaseEmailProps } from './_components/types';

export type ApplicationReceivedProps = BaseEmailProps & {
  /** The application has been active before (`applications.member_since` was set). */
  renewal: boolean;
};

export default function ApplicationReceived({
  name,
  siteUrl,
  renewal,
}: ApplicationReceivedProps) {
  const copy = EMAIL_COPY.RECEIVED;
  const headline = copy.HEADLINE(renewal);
  return (
    <EmailLayout preview={headline} siteUrl={siteUrl}>
      <EmailHero
        name={name}
        headline={headline}
        tone="success"
        lead={copy.LEAD}
        body={copy.BODY}
      />
      <NextSteps cards={[EMAIL_CARDS.REVIEW_PERIOD]} />
      <SignOff />
    </EmailLayout>
  );
}

ApplicationReceived.PreviewProps = {
  ...PREVIEW_BASE_PROPS,
  renewal: false,
} satisfies ApplicationReceivedProps;

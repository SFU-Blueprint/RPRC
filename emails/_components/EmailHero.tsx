import { Heading, Text } from '@react-email/components';
import { BRAND_COLORS } from '@/lib/constants/brand';
import { EMAIL_COPY } from '@/lib/constants/email';
import { emailStyles } from './styles';

type EmailHeroProps = {
  name: string;
  headline: string;
  tone: 'success' | 'error';
  lead: string;
  body: string;
};

/** Greeting, headline, bold lead line and body text. */
export function EmailHero({
  name,
  headline,
  tone,
  lead,
  body,
}: EmailHeroProps) {
  return (
    <>
      <Text style={emailStyles.text}>{EMAIL_COPY.GREETING(name)}</Text>
      <Heading
        as="h1"
        style={{
          ...emailStyles.heading,
          fontSize: '28px',
          lineHeight: '34px',
          color:
            tone === 'error' ? BRAND_COLORS.DESTRUCTIVE : BRAND_COLORS.HEADLINE,
        }}
      >
        {headline}
      </Heading>
      <Text style={{ ...emailStyles.text, fontWeight: 700 }}>{lead}</Text>
      <Text style={emailStyles.text}>{body}</Text>
    </>
  );
}

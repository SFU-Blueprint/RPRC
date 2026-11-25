import { Button, Link, Section, Text } from '@react-email/components';
import { BRAND_COLORS, EMAIL_FONTS } from '@/lib/constants/brand';
import { EMAIL_COPY } from '@/lib/constants/email';
import { emailStyles } from './styles';

type EmailButtonProps = { href: string; label: string };

/** Green full-width button, with the URL as plain text under it (email has no "copy" button). */
export function EmailButton({ href, label }: EmailButtonProps) {
  return (
    <Section style={{ margin: '8px 0 24px' }}>
      <Button
        href={href}
        style={{
          display: 'block',
          width: '100%',
          boxSizing: 'border-box',
          backgroundColor: BRAND_COLORS.PRIMARY,
          color: BRAND_COLORS.WHITE,
          fontFamily: EMAIL_FONTS.BODY,
          fontSize: '16px',
          fontWeight: 700,
          textAlign: 'center',
          textDecoration: 'none',
          padding: '14px 24px',
          borderRadius: '8px',
        }}
      >
        {label}
      </Button>
      <Text style={{ ...emailStyles.secondaryText, marginTop: '12px' }}>
        {EMAIL_COPY.LINK_FALLBACK}{' '}
        <Link
          href={href}
          style={{ color: BRAND_COLORS.HEADLINE, wordBreak: 'break-all' }}
        >
          {href}
        </Link>
      </Text>
    </Section>
  );
}

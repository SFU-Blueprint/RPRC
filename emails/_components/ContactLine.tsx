import { Link, Text } from '@react-email/components';
import { BRAND_COLORS } from '@/lib/constants/brand';
import { EMAIL_COPY } from '@/lib/constants/email';
import { emailStyles } from './styles';

/** "Questions? Contact us at …" with a mailto link. */
export function ContactLine({ email }: { email: string }) {
  return (
    <Text style={{ ...emailStyles.secondaryText, marginTop: '8px' }}>
      {EMAIL_COPY.CONTACT}{' '}
      <Link href={`mailto:${email}`} style={{ color: BRAND_COLORS.HEADLINE }}>
        {email}
      </Link>
      .
    </Text>
  );
}

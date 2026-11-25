import { Text } from '@react-email/components';
import { EMAIL_COPY } from '@/lib/constants/email';
import { emailStyles } from './styles';

export function SignOff() {
  return (
    <Text style={{ ...emailStyles.secondaryText, marginTop: '24px' }}>
      {EMAIL_COPY.SIGN_OFF}
    </Text>
  );
}

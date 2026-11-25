import { INFO_CARDS } from '@/lib/constants/membership';

/** Local Mailpit SMTP (exposed by `smtp_port` under `[local_smtp]` in supabase/config.toml). */
export const LOCAL_SMTP = { HOST: '127.0.0.1', PORT: 54325 } as const;

/** Reuses an `INFO_CARDS` entry's text (not its lucide icon, which can't go in an email). */
function infoCardText(id: number) {
  const card = INFO_CARDS.find((entry) => entry.ID === id);
  if (!card) throw new Error(`INFO_CARDS has no card ${id}`);
  return { heading: card.HEADING, description: card.DESCRIPTION };
}

export const EMAIL_CARDS = {
  REVIEW_PERIOD: infoCardText(3),
  VIEW_PROFILE: infoCardText(2),
  MAKE_PAYMENT: (fee: number) => ({
    heading: 'Make Payment',
    description: `Pay the $${fee} processing fee from your profile to activate your membership.`,
  }),
} as const;

export const EMAIL_COPY = {
  HEADER_TITLE: 'RPRC Membership',
  GREETING: (name: string) => (name ? `Hi ${name},` : 'Hi,'),
  NEXT_STEPS_HEADING: "What's Next",
  LINK_FALLBACK: 'Or copy this link into your browser:',
  CONTACT: 'Questions? Contact us at',
  SIGN_OFF: 'Richmond Poverty Reduction Coalition',
  RECEIVED: {
    SUBJECT: (renewal: boolean) =>
      renewal
        ? 'We received your membership renewal'
        : 'We received your membership application',
    HEADLINE: (renewal: boolean) =>
      renewal
        ? 'Your renewal has been received and is under processing.'
        : 'Your application has been received and is under processing.',
    LEAD: 'Thank you for applying to the Richmond Poverty Reduction Coalition.',
    BODY: 'Our team will review your application. Updates about your application status will be sent to this email address.',
  },
  APPROVED: {
    SUBJECT: 'Your membership application has been approved',
    HEADLINE: 'Your membership application has been approved!',
    LEAD: 'One step left: pay the processing fee to activate your membership.',
    BODY: 'Log in to your profile to make the payment. Your membership becomes active as soon as the payment goes through.',
    BUTTON: 'Proceed to payment',
  },
  ACTIVE: {
    SUBJECT: (renewal: boolean) =>
      renewal
        ? 'Your RPRC membership is renewed'
        : 'Welcome to the Richmond Poverty Reduction Coalition',
    HEADLINE: ({
      feeWaived,
      renewal,
    }: {
      feeWaived: boolean;
      renewal: boolean;
    }) => {
      if (feeWaived)
        return renewal
          ? 'Welcome back! Your membership is renewed.'
          : 'Welcome! You are now an active member.';
      return renewal
        ? 'Payment successful! Your membership is renewed.'
        : 'Payment successful! You are now an active member.';
    },
    LEAD: 'Thank you for being a member of the Richmond Poverty Reduction Coalition.',
    BODY: 'You can view your membership status and details in your profile at any time.',
  },
  REJECTED: {
    SUBJECT: 'Update on your membership application',
    HEADLINE: 'Your application has been rejected.',
    LEAD: 'Thank you for your interest in the Richmond Poverty Reduction Coalition.',
    BODY: 'After review, we were unable to approve your application at this time. You can update your profile and re-apply from your dashboard.',
    BUTTON: 'Re-apply',
  },
} as const;

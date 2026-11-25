import { Heading, Section, Text } from '@react-email/components';
import { BRAND_COLORS } from '@/lib/constants/brand';
import { EMAIL_COPY } from '@/lib/constants/email';
import { emailStyles } from './styles';

export type NextStepCard = { heading: string; description: string };

/**
 * "What's Next" cards. One card per row, so they read the same on mobile and desktop
 * without media queries (which several clients drop).
 */
export function NextSteps({ cards }: { cards: readonly NextStepCard[] }) {
  if (cards.length === 0) return null;
  return (
    <Section>
      <Heading
        as="h2"
        style={{
          ...emailStyles.heading,
          fontSize: '22px',
          color: BRAND_COLORS.TEXT,
        }}
      >
        {EMAIL_COPY.NEXT_STEPS_HEADING}
      </Heading>
      {cards.map((card) => (
        <Section
          key={card.heading}
          style={{
            backgroundColor: BRAND_COLORS.CARD_BACKGROUND,
            borderRadius: '12px',
            padding: '16px 20px',
            marginBottom: '12px',
          }}
        >
          <Text
            style={{ ...emailStyles.text, fontWeight: 700, margin: '0 0 4px' }}
          >
            {card.heading}
          </Text>
          <Text style={emailStyles.secondaryText}>{card.description}</Text>
        </Section>
      ))}
    </Section>
  );
}

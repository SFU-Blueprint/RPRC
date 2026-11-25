import { BRAND_COLORS, EMAIL_FONTS } from '@/lib/constants/brand';

/** Inline styles shared by the email components. Email clients need inline CSS. */
export const emailStyles = {
  text: {
    fontFamily: EMAIL_FONTS.BODY,
    fontSize: '16px',
    lineHeight: '24px',
    color: BRAND_COLORS.TEXT,
    margin: '0 0 16px',
  },
  secondaryText: {
    fontFamily: EMAIL_FONTS.BODY,
    fontSize: '14px',
    lineHeight: '20px',
    color: BRAND_COLORS.SECONDARY_TEXT,
    margin: '0',
  },
  heading: {
    fontFamily: EMAIL_FONTS.HEADING,
    fontWeight: 700,
    margin: '0 0 16px',
  },
} as const;

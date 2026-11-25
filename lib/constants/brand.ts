import { CONTACT_EMAILS } from '@/lib/constants/contact';

/**
 * Brand colours as hex, for emails (which can't use the CSS variables in
 * `app/globals.css`). Each one names the variable it copies.
 */
export const BRAND_COLORS = {
  HEADER: '#423f3a',
  PRIMARY: '#5eb42d',
  PRIMARY_LIGHT: '#cfe8c0',
  HEADLINE: '#003e00',
  DESTRUCTIVE: '#aa2628',
  CARD_BACKGROUND: '#f5f4f2',
  SECONDARY_TEXT: '#68655f',
  WHITE: '#ffffff',
  TEXT: '#1f1e1c',
} as const;

export const EMAIL_FONTS = {
  HEADING: "'Roboto Condensed', 'Arial Narrow', Arial, sans-serif",
  BODY: 'Inter, Arial, sans-serif',
} as const;

export const EMAIL_SENDER = {
  FROM: 'Richmond Poverty Reduction Coalition <noreply@richmondprc.org>',
  REPLY_TO: CONTACT_EMAILS.GENERAL,
} as const;

export const EMAIL_ASSET_PATHS = {
  LOGO: '/Adminpage/RPRC Logo.png',
} as const;

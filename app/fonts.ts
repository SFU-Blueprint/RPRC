import { Roboto_Condensed, Inter } from 'next/font/google';

export const robotoCondensed = Roboto_Condensed({
  variable: '--font-roboto-condensed',
  subsets: ['latin'],
  weight: ['400', '500', '600'], // Regular, Medium, SemiBold
  display: 'swap',
});

export const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'], // Regular, Medium, SemiBold, Bold
  display: 'swap',
});

// ============================================
// FONT STYLE CONSTANTS
// ============================================

// Headers - Roboto Condensed
export const headerStyles = {
  // Mobile
  xs: 'text-[18px] font-medium leading-[1]',
  s: 'text-[20px] font-medium leading-[1]',
  m: 'text-[24px] font-normal leading-[1]',
  l: 'text-[32px] font-medium leading-[1]',
  xl: 'text-[40px] font-medium leading-[1.1]',

  // Desktop (responsive)
  xsResponsive:
    'text-[18px] md:text-[24px] font-medium leading-[1] md:leading-[1.1]',
  sResponsive:
    'text-[20px] md:text-[28px] font-medium leading-[1] md:leading-[1.1]',
  mResponsive:
    'text-[24px] md:text-[36px] font-normal md:font-medium leading-[1] md:leading-[1.1]',
  lResponsive:
    'text-[32px] md:text-[48px] font-medium md:font-semibold leading-[1] md:leading-[1.1]',
  xlResponsive:
    'text-[40px] md:text-[60px] font-medium md:font-semibold leading-[1.1] md:leading-[1.2]',
};

// Subheaders - Inter (Desktop only)
export const subheaderStyles = {
  xs: 'text-[16px] font-semibold leading-[1.2]',
  s: 'text-[20px] font-bold leading-[1.2]',
  m: 'text-[24px] font-medium leading-[1.3]',
};

// Body - Inter
export const bodyStyles = {
  s: 'text-[12px] font-normal leading-[1]',
  m: 'text-[16px] font-normal leading-[1.5]',
  lg: 'text-[20px] font-normal leading-[1.5]',
  tag: 'text-[24px] font-medium leading-[1.5]',
};

// Button - Inter
export const buttonStyles = {
  text: 'text-[16px] font-medium leading-[1.6]',
  large: 'text-[20px] font-medium leading-[1.2]',
  radio: 'text-[24px] font-normal leading-none',
};

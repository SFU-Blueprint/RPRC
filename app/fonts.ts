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
  xs: 'text-[16px] font-medium leading-[1]',
  s: 'text-[18px] font-medium leading-[1]',
  m: 'text-[20px] font-normal leading-[1]',
  l: 'text-[22px] font-medium leading-[1]',
  xl: 'text-[30px] font-medium leading-[1.1]',

  // Desktop (responsive)
  xsResponsive:
    'text-[12px] md:text-[14px] font-medium leading-[1] md:leading-[1.1]',
  sResponsive:
    'text-sm md:text-md font-medium leading-[1] md:leading-[1.1]',
  mResponsive:
    'text-md md:text-xl font-normal md:font-medium leading-[1] md:leading-[1.1]',
  lResponsive:
    'text-xl md:text-2xl font-medium md:font-semibold leading-[1] md:leading-[1.1]',
  xlResponsive:
    'text-[28px] md:text-[50px] font-medium md:font-semibold leading-[1.1] md:leading-[1.2]',
};

// Subheaders - Inter (Desktop only)
export const subheaderStyles = {
  xs: 'text-[12px] font-semibold leading-[1.2]',
  s: 'text-[16px] font-bold leading-[1.2]',
  m: 'text-[22px] font-medium leading-[1.3]',
};

// Body - Inter
export const bodyStyles = {
  s: 'text-[11px] font-normal leading-[1]',
  m: 'text-[13px] font-normal leading-[1.5]',
  lg: 'text-[16px] font-normal leading-[1.5]',
  tag: 'text-[19px] font-medium leading-[1.5]',
};

// Button - Inter
export const buttonStyles = {
  text: 'text-[15px] font-medium leading-[1.6]',
  textSmall: 'text-[12px] font-medium leading-[1.6]',
  large: 'text-[18px] font-medium leading-[1.2]',
  radio: 'text-[22px] font-normal leading-none',
};

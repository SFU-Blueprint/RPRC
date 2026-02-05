import { Roboto_Condensed, Inter } from 'next/font/google';

export const robotoCondensed = Roboto_Condensed({
  variable: '--font-roboto-condensed',
  subsets: ['latin'],
  weight: ['500', '600'], // Medium and SemiBold only
  display: 'swap',
});

export const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  weight: ['400', '500', '600'], // Regular, Medium, SemiBold
  display: 'swap',
});

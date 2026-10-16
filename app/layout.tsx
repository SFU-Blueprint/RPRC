import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { RootNavbar } from '@/components/layout/RootNavbar';
import { Toaster } from 'sonner';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Richmond Poverty Reduction Coalition',
  description: 'Richmond Poverty Reduction Coalition membership portal',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <RootNavbar />
        {children}
        <Toaster
          position="top-center"
          richColors
          toastOptions={{
            className: 'text-destructive border-destructive',
          }}
        />
      </body>
    </html>
  );
}

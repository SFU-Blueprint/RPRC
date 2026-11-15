import type { ReactNode } from 'react';

import { inter } from '@/app/fonts';

/** Page container shared by `/sign-up` and its two forms. */
export default function SignUpLayout({ children }: { children: ReactNode }) {
  return (
    <div className={inter.className}>
      <div className="mx-auto max-w-screen-2xl px-6 pt-8 pb-12 md:px-10 md:pt-10 md:pb-16 lg:px-12 lg:pb-20">
        {children}
      </div>
    </div>
  );
}

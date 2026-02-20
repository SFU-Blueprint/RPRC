'use client';

import { usePathname } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';

type RootNavbarProps = {
  initialUser: {
    isAuthenticated: boolean;
    displayName: string;
    avatarHref: string;
  };
};

export function RootNavbar({ initialUser }: RootNavbarProps) {
  const pathname = usePathname();

  if (pathname.startsWith('/admin')) {
    return null;
  }

  return <Navbar initialUser={initialUser} />;
}

'use client';

import { usePathname } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';

type RootNavbarProps = {
  initialUser?: {
    isAuthenticated: boolean;
    displayName: string;
    avatarHref: string;
  };
};

const PUBLIC_USER = {
  isAuthenticated: false,
  displayName: '',
  avatarHref: '/',
};

export function RootNavbar({ initialUser }: RootNavbarProps) {
  const pathname = usePathname();

  if (pathname.startsWith('/admin')) {
    return null;
  }

  return <Navbar initialUser={PUBLIC_USER} />;
}

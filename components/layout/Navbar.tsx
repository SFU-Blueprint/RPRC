'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { inter, buttonStyles } from '@/app/fonts';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ROUTES } from '@/lib/constants/routes';
import { useAuth } from '@/lib/contexts/AuthContext';
import {
  getAvatarFallbackText,
  getDefaultAvatarUrl,
  getUserDisplayName,
} from '@/lib/utils/auth-utils';
import '@/app/globals.css';

type NavbarProps = {
  initialUser: {
    isAuthenticated: boolean;
    displayName: string;
    avatarHref: string;
  };
};

export function Navbar({ initialUser }: NavbarProps) {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const displayName = useMemo(
    () => (user ? getUserDisplayName(user) : initialUser.displayName),
    [user, initialUser.displayName],
  );
  const avatarFallback = useMemo(
    () => getAvatarFallbackText(displayName),
    [displayName],
  );
  const avatarUrl = useMemo(() => getDefaultAvatarUrl(displayName), [displayName]);
  const avatarHref =
    user
      ? (user?.user_metadata?.role === 'admin'
        ? ROUTES.ADMIN_DASHBOARD
        : ROUTES.MEMBERSHIP_DASHBOARD)
      : initialUser.avatarHref;
  const isAuthenticated = user ? true : initialUser.isAuthenticated;

  const handleSignOut = async () => {
    await signOut();
    router.push(ROUTES.HOME);
    router.refresh();
  };

  return (
    <nav
      className={`bg-signup-neutral-800 text-white ${inter.className}`}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="max-w-[1920px] mx-auto px-6 md:px-12 lg:px-24">
        <div className="flex items-center justify-between h-16">
          {/* Left Side - Navigation Links */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8 xl:gap-10">
            <Link
              href={ROUTES.HOME}
              className={` ${buttonStyles.text} font-medium hover:text-signup-primary-green-400 transition-colors`}
            >
              Home
            </Link>

            <button
              className={`flex items-center gap-1 ${buttonStyles.text} font-medium hover:text-signup-primary-green-400 transition-colors`}
            >
              About
              <svg
                className="w-3 h-3 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            <Link
              href={ROUTES.EVENTS}
              className={` ${buttonStyles.text} font-medium hover:text-signup-primary-green-400 transition-colors`}
            >
              Events
            </Link>

            <button
              className={`flex items-center gap-1 ${buttonStyles.text} font-medium hover:text-signup-primary-green-400 transition-colors`}
            >
              Policy Areas
              <svg
                className="w-3 h-3 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            <button
              className={`flex items-center gap-1 ${buttonStyles.text} font-medium hover:text-signup-primary-green-400 transition-colors`}
            >
              Resources
              <svg
                className="w-3 h-3 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            <Link
              href={ROUTES.CONTACT}
              className={` ${buttonStyles.text} font-medium hover:text-signup-primary-green-400 transition-colors`}
            >
              Contact
            </Link>
          </div>

          {/* Mobile Menu Button (Hamburger) */}
          <button
            className="md:hidden text-white"
            aria-label="Open menu"
            onClick={() => {
              // TODO: Add mobile menu functionality
              console.log('Mobile menu clicked');
            }}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          {/* Right Side - Action Buttons */}
          <div className="flex items-center gap-3 md:gap-4">
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    aria-label="Open account menu"
                    className="rounded-full"
                  >
                    <Avatar size="default">
                      <AvatarImage src={avatarUrl} alt={displayName} />
                      <AvatarFallback>{avatarFallback}</AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel className="truncate">
                    {displayName}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href={avatarHref}>Dashboard</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    variant="destructive"
                    onClick={handleSignOut}
                  >
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button asChild size="md">
                <Link href={ROUTES.MEMBERSHIP_SIGNUP}>Join Us</Link>
              </Button>
            )}

            {/* Secondary Button - Donate */}
            <Link
              href={ROUTES.DONATE}
              className={`px-4 md:px-5 lg:px-6 py-2 md:py-2.5 
                bg-signup-neutral-800
                text-white
                ${buttonStyles.text}
                font-semibold 
                rounded-lg 
                hover:bg-signup-neutral-900
                active:bg-black
                transition-colors`}
            >
              Donate
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

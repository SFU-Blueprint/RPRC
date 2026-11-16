'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { AUTH_COPY } from '@/lib/constants/auth';
import { ROUTES } from '@/lib/constants/routes';
import { useAuth } from '@/lib/contexts/AuthContext';

/**
 * Signs out the same way as the member navbar, then returns home. On failure
 * the admin stays signed in and sees a toast.
 */
export function AdminLogoutButton() {
  const router = useRouter();
  const { signOut } = useAuth();
  const [pending, setPending] = useState(false);

  const handleSignOut = async () => {
    setPending(true);
    try {
      await signOut();
    } catch (error) {
      console.error('[auth] sign-out failed:', error);
      toast.error(AUTH_COPY.SIGN_OUT_FAILED);
      setPending(false);
      return;
    }
    router.push(ROUTES.HOME);
    router.refresh();
  };

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={handleSignOut}
      disabled={pending}
      aria-label="Logout"
      className="text-white hover:bg-white/10 hover:text-white"
    >
      <LogOut aria-hidden="true" />
      <span className="hidden sm:inline">Logout</span>
    </Button>
  );
}

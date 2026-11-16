'use client';

import type { Session, User } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/client';

export async function getCurrentAuthUser(): Promise<User | null> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export function subscribeToAuthChanges(
  onSessionChange: (session: Session | null) => void,
): () => void {
  const supabase = createClient();
  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((_event, session) => {
    onSessionChange(session);
  });

  return () => subscription.unsubscribe();
}

/**
 * Signs out and clears the session cookies. Throws if Supabase reports an
 * error: signOut() returns errors instead of throwing, and on failure the
 * session is left in place.
 */
export async function signOutClient(): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function exchangeCodeForSession(code: string): Promise<{
  error: string | null;
}> {
  const supabase = createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);
  return { error: error?.message ?? null };
}

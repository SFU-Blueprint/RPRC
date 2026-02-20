import { createClient as createServerClient } from '@/lib/supabase/server';
import { getCurrentAuthUser } from '@/lib/api/services/auth-service';

/**
 * Get current user (server-side)
 * Use in Server Components and API routes
 */
export async function getUser() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

/**
 * Get current user (client-side)
 * Use in Client Components
 */
export async function getUserClient() {
  return getCurrentAuthUser();
}

/**
 * Check if user has an application
 */
export async function hasApplication(userId: string): Promise<boolean> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/application?userId=${userId}`,
      { cache: 'no-store' }
    );

    if (response.ok) {
      const data = await response.json();
      return !!data.application;
    }

    return false;
  } catch (error) {
    console.error('Error checking application:', error);
    return false;
  }
}

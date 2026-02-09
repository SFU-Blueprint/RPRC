import { type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/middleware';

/**
 * Runs on every request. Refreshes the Supabase auth session so that
 * server components and API routes see an up-to-date user and cookies.
 */
export async function middleware(request: NextRequest) {
  const { supabase, response } = createClient(request);

  // Refreshes session if expired and updates cookies on the response
  await supabase.auth.getUser();

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};

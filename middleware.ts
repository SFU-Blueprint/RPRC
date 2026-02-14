import { type NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/middleware';

/**
 * Runs on every request. Refreshes the Supabase auth session so that
 * server components and API routes see an up-to-date user and cookies.
 * Also protects authenticated routes.
 */
export async function middleware(request: NextRequest) {
  const { supabase, response } = createClient(request);

  // Refreshes session if expired and updates cookies on the response
  const { data: { user } } = await supabase.auth.getUser();

  // Define protected routes that require authentication
  const protectedRoutes = ['/membership/form', '/membership/dashboard'];
  const isProtectedRoute = protectedRoutes.some(route =>
    request.nextUrl.pathname.startsWith(route)
  );

  // Redirect to signup if accessing protected route without session
  if (isProtectedRoute && !user) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = '/membership/signup';
    return NextResponse.redirect(redirectUrl);
  }

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

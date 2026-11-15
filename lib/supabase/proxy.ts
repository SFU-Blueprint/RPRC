import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { UserRole } from '@/lib/constants/enums';
import { ROUTES, PROTECTED_ROUTES } from '@/lib/constants/routes';

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  // With Fluid compute, don't put this client in a global environment
  // variable. Always create a new one on each request.
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // Do not run code between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  // IMPORTANT: Refreshes the auth tokens and returns the user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;
  const isAdminRoute = pathname.startsWith('/admin');
  // Exact, so e.g. "/sign-ups" doesn't count.
  const isSignUpRoute =
    pathname === ROUTES.MEMBERSHIP_SIGNUP ||
    pathname.startsWith(`${ROUTES.MEMBERSHIP_SIGNUP}/`);
  // Where logged-in users shouldn't stay: sign-in, sign-up and their entry points.
  const isEntryRoute =
    pathname === ROUTES.HOME || pathname === ROUTES.MEMBERSHIP || isSignUpRoute;

  // Check if accessing protected membership routes
  const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route),
  );

  const redirectTo = (path: string) => {
    const url = request.nextUrl.clone();
    url.pathname = path;
    return NextResponse.redirect(url);
  };

  if (!user) {
    // The home page has the log-in form; a member whose session expired
    // should land there, not on sign-up.
    if (isProtectedRoute || isAdminRoute) return redirectTo(ROUTES.HOME);
    return supabaseResponse;
  }

  const isAdminUser = user.user_metadata?.role === 'admin';
  // TODO: Remove this bypass and re-enable stricter admin routing in production.
  // Dev mode: allow authenticated admin users to access all routes, but send them
  // to the admin dashboard from the sign-in and sign-up pages.
  if (isAdminUser) {
    if (isEntryRoute) return redirectTo(ROUTES.ADMIN_DASHBOARD);
    return supabaseResponse;
  }

  // One query for both the role and whether the member has applied.
  const { data: profile } = await supabase
    .from('users')
    .select('role, applications(id)')
    .eq('id', user.id)
    .maybeSingle();
  const hasApplication = (profile?.applications?.length ?? 0) > 0;
  const signUpForm =
    profile?.role === UserRole.INDIVIDUAL
      ? ROUTES.SIGN_UP_INDIVIDUAL
      : profile?.role === UserRole.ORGANIZATION
        ? ROUTES.SIGN_UP_ORGANIZATION
        : null;

  // Signed in without an application (e.g. the application step failed after
  // the account was created): finish it on the form for their role. Only
  // entry points and /membership pages are redirected, never /auth, /error or
  // /api, and never the Stripe return page.
  if (!hasApplication && signUpForm) {
    if (pathname === signUpForm) return supabaseResponse;
    const redirectsToForm =
      isEntryRoute ||
      (pathname.startsWith(`${ROUTES.MEMBERSHIP}/`) &&
        pathname !== ROUTES.MEMBERSHIP_PAYMENT_RETURN);
    if (redirectsToForm || isAdminRoute) return redirectTo(signUpForm);
    return supabaseResponse;
  }

  // Members who have applied, and anyone whose role isn't individual or
  // organization (never sent to sign-up, or they'd bounce back).
  if (isEntryRoute || isAdminRoute)
    return redirectTo(ROUTES.MEMBERSHIP_DASHBOARD);

  // IMPORTANT: You *must* return the supabaseResponse object as it is. If you're
  // creating a new response object with NextResponse.next() make sure to:
  // 1. Pass the request in it, like so:
  //    const myNewResponse = NextResponse.next({ request })
  // 2. Copy over the cookies, like so:
  //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // 3. Change the myNewResponse object to fit your needs, but avoid changing
  //    the cookies!
  // 4. Finally:
  //    return myNewResponse
  // If this is not done, you may be causing the browser and server to go out
  // of sync and terminate the user's session prematurely!

  return supabaseResponse;
}

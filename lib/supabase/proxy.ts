import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { ROUTES, PROTECTED_ROUTES } from '@/lib/constants/routes'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  // With Fluid compute, don't put this client in a global environment
  // variable. Always create a new one on each request.
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options))
        },
      },
    }
  )

  // Do not run code between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  // IMPORTANT: Refreshes the auth tokens and returns the user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const pathname = request.nextUrl.pathname
  const isMembershipRoute = pathname.startsWith('/membership')
  const isAdminRoute = pathname.startsWith('/admin')
  const isSigninRoute = pathname === ROUTES.HOME
  const isSignupRoute =
    pathname.startsWith(ROUTES.MEMBERSHIP_SIGNUP) || pathname === '/membership'
  const isSigninOrSignupRoute = isSigninRoute || isSignupRoute

  // Check if accessing protected membership routes
  const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route)
  )

  if (!user) {
    if (isProtectedRoute) {
      const url = request.nextUrl.clone()
      url.pathname = ROUTES.MEMBERSHIP_SIGNUP
      return NextResponse.redirect(url)
    }

    if (isAdminRoute) {
      const url = request.nextUrl.clone()
      url.pathname = ROUTES.HOME
      return NextResponse.redirect(url)
    }

    return supabaseResponse
  }

  const isAdminUser = user.user_metadata?.role === 'admin'

  // if user has an application, redirect to membership dashboard, otherwise redirect to membership form
  const getMembershipLandingPath = async () => {
    const { data: applications } = await supabase
      .from('applications')
      .select('id')
      .eq('user_id', user.id)
      .limit(1)

    return applications && applications.length > 0
      ? ROUTES.MEMBERSHIP_DASHBOARD
      : ROUTES.MEMBERSHIP_FORM
  }

  // Logged-in users should not return to sign-in/sign-up entry points.
  if (isSigninOrSignupRoute) {
    const url = request.nextUrl.clone()
    url.pathname = isAdminUser
      ? ROUTES.ADMIN_DASHBOARD
      : await getMembershipLandingPath()
    return NextResponse.redirect(url)
  }

  // Admins are restricted to admin portal.
  if (isAdminUser && isMembershipRoute) {
    const url = request.nextUrl.clone()
    url.pathname = ROUTES.ADMIN_DASHBOARD
    return NextResponse.redirect(url)
  }

  // Non-admin users are restricted to membership area.
  if (!isAdminUser && isAdminRoute) {
    const url = request.nextUrl.clone()
    url.pathname = await getMembershipLandingPath()
    return NextResponse.redirect(url)
  }

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

  return supabaseResponse
}
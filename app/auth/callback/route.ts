import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'
import { ROUTES } from '@/lib/constants/routes'

// GET /auth/callback
// This route is used to handle the callback from the email confirmation link
export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (!code) {
    console.error('No code provided in callback')
    return NextResponse.redirect(new URL(`${ROUTES.MEMBERSHIP_SIGNUP}?error=no_code`, requestUrl.origin))
  }

  const supabase = await createClient()
  
  // Exchange the code for a session - this sets the session cookies
  const { data, error } = await supabase.auth.exchangeCodeForSession(code)

  if (error) {
    console.error('Error exchanging code for session:', error)
    return NextResponse.redirect(new URL(`${ROUTES.MEMBERSHIP_SIGNUP}?error=auth_failed`, requestUrl.origin))
  }

  if (!data.user) {
    console.error('No user returned after exchanging code')
    return NextResponse.redirect(new URL(`${ROUTES.MEMBERSHIP_SIGNUP}?error=no_user`, requestUrl.origin))
  }

  console.log('Session established for user:', data.user.id)

  // Check if user has an application
  try {
    const applicationResponse = await fetch(
      `${requestUrl.origin}/api/application?userId=${data.user.id}`
    )

    if (applicationResponse.ok) {
      const applicationData = await applicationResponse.json()

      if (applicationData.application) {
        // Has application - redirect to dashboard
        console.log('→ Redirecting to dashboard (has application)')
        return NextResponse.redirect(new URL(ROUTES.MEMBERSHIP_DASHBOARD, requestUrl.origin))
      }
    }
  } catch (error) {
    console.error('Error checking application:', error)
    // Continue to form if application check fails
  }

  // No application - redirect to form
  console.log('→ Redirecting to form (no application)')
  return NextResponse.redirect(new URL(ROUTES.MEMBERSHIP_FORM, requestUrl.origin))
}

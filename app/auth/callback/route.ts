import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'
import { ROUTES } from '@/lib/constants/routes'
import { ErrorType } from '@/lib/constants/error-types'

// GET /auth/callback
// This route is used to handle the callback from the email confirmation link
export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  
  // Check for Supabase error parameters
  const urlError = requestUrl.searchParams.get('error')
  const errorCode = requestUrl.searchParams.get('error_code')
  
  if (urlError) {
    console.error('Supabase error in callback:', { urlError, errorCode })
    
    // Handle specific error codes
    if (errorCode === 'otp_expired') {
      return NextResponse.redirect(new URL(`${ROUTES.ERROR}?type=${ErrorType.LINK_EXPIRED}`, requestUrl.origin))
    }
    
    return NextResponse.redirect(new URL(`${ROUTES.ERROR}?type=${ErrorType.LINK_INVALID}`, requestUrl.origin))
  }
  
  const code = requestUrl.searchParams.get('code')

  if (!code) {
    console.error('No code provided in callback')
    return NextResponse.redirect(new URL(`${ROUTES.ERROR}?type=${ErrorType.LINK_INVALID}`, requestUrl.origin))
  }

  const supabase = await createClient()
  
  // Exchange the code for a session - this sets the session cookies
  const { data, error } = await supabase.auth.exchangeCodeForSession(code)

  if (error) {
    console.error('Error exchanging code for session:', error)
    return NextResponse.redirect(new URL(`${ROUTES.ERROR}?type=${ErrorType.LINK_INVALID}`, requestUrl.origin))
  }

  if (!data.user) {
    console.error('No user returned after exchanging code')
    return NextResponse.redirect(new URL(`${ROUTES.ERROR}?type=${ErrorType.LINK_INVALID}`, requestUrl.origin))
  }

  // Destination routing is centralized in lib/supabase/proxy.ts.
  return NextResponse.redirect(new URL(ROUTES.HOME, requestUrl.origin))
}

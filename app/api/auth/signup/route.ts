import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * Password validation rules
 */
function validatePassword(password: string): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }

  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Email validation
 */
function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * POST /api/auth/signup
 * Create new user with Supabase Auth
 */
export async function POST(request: NextRequest) {
  try {
    const { email, password, role } = await request.json();

    // Validate required fields
    if (!email || !password || !role) {
      return NextResponse.json(
        { error: 'Email, password, and role are required' },
        { status: 400 }
      );
    }

    // Validate email format
    if (!validateEmail(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate password constraints
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      return NextResponse.json(
        { 
          error: 'Password does not meet requirements', 
          details: passwordValidation.errors 
        },
        { status: 400 }
      );
    }

    // Create user with Supabase Auth
    const supabase = await createClient();
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          role: role,
        },
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
      },
    });

    if (signUpError) {
      console.error('Supabase signup error:', signUpError);
      
      // Handle specific Supabase errors
      if (signUpError.message.includes('already registered') || 
          signUpError.message.includes('User already registered')) {
        return NextResponse.json(
          { error: 'Email already exists. Please login instead.', errorCode: 'EMAIL_EXISTS' },
          { status: 409 }
        );
      }

      return NextResponse.json(
        { error: signUpError.message || 'Failed to create account' },
        { status: 500 }
      );
    }

    if (!data.user) {
      return NextResponse.json(
        { error: 'Failed to create account' },
        { status: 500 }
      );
    }

    // Success - user created but NO session yet (requires email confirmation)
    // Session will be created after user clicks confirmation link in email
    // and is redirected to /auth/callback
    return NextResponse.json(
      { 
        success: true, 
        userId: data.user.id,
        email: data.user.email,
        message: 'Please check your email to confirm your account'
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error in signup route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import {
  AuthErrorCode,
  type LoginResponse,
  type ForgotPasswordResponse,
  type ResetPasswordResponse,
} from '@/lib/constants/error-types';
import { AUTH_COPY } from '@/lib/constants/auth';
import { ROUTES } from '@/lib/constants/routes';

export async function login(formData: FormData): Promise<LoginResponse> {
  const supabase = await createClient();

  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  // Validate inputs
  if (!email || !password) {
    return {
      error: AUTH_COPY.CREDENTIALS_REQUIRED,
      code: AuthErrorCode.VALIDATION_ERROR,
    };
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error('Login error:', error.message);

    // Handle specific auth errors
    if (error.message?.includes('Invalid login credentials')) {
      return {
        error: AUTH_COPY.INVALID_CREDENTIALS,
        code: AuthErrorCode.INVALID_CREDENTIALS,
      };
    }

    return {
      error: error.message || AUTH_COPY.SIGN_IN_FAILED,
      code: AuthErrorCode.SERVER_ERROR,
    };
  }

  if (!data.user) {
    return {
      error: AUTH_COPY.SIGN_IN_FAILED,
      code: AuthErrorCode.SERVER_ERROR,
    };
  }
  // Routing destinations are centralized in lib/supabase/proxy.ts.
  revalidatePath(ROUTES.HOME, 'layout');
  redirect(ROUTES.HOME);
}

export async function signout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath(ROUTES.HOME, 'layout');
  redirect(ROUTES.HOME);
}

export async function forgotPassword(
  formData: FormData,
): Promise<ForgotPasswordResponse> {
  const supabase = await createClient();

  const email = formData.get('email') as string;

  // Validate input
  if (!email) {
    return {
      error: AUTH_COPY.EMAIL_REQUIRED,
      code: AuthErrorCode.VALIDATION_ERROR,
    };
  }

  // Send password reset email
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}${ROUTES.AUTH_RESET_PASSWORD}`,
  });

  if (error) {
    console.error('Forgot password error:', error);

    // Handle rate limiting
    if (
      error.message?.includes('rate limit') ||
      error.message?.includes('too many')
    ) {
      return {
        error: AUTH_COPY.RESET_EMAIL_RATE_LIMITED,
        code: AuthErrorCode.RATE_LIMITED,
      };
    }

    return {
      error: error.message || AUTH_COPY.RESET_EMAIL_FAILED,
      code: AuthErrorCode.SERVER_ERROR,
    };
  }

  return {
    success: true,
    message: AUTH_COPY.RESET_EMAIL_SENT,
  };
}

export async function resetPassword(
  formData: FormData,
): Promise<ResetPasswordResponse> {
  const supabase = await createClient();

  const password = formData.get('password') as string;

  // Basic validation - detailed validation handled by PasswordInput component
  if (!password) {
    return {
      error: AUTH_COPY.PASSWORD_REQUIRED,
      code: AuthErrorCode.VALIDATION_ERROR,
    };
  }

  // Update password
  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    console.error('Reset password error:', error);

    // Handle Supabase password policy errors as backup
    if (
      error.message?.includes('Password') ||
      error.message?.includes('weak')
    ) {
      return {
        error: error.message,
        code: AuthErrorCode.WEAK_PASSWORD,
      };
    }

    return {
      error: error.message || AUTH_COPY.RESET_PASSWORD_FAILED,
      code: AuthErrorCode.SERVER_ERROR,
    };
  }

  return {
    success: true,
    message: AUTH_COPY.PASSWORD_RESET,
  };
}

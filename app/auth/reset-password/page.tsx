'use client';

import React, { useState, useEffect } from 'react';
import { resetPassword } from '@/app/actions/auth';
import { AuthErrorCode, ErrorType } from '@/lib/constants/error-types';
import { ROUTES } from '@/lib/constants/routes';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { PasswordInput } from '@/components/signup/inputs/PasswordInput';
import { inter, robotoCondensed, headerStyles, bodyStyles } from '@/app/fonts';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Exchange code for session on mount
  useEffect(() => {
    const exchangeCodeForSession = async () => {
      // Check for Supabase error parameters in URL
      const urlError = searchParams.get('error');
      const errorCode = searchParams.get('error_code');

      if (urlError) {
        console.error('Supabase error in URL, redirecting to error page');
        
        // Redirect to error page with appropriate error type
        if (errorCode === 'otp_expired') {
          router.replace(`${ROUTES.ERROR}?type=${ErrorType.LINK_EXPIRED}`);
        } else {
          router.replace(`${ROUTES.ERROR}?type=${ErrorType.LINK_INVALID}`);
        }
        return;
      }

      const code = searchParams.get('code');
      
      if (!code) {
        console.error('No code provided in URL, redirecting to error page');
        router.replace(`${ROUTES.ERROR}?type=${ErrorType.LINK_INVALID}`);
        return;
      }

      const supabase = createClient();
      const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

      if (exchangeError) {
        console.error('Error exchanging code for session, redirecting to error page');
        router.replace(`${ROUTES.ERROR}?type=${ErrorType.LINK_INVALID}`);
        return;
      }

      setIsLoading(false);
    };

    exchangeCodeForSession();
  }, [searchParams, router]);

  const validatePasswords = () => {
    let isValid = true;
    
    // Client-side validation is handled by PasswordInput component
    // Just check if passwords match
    if (password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
      isValid = false;
    } else {
      setConfirmPasswordError('');
    }

    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setHasAttemptedSubmit(true);
    setIsSubmitting(true);
    setError('');

    if (!validatePasswords()) {
      setIsSubmitting(false);
      return;
    }

    const formData = new FormData();
    formData.append('password', password);

    const result = await resetPassword(formData);

    if ('error' in result) {
      if (result.code === AuthErrorCode.WEAK_PASSWORD) {
        setPasswordError(result.error);
      } else {
        setError(result.error);
      }
      setIsSubmitting(false);
    } else {
      // Success - redirect to home with success message
      router.push(`${ROUTES.HOME}?password_reset=success`);
    }
  };

  // Loading state while exchanging code
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-8">
        <div
          className={`bg-card-background-gray rounded-[25px] p-8 md:p-10 lg:p-12 shadow-[0_4px_20px_rgba(0,0,0,0.1)] max-w-md w-full ${inter.className}`}
        >
          <h2
            className={`text-gray-900 mb-6 text-center ${headerStyles.lResponsive} ${robotoCondensed.className}`}
          >
            Verifying reset link...
          </h2>
          <div className="text-center">
            <p className={`text-gray-700 ${bodyStyles.m}`}>Please wait...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <div
        className={`bg-card-background-gray rounded-[25px] p-8 md:p-10 lg:p-12 shadow-[0_4px_20px_rgba(0,0,0,0.1)] max-w-md w-full ${inter.className}`}
      >
        <h2
          className={`text-gray-900 mb-6 text-center ${headerStyles.lResponsive} ${robotoCondensed.className}`}
        >
          Set new password
        </h2>

        <p className={`text-gray-700 mb-6 text-center ${bodyStyles.m}`}>
          Enter your new password below.
        </p>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Password with validation */}
          <PasswordInput
            label="New Password"
            value={password}
            error={passwordError}
            showValidation={hasAttemptedSubmit}
            onChange={(value) => {
              setPassword(value);
              setPasswordError('');
            }}
            placeholder="Enter your new password"
            required
            showRequirements={true}
          />

          {/* Confirm Password */}
          <PasswordInput
            label="Confirm New Password"
            value={confirmPassword}
            error={confirmPasswordError}
            showValidation={hasAttemptedSubmit}
            onChange={(value) => {
              setConfirmPassword(value);
              setConfirmPasswordError('');
            }}
            placeholder="Re-enter your new password"
            required
            showRequirements={false}
          />

          <Button
            type="submit"
            disabled={isSubmitting || !password || !confirmPassword}
            size="lg"
            className="w-full"
          >
            {isSubmitting ? 'Resetting password...' : 'Reset password'}
          </Button>

          <div className="text-center">
            <Link
              href={ROUTES.HOME}
              className="text-gray-700 hover:text-gray-900 text-sm underline"
            >
              Back to sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <React.Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    }>
      <ResetPasswordForm />
    </React.Suspense>
  );
}

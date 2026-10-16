'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ROUTES } from '@/lib/constants/routes';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Spinner } from '@/components/ui/spinner';
import { PasswordInput } from '@/components/signup/inputs/PasswordInput';
import { inter, robotoCondensed, headerStyles, bodyStyles } from '@/app/fonts';
import Link from 'next/link';
import { AuthErrorCode, type ResetPasswordResponse } from '@/lib/constants/error-types';
// import { exchangeCodeForSession } from '@/lib/api/services/auth-service';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [notice, setNotice] = useState('');
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const verifyResetLink = async () => {
      const urlError = searchParams.get('error');
      const errorCode = searchParams.get('error_code');

      if (urlError) {
        if (errorCode === 'otp_expired') {
          // router.replace(`${ROUTES.ERROR}?type=${ErrorType.LINK_EXPIRED}`);
          setNotice(
            'This demo reset link has expired. Error page routing is disabled in this preview.',
          );
        } else {
          // router.replace(`${ROUTES.ERROR}?type=${ErrorType.LINK_INVALID}`);
          setNotice(
            'This demo reset link is invalid. Error page routing is disabled in this preview.',
          );
        }
        setIsLoading(false);
        return;
      }

      const code = searchParams.get('code');

      if (!code) {
        // router.replace(`${ROUTES.ERROR}?type=${ErrorType.LINK_INVALID}`);
        setNotice(
          'No reset code was provided. Error page routing is disabled in this preview.',
        );
        setIsLoading(false);
        return;
      }

      // const { error: exchangeError } = await exchangeCodeForSession(code);
      const { error: exchangeError } = await Promise.resolve<{
        error: string | null;
      }>({ error: null });

      if (exchangeError) {
        // router.replace(`${ROUTES.ERROR}?type=${ErrorType.LINK_INVALID}`);
        setNotice(
          'This demo reset link could not be verified. Error page routing is disabled in this preview.',
        );
        setIsLoading(false);
        return;
      }

      setNotice('Demo reset link verified locally; no backend session was created.');
      setIsLoading(false);
    };

    void verifyResetLink();
  }, [searchParams, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setHasAttemptedSubmit(true);
    if (password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
      return;
    }
    setConfirmPasswordError('');

    const formData = new FormData();
    formData.append('password', password);
    // const result = await resetPassword(formData);
    const result = await Promise.resolve<ResetPasswordResponse>({
      success: true,
      message: 'Demo only: no account password was changed.',
    });
    if ('error' in result) {
      if (result.code === AuthErrorCode.WEAK_PASSWORD) {
        setPasswordError(result.error);
      } else {
        setNotice(result.error);
      }
    } else {
      setNotice(result.message);
    }
  };

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
          Preview the password reset form.
        </p>
        {notice && (
          <Alert variant="info" className="mb-6">
            <AlertDescription>{notice}</AlertDescription>
          </Alert>
        )}
        <form onSubmit={handleSubmit} className="space-y-5">
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
            showRequirements
          />
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
            disabled={!password || !confirmPassword}
            size="lg"
            className="w-full"
          >
            Preview password change
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
    <React.Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Spinner className="size-6 text-gray-600" />
        </div>
      }
    >
      <ResetPasswordForm />
    </React.Suspense>
  );
}

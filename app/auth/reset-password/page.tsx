'use client';

import React, { useState } from 'react';
import { resetPassword } from '@/app/actions/auth';
import { AuthErrorCode } from '@/lib/constants/auth-errors';
import { ROUTES } from '@/lib/constants/routes';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { PasswordInput } from '@/components/signup/inputs/PasswordInput';
import { inter, robotoCondensed, headerStyles, bodyStyles } from '@/app/fonts';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);

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
            size="md"
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

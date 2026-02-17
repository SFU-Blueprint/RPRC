'use client';

import React, { useState, useEffect } from 'react';
import { forgotPassword } from '@/app/actions/auth';
import { AuthErrorCode } from '@/lib/constants/error-types';
import { ROUTES } from '@/lib/constants/routes';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { inter, robotoCondensed, headerStyles, bodyStyles } from '@/app/fonts';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(60);
  const [isResending, setIsResending] = useState(false);

  // Countdown timer for resend email
  useEffect(() => {
    if (success && resendCountdown > 0) {
      const timer = setTimeout(() => {
        setResendCountdown(resendCountdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [success, resendCountdown]);

  const handleResendEmail = async () => {
    setIsResending(true);

    try {
      const formDataObj = new FormData();
      formDataObj.append('email', email);

      const result = await forgotPassword(formDataObj);

      if ('error' in result) {
        console.error('Resend error:', result.error, 'Code:', result.code);
        
        if (result.code === AuthErrorCode.RATE_LIMITED) {
          alert(result.error);
        } else {
          alert('Failed to resend email. Please try again or contact support.');
        }
      } else {
        console.log('Password reset email resent successfully');
        setResendCountdown(60);
      }
    } catch (error) {
      console.error('Unexpected error during resend:', error);
      alert('An unexpected error occurred. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    const formData = new FormData();
    formData.append('email', email);

    const result = await forgotPassword(formData);

    if ('error' in result) {
      setError(result.error);
    } else {
      setSuccess(true);
    }

    setIsSubmitting(false);
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-8">
        <div
          className={`bg-card-background-gray rounded-[25px] p-8 md:p-10 lg:p-12 shadow-[0_4px_20px_rgba(0,0,0,0.1)] max-w-md w-full ${inter.className}`}
        >
          <h2
            className={`text-gray-900 mb-6 text-center ${headerStyles.lResponsive} ${robotoCondensed.className}`}
          >
            Check your email
          </h2>
          <div className="space-y-4">
            <p className={`text-gray-700 ${bodyStyles.m}`}>
              We&apos;ve sent a password reset link to:
            </p>
            <p className={`font-semibold text-gray-900 ${bodyStyles.m}`}>
              {email}
            </p>
            <p className={`text-gray-700 ${bodyStyles.m}`}>
              Please click the link in the email to reset your password.
            </p>
            <Alert variant="info" className="mt-6">
              <AlertDescription>
                <strong>Note:</strong> The link will expire in 24 hours. If you don&apos;t see the email, check your spam folder.
              </AlertDescription>
            </Alert>

            {/* Resend Email Button */}
            <div className="mt-6 flex flex-col items-center gap-3">
              <Button
                onClick={handleResendEmail}
                disabled={resendCountdown > 0 || isResending}
                variant="outline"
                size="lg"
              >
                {isResending
                  ? 'Resending...'
                  : resendCountdown > 0
                  ? `Resend email in ${resendCountdown}s`
                  : 'Resend email'}
              </Button>
              {resendCountdown === 0 && !isResending && (
                <p className="text-sm text-muted-foreground">
                  Didn&apos;t receive the email? Click above to resend.
                </p>
              )}
            </div>

            <div className="mt-6 text-center">
              <Link
                href={ROUTES.HOME}
                className="text-[#5EB42D] hover:text-[#2B8100] font-medium underline"
              >
                Back to sign in
              </Link>
            </div>
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
          Reset your password
        </h2>

        <p className={`text-gray-700 mb-6 text-center ${bodyStyles.m}`}>
          Enter your email address and we&apos;ll send you a link to reset your password.
        </p>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="flex flex-col gap-2">
            <Label htmlFor="email">
              Email Address <span className="text-destructive">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@example.com"
              required
            />
          </div>

          <Button
            type="submit"
            disabled={isSubmitting || !email}
            size="md"
            className="w-full"
          >
            {isSubmitting ? 'Sending...' : 'Send reset link'}
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

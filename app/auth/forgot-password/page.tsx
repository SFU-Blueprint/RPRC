'use client';

import React, { useState } from 'react';
import { forgotPassword } from '@/app/actions/auth';
import { AuthErrorCode } from '@/lib/constants/auth-errors';
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

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { PasswordInput } from '@/components/signup/inputs/PasswordInput';
import { subheaderStyles, bodyStyles } from '@/app/fonts';
import { ROUTES } from '@/lib/constants/routes';
import { login } from '@/app/actions/auth';
import { AuthErrorCode } from '@/lib/constants/error-types';

export const HomePageForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const formDataObj = new FormData();
      formDataObj.append('email', formData.email);
      formDataObj.append('password', formData.password);

      const result = await login(formDataObj);

      if ('error' in result) {
        console.error('Login error:', result.error, 'Code:', result.code);

        // Show user-friendly error messages
        if (result.code === AuthErrorCode.INVALID_CREDENTIALS) {
          setError('Invalid email or password. Please try again.');
        } else if (result.code === AuthErrorCode.VALIDATION_ERROR) {
          setError('Please enter both email and password.');
        } else {
          setError(result.error || 'Failed to sign in. Please try again.');
        }
      }
      // Success case handled by server action (redirects to dashboard)
    } catch (error) {
      if (
        error &&
        typeof error === 'object' &&
        'digest' in error &&
        String((error as { digest?: string }).digest).startsWith('NEXT_REDIRECT')
      ) {
        throw error;
      }
      console.error('Unexpected error during login:', error);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rounded-3xl p-8 md:p-10 lg:p-12 bg-background-off-white shadow-[0_2.8px_2.2px_rgba(0,_0,_0,_0.034),_0_6.7px_5.3px_rgba(0,_0,_0,_0.048),_0_12.5px_10px_rgba(0,_0,_0,_0.06),_0_22.3px_17.9px_rgba(0,_0,_0,_0.072),_0_41.8px_33.4px_rgba(0,_0,_0,_0.086),_0_100px_80px_rgba(0,_0,_0,_0.12)]">
      <h3 className={`${subheaderStyles.m} mb-4 text-gray-900`}>
        Existing Member?
      </h3>

      <p className="text-gray-700 text-xs mb-6">
        Sign in to your account to access your membership profile, view
        upcoming events, and manage your preferences.
      </p>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-5 ">
        {/* Email Address */}
        <div>
          <Label htmlFor="email" className="text-xs">
            Email <span className="text-destructive">*</span>
          </Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            placeholder="your.email@example.com"
            className="mt-1"
            required
          />
        </div>

        {/* Password */}
        <PasswordInput
          label="Password"
          value={formData.password}
          onChange={(value) => setFormData({ ...formData, password: value })}
          placeholder="Enter your password"
          required
          showRequirements={false}
          showValidation={false}
        />

        {/* Forgot password link */}
        <div>
          <Link
            href={ROUTES.AUTH_FORGOT_PASSWORD}
            className="text-black text-xs font-medium underline"
          >
            Forgot password?
          </Link>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <Button
            type="submit"
            disabled={isSubmitting || !formData.email || !formData.password}
            className="bg-primary-black mx-auto block w-fit cursor-pointer"
          >
            {isSubmitting ? 'Signing in...' : 'Sign In'}
          </Button>
        </div>
      </form>
    </div>
  );
};

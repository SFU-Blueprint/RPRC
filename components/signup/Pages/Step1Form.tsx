'use client';

import React, { useState, useEffect } from 'react';
import '@/app/globals.css';
import { useSignUp } from '@/lib/contexts/SignUpContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  inter,
  robotoCondensed,
  headerStyles,
  bodyStyles,
  buttonStyles,
} from '@/app/fonts';
import { validateStep1, hasErrors } from '@/lib/api/helpers/signup-validation';
import { PasswordInput } from '../inputs/PasswordInput';
import { MembershipInfoCard } from '../cards/MembershipInfoCard';
import { UserRole } from '@/lib/constants/enums';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signup, resendConfirmationEmail } from '@/app/actions/auth';
import { AuthErrorCode } from '@/lib/constants/error-types';
import { ROUTES } from '@/lib/constants/routes';
import { scrollToFirstError } from '@/lib/utils';
import { APPLICATION_FEES } from '@/lib/constants/processing-fees';

export function Step1Form() {
  const {
    formData,
    updateFormData,
    errors,
    setErrors,
    hasAttemptedValidation,
    setHasAttemptedValidation,
    goToNextStep,
  } = useSignUp();

  const router = useRouter();
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showEmailConfirmation, setShowEmailConfirmation] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [resendCountdown, setResendCountdown] = useState(60);
  const [isResending, setIsResending] = useState(false);
  const [showEmailExistsError, setShowEmailExistsError] = useState(false);

  // Countdown timer for resend email
  useEffect(() => {
    if (showEmailConfirmation && resendCountdown > 0) {
      const timer = setTimeout(() => {
        setResendCountdown(resendCountdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [showEmailConfirmation, resendCountdown]);

  const handleResendEmail = async () => {
    setIsResending(true);

    try {
      // Create FormData for server action - only need email
      const formDataObj = new FormData();
      formDataObj.append('email', formData.email);

      // Call resend confirmation email action
      const result = await resendConfirmationEmail(formDataObj);

      if ('error' in result) {
        console.error(
          'Resend email error:',
          result.error,
          'Code:',
          result.code,
        );

        // Show user-friendly error message based on error code
        if (result.code === AuthErrorCode.RATE_LIMITED) {
          alert(result.error); // Could replace with a toast notification
        } else {
          alert('Failed to resend email. Please try again or contact support.');
        }
      } else {
        console.log('Email resent successfully');
        // Reset countdown to 60 seconds
        setResendCountdown(60);
      }
    } catch (error) {
      console.error('Unexpected error during resend:', error);
      alert('An unexpected error occurred. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  const handleSubmit = async () => {
    setHasAttemptedValidation(true);
    setIsSubmitting(true);

    try {
      // Client-side validation
      const validationErrors = validateStep1(formData, confirmPassword);

      if (hasErrors(validationErrors)) {
        setErrors(validationErrors);
        console.log('Step 1 validation failed:', validationErrors);
        scrollToFirstError(validationErrors);
        return;
      }

      // Determine role based on membership type
      const role =
        formData.membershipType === 'individual'
          ? UserRole.INDIVIDUAL
          : UserRole.ORGANIZATION;

      // Create FormData for server action
      const formDataObj = new FormData();
      formDataObj.append('email', formData.email);
      formDataObj.append('password', formData.password);
      formDataObj.append('role', role);

      // Call server action
      const result = await signup(formDataObj);

      if ('error' in result) {
        console.error('Signup error:', result.error, 'Code:', result.code);

        // Handle specific errors by code
        if (result.code === AuthErrorCode.VALIDATION_ERROR) {
          setErrors({
            ...validationErrors,
            email: result.error,
          });
        } else {
          setErrors({
            ...validationErrors,
            email:
              result.error || 'Failed to create account. Please try again.',
          });
        }
        return;
      }

      // Check if email already exists (returns 200 to avoid console errors)
      if (result.emailExists) {
        console.log('Email already exists, showing user message');
        setShowEmailExistsError(true);
        return;
      }

      // Success! User created - show email confirmation message
      console.log('User created successfully:', result.userId);
      setUserEmail(formData.email);
      setShowEmailConfirmation(true);
      updateFormData({ userId: result.userId });
    } catch (error) {
      console.error('Unexpected error during signup:', error);
      setErrors({
        email: 'An unexpected error occurred. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show email confirmation message after successful signup
  if (showEmailConfirmation) {
    return (
      <div
        className={`bg-card-background-gray rounded-[25px] p-8 md:p-10 lg:p-12 shadow-[0_4px_20px_rgba(0,0,0,0.1)] ${inter.className}`}
      >
        <h2
          className={`text-gray-900 mb-6 ${headerStyles.lResponsive} ${robotoCondensed.className}`}
        >
          Check your email
        </h2>
        <div className="space-y-4">
          <p className={`text-gray-700 ${bodyStyles.m}`}>
            We&apos;ve sent a confirmation email to:
          </p>
          <p className={`font-semibold text-gray-900 ${bodyStyles.m}`}>
            {userEmail}
          </p>
          <p className={`text-gray-700 ${bodyStyles.m}`}>
            Please click the link in the email to verify your account and
            complete your registration.
          </p>
          <Alert variant="info" className="mt-6">
            <AlertDescription>
              <strong>Note:</strong> The link will expire in 24 hours. If you
              don&apos;t see the email, check your spam folder.
            </AlertDescription>
          </Alert>

          {/* Resend Email Button */}
          <div className="mt-6 gap-1 flex flex-col items-start">
            <Button
              onClick={handleResendEmail}
              disabled={resendCountdown > 0 || isResending}
              variant="outline"
              size="sm"
            >
              {isResending
                ? 'Resending...'
                : resendCountdown > 0
                  ? `Resend email in ${resendCountdown}s`
                  : 'Resend email'}
            </Button>
            {resendCountdown === 0 && !isResending && (
              <p className="text-xs text-muted-foreground pl-1">
                Didn&apos;t receive the email? Click above to resend.
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`bg-card-background-gray rounded-[25px] p-8 md:p-10 lg:p-12 shadow-[0_4px_20px_rgba(0,0,0,0.1)] ${inter.className}`}
    >
      {/* Heading */}
      <h2
        className={`text-gray-900 mb-6 ${headerStyles.lResponsive} ${robotoCondensed.className}`}
      >
        Create an account
      </h2>

      {/* Email Already Exists Alert */}
      {showEmailExistsError && (
        <Alert variant="destructive" className="mb-6 w-fit">
          <AlertDescription>
            This email is already registered. Please sign in instead.
            <Link
              href={ROUTES.HOME}
              className="font-semibold underline hover:text-destructive/90"
            >
              Sign in here
            </Link>
          </AlertDescription>
        </Alert>
      )}

      {/* Form Fields */}
      <div className="space-y-5">
        {/* Email Address */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="email">
            Email Address <span className="text-destructive">*</span>
          </Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              updateFormData({ email: e.target.value });
              setShowEmailExistsError(false); // Clear error when user types
            }}
            placeholder="your.email@example.com"
            className={
              hasAttemptedValidation && errors.email ? 'border-destructive' : ''
            }
            aria-invalid={hasAttemptedValidation && !!errors.email}
          />
          {hasAttemptedValidation && errors.email && (
            <p className="text-sm text-destructive">{errors.email}</p>
          )}
        </div>

        {/* Password */}
        <PasswordInput
          label="Password"
          value={formData.password}
          error={errors.password}
          showValidation={hasAttemptedValidation}
          onChange={(value) => updateFormData({ password: value })}
          placeholder="Enter your password"
          required
          showRequirements={true}
        />

        {/* Confirm Password */}
        <PasswordInput
          label="Confirm Password"
          value={confirmPassword}
          error={errors.confirmPassword}
          showValidation={hasAttemptedValidation}
          onChange={(value) => setConfirmPassword(value)}
          placeholder="Re-enter your password"
          required
          showRequirements={false}
        />

        {/* Select Membership Type Label */}
        <h3
          className={`text-gray-900 mt-6 mb-4 ${headerStyles.xs} ${robotoCondensed.className}`}
        >
          Select membership type:
        </h3>

        {/* Membership Type Cards */}
        <div className="flex flex-col md:flex-row lg:flex-col xl:flex-row gap-4 md:gap-5 lg:gap-6 xl:gap-8">
          <MembershipInfoCard
            title="Individual"
            price={`$${APPLICATION_FEES.INDIVIDUAL}/yr`}
            description="This is the option for individuals who want to join the RPRC. the Membership fee may be waived in special cases. The $5 fee is due after application is approved."
            isSelected={formData.membershipType === 'individual'}
            onSelect={() => updateFormData({ membershipType: 'individual' })}
          />

          <MembershipInfoCard
            title="Organization"
            price={`$${APPLICATION_FEES.ORGANIZATION}/yr`}
            description="This option is for organizations that want to join or work with the RPRC. The $25 organization fee is due after application is accepted."
            isSelected={formData.membershipType === 'organization'}
            onSelect={() => updateFormData({ membershipType: 'organization' })}
          />
        </div>

        {/* Sign Up Button - Centered and Green */}
        <div className="flex flex-col items-center gap-3 mt-8">
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !formData.membershipType}
            size="lg"
          >
            {isSubmitting ? 'Creating account...' : 'Sign up'}
          </Button>

          {/* Already have account text */}
          <p className={`text-gray-700 text-center ${bodyStyles.m}`}>
            Already have an account?{' '}
            <Link
              href={ROUTES.HOME}
              className="font-medium underline"
            >
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import { useSignUp } from '@/lib/contexts/SignUpContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/Button';
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
import { createClient } from '@/lib/supabase/client';

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

  const handleSubmit = async () => {
    setHasAttemptedValidation(true);
    setIsSubmitting(true);

    try {
      // Client-side validation
      const validationErrors = validateStep1(formData, confirmPassword);
      
      if (hasErrors(validationErrors)) {
        setErrors(validationErrors);
        console.log('Step 1 validation failed:', validationErrors);
        return;
      }

      // Determine role based on membership type
      const role = formData.membershipType === 'individual' 
        ? UserRole.INDIVIDUAL 
        : UserRole.ORGANIZATION;

      // Create user with Supabase Auth (client-side for PKCE flow)
      const supabase = createClient();
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            role: role,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (signUpError) {
        console.error('Supabase signup error:', signUpError);
        
        // Handle specific errors
        if (signUpError.message.includes('already registered') || 
            signUpError.message.includes('User already registered')) {
          setErrors({
            ...validationErrors,
            email: 'Email already exists. Please login instead.',
          });
        } else {
          setErrors({
            ...validationErrors,
            email: signUpError.message || 'Failed to create account. Please try again.',
          });
        }
        return;
      }

      if (!data.user) {
        setErrors({
          ...validationErrors,
          email: 'Failed to create account. Please try again.',
        });
        return;
      }

      // Success! User created - show email confirmation message
      console.log('User created successfully:', data.user.id);
      setUserEmail(formData.email);
      setShowEmailConfirmation(true);
      updateFormData({ userId: data.user.id });
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
            Please click the link in the email to verify your account and complete your registration.
          </p>
          <Alert variant="default" className="mt-6">
            <AlertDescription>
              <strong>Note:</strong> The link will expire in 24 hours. If you don&apos;t see the email, check your spam folder.
            </AlertDescription>
          </Alert>
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
        className={`text-gray-900 mb-8 ${headerStyles.lResponsive} ${robotoCondensed.className}`}
      >
        Create an account
      </h2>

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
            onChange={(e) => updateFormData({ email: e.target.value })}
            placeholder="your.email@example.com"
            className={hasAttemptedValidation && errors.email ? 'border-destructive' : ''}
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
          className={`text-gray-900 mt-8 mb-4 ${headerStyles.xs} ${robotoCondensed.className}`}
        >
          Select membership type:
        </h3>

        {/* Membership Type Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <MembershipInfoCard
            type="individual"
            title="Individual"
            price="$5/yr"
            description="This is the option for individuals who want to join the RPRC. the Membership fee may be waived in special cases. The $5 fee is due after application is approved."
            isSelected={formData.membershipType === 'individual'}
            onSelect={() => updateFormData({ membershipType: 'individual' })}
          />

          <MembershipInfoCard
            type="organization"
            title="Organization"
            price="$25/yr"
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
              href="/"
              className="text-[#5EB42D] hover:text-[#2B8100] font-medium underline"
            >
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

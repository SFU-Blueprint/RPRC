'use client';

import React, { useState } from 'react';
import '@/app/globals.css';
import { useSignUp } from '@/lib/contexts/SignUpContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  inter,
  robotoCondensed,
  headerStyles,
  bodyStyles,
} from '@/app/fonts';
import { validateStep1, hasErrors } from '@/lib/api/helpers/signup-validation';
import { PasswordInput } from '../inputs/PasswordInput';
import { MembershipInfoCard } from '../cards/MembershipInfoCard';
import { scrollToFirstError } from '@/lib/utils';

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

  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setHasAttemptedValidation(true);
    setIsSubmitting(true);
    try {
      const validationErrors = validateStep1(formData, confirmPassword);
      if (hasErrors(validationErrors)) {
        setErrors(validationErrors);
        scrollToFirstError(validationErrors);
        return;
      }
      goToNextStep();
    } finally {
      setIsSubmitting(false);
    }
  };


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

      <p className="mb-5 text-sm text-muted-foreground">Demo only: account and application details are not saved.</p>

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
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateFormData({ email: e.target.value })}
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
            price="$5/yr"
            description="This is the option for individuals who want to join the RPRC. the Membership fee may be waived in special cases. The $5 fee is due after application is approved."
            isSelected={formData.membershipType === 'individual'}
            onSelect={() => updateFormData({ membershipType: 'individual' })}
          />

          <MembershipInfoCard
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
            {isSubmitting ? 'Continuing...' : 'Continue'}
          </Button>

        </div>
      </div>
    </div>
  );
}

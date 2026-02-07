'use client';

import React, { useState } from 'react';
import { useSignUp } from '@/lib/contexts/SignUpContext';
import { FormInput } from '@/components/signup/FormInput';
import {
  inter,
  robotoCondensed,
  headerStyles,
  bodyStyles,
  buttonStyles,
} from '@/app/fonts';
import { validateStep1, hasErrors } from '@/lib/signup-validation';
import { PasswordInput } from './PasswordInput';
import { MembershipInfoCard } from './MembershipInfoCard';

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

  // Local state for confirm password
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = () => {
    setHasAttemptedValidation(true);

    // Pass confirmPassword as parameter
    const validationErrors = validateStep1(formData, confirmPassword);
    setErrors(validationErrors);

    if (!hasErrors(validationErrors)) {
      console.log('Step 1 validation passed');
      goToNextStep();
    } else {
      console.log('Step 1 validation failed:', validationErrors);
    }
  };

  return (
    <div
      className={`bg-[#f6f6f6] rounded-[25px] p-8 md:p-10 lg:p-12 shadow-[0_4px_20px_rgba(0,0,0,0.1)] ${inter.className}`}
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
        <FormInput
          label="Email Address"
          type="email"
          value={formData.email}
          onChange={(val) => updateFormData({ email: val })}
          error={errors.email}
          placeholder=""
          required
          showValidation={hasAttemptedValidation}
        />

        {/* Password */}
        <PasswordInput
          label="Password"
          value={formData.password}
          error={errors.password}
          showValidation={hasAttemptedValidation}
          onChange={(value) => updateFormData({ password: value })}
          placeholder="Enter your password"
          required
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
          <button
            onClick={handleSubmit}
            className={`
              max-w-xs px-8 py-3
              bg-[#5EB42D]
              hover:bg-[#2B8100]
              active:bg-[#004E00]
              text-white
              font-semibold
              rounded-lg
              transition-colors
              ${buttonStyles.text}
            `}
          >
            Sign up
          </button>

          {/* Already have account text */}
          <p className={`text-gray-700 text-center ${bodyStyles.m}`}>
            Already have an account?{' '}
            <button
              type="button"
              onClick={() => {
                /* TODO: Add sign in navigation */
                console.log('Sign in clicked');
              }}
              className="text-[#5EB42D] hover:text-[#2B8100] font-medium underline"
            >
              Sign in here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import '@/app/globals.css';
import { useSignUp } from '@/lib/contexts/SignUpContext';
import { FormInput } from '@/components/signup/inputs/FormInput';
import {
  inter,
  robotoCondensed,
  headerStyles,
  bodyStyles,
  buttonStyles,
} from '@/app/fonts';
import { validateStep1, hasErrors } from '@/lib/signup-validation';
import { PasswordInput } from '../inputs/PasswordInput';
import { MembershipInfoCard } from '../cards/MembershipInfoCard';

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
      className={`bg-signup-light-gray-bg rounded-[25px] p-5 md:p-6 lg:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.1)] ${inter.className}`}
    >
      {/* Heading */}
      <h2
        className={`text-gray-900 mb-6 ${headerStyles.lResponsive} ${robotoCondensed.className}`}
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
          <button
            onClick={handleSubmit}
            className={`
              max-w-md px-8 py-3
              bg-signup-primary-green-500
              hover:bg-signup-primary-green-600
              active:bg-signup-primary-green-700
              text-white
              font-semibold
              rounded-lg
              transition-colors
              cursor-pointer
              text-lg
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
              className="text-signup-primary-green hover:text-signup-dark-green font-medium underline"
            >
              Sign in here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
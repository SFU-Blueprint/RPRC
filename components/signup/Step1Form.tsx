'use client';

import React, { useState } from 'react';
import { useSignUp } from '@/lib/contexts/SignUpContext';
import { FormInput } from '@/components/signup/FormInput';
import { inter } from '@/app/fonts';
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

  const handleSubmit = () => {
    setHasAttemptedValidation(true);

    const validationErrors = validateStep1(formData);
    setErrors(validationErrors);

    if (!hasErrors(validationErrors)) {
      console.log('Step 1 validation passed');
      goToNextStep();
    } else {
      console.log('Step 1 validation failed:', validationErrors);
    }
  };

  const [membershipType, setMembershipType] = useState<
    'individual' | 'organization' | undefined
  >();

  return (
    <div
      className={`bg-[#eeebe0] rounded-[25px] p-8 md:p-10 lg:p-12 ${inter.className}`}
    >
      {/* Heading */}
      <h2 className="text-[28px] md:text-[34px] lg:text-[40px] font-normal mb-2 text-gray-900">
        Step 1: Create an account
      </h2>

      {/* Sign Up Tab (no Login per requirement) */}
      <div className="mb-8">
        <h3 className="text-[16px] md:text-[18px] lg:text-[20px] font-semibold text-gray-900 inline-block border-b-2 border-[#90cd5f] pb-1">
          Sign Up
        </h3>
      </div>

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
        />

        {/* Confirm Password */}
        <PasswordInput
          label="Confirm Password"
          value={formData.confirmPassword}
          error={errors.confirmPassword}
          showValidation={hasAttemptedValidation}
          onChange={(value) => updateFormData({ confirmPassword: value })}
          placeholder="Re-enter your password"
        />

        {/* Membership Type */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <MembershipInfoCard
            type="individual"
            title="Individual"
            price="$5/yr"
            description="This is the option for individuals who want to join the RPRC. the Membership fee may be waived in special cases. The $5 fee is due after application is approved."
            isSelected={membershipType === 'individual'}
            onSelect={() => setMembershipType('individual')}
          />

          <MembershipInfoCard
            type="organization"
            title="Organization"
            price="$25/yr"
            description="This option is for organizations that want to join or work with the RPRC. The $25 organization fee is due after application is accepted."
            isSelected={membershipType === 'organization'}
            onSelect={() => setMembershipType('organization')}
          />
        </div>

        {/* Sign Up Button */}
        <button
          onClick={handleSubmit}
          className="w-full bg-[#383533] hover:bg-[#2a2725] text-white font-semibold text-[16px] md:text-[18px] lg:text-[20px] py-3 md:py-4 rounded-lg transition-colors mt-8"
        >
          Sign up
        </button>
      </div>
    </div>
  );
}

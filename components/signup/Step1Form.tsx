'use client';

import React from 'react';
import { useSignUp } from '@/lib/contexts/SignUpContext';
import { FormInput } from '@/components/signup/FormInput';
import { inter } from '@/app/fonts';
import { validateStep1, hasErrors } from '@/lib/signup-validation';
import { PasswordInput } from './PasswordInput';

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
          value={formData.signupEmail}
          onChange={(val) => updateFormData({ signupEmail: val })}
          error={errors.signupEmail}
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
        <div className="mt-6">
          <label className="block font-medium text-[14px] md:text-[16px] text-gray-900 mb-3">
            Membership type:
          </label>
          <div className="flex gap-8">
            {/* Individual */}
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="membershipType"
                value="individual"
                checked={formData.membershipType === 'individual'}
                onChange={(e) =>
                  updateFormData({
                    membershipType: e.target.value as
                      | 'individual'
                      | 'organization',
                  })
                }
                className="w-5 h-5 accent-[#383533] border-gray-400 focus:ring-[#383533] cursor-pointer"
              />
              <span className="ml-2 text-[14px] md:text-[16px] text-gray-900">
                Individual ($5.00)
              </span>
            </label>

            {/* Organisation */}
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="membershipType"
                value="organization"
                checked={formData.membershipType === 'organization'}
                onChange={(e) =>
                  updateFormData({
                    membershipType: e.target.value as
                      | 'individual'
                      | 'organization',
                  })
                }
                className="w-5 h-5 accent-[#383533] border-gray-400 focus:ring-[#383533] cursor-pointer"
              />
              <span className="ml-2 text-[14px] md:text-[16px] text-gray-900">
                Organisation ($25.00)
              </span>
            </label>
          </div>
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

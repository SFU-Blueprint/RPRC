'use client';

import React from 'react';
import { useSignUp } from '@/lib/contexts/SignUpContext';
import { FormInput } from './FormInput';
import { FormSelect } from './FormSelect';
import { robotoCondensed, headerStyles } from '@/app/fonts';
import { CANADIAN_PROVINCES, COUNTRIES } from '@/app/membership/signup/const';

export function AddressInformation() {
  const { formData, updateFormData, errors, hasAttemptedValidation } =
    useSignUp();

  return (
    <div className="mb-8 md:mb-10">
      {/* Section Heading */}
      <h2
        className={`text-gray-900 mb-5 sm:mb-6 ${headerStyles.sResponsive} ${robotoCondensed.className}`}
      >
        Address Information
      </h2>

      {/* Mailing Address (full width) */}
      <div className="mb-4 md:mb-5">
        <FormInput
          label="Mailing Address"
          type="text"
          value={formData.mailingAddress}
          onChange={(val) => updateFormData({ mailingAddress: val })}
          error={errors.mailingAddress}
          placeholder=""
          required
          showValidation={hasAttemptedValidation}
        />
      </div>

      {/* City + Province (2 columns) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 mb-4 md:mb-5">
        <FormInput
          label="City"
          type="text"
          value={formData.city}
          onChange={(val) => updateFormData({ city: val })}
          error={errors.city}
          placeholder=""
          required
          showValidation={hasAttemptedValidation}
        />

        <FormSelect
          label="Province"
          options={CANADIAN_PROVINCES}
          value={formData.province}
          onChange={(val) => updateFormData({ province: val })}
          error={errors.province}
          placeholder="Select a province"
          required
          showValidation={hasAttemptedValidation}
        />
      </div>

      {/* Country + Postal Code (2 columns) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
        <FormSelect
          label="Country"
          options={COUNTRIES}
          value={formData.country}
          onChange={(val) => updateFormData({ country: val })}
          error={errors.country}
          placeholder="Select a country"
          required
          showValidation={hasAttemptedValidation}
        />

        <FormInput
          label="Postal Code"
          type="text"
          value={formData.postalCode}
          onChange={(val) => updateFormData({ postalCode: val })}
          error={errors.postalCode}
          placeholder=""
          required
          showValidation={hasAttemptedValidation}
        />
      </div>
    </div>
  );
}

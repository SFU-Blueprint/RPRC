'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useSignUp } from '@/lib/contexts/SignUpContext';
import { FormInput } from './FormInput';
import { FormSelect } from './FormSelect';
import { robotoCondensed, headerStyles } from '@/app/fonts';
import { State } from 'country-state-city';
import { COUNTRIES } from '@/app/membership/signup/const';

export function AddressInformation() {
  const { formData, updateFormData, errors, hasAttemptedValidation } =
    useSignUp();

  // Set Canada as default on mount
  useEffect(() => {
    if (!formData.country) {
      updateFormData({ country: 'Canada' });
    }
  }, [formData.country, updateFormData]);

  // Get country code from country name
  const countryCode = formData.country === 'Canada' ? 'CA' : formData.country === 'United States' ? 'US' : '';

  // Get states/provinces for selected country
  const states = useMemo(() => {
    if (!countryCode) return [];
    return State.getStatesOfCountry(countryCode).map((state) => state.name);
  }, [countryCode]);

  // Handle country change
  const handleCountryChange = (countryName: string) => {
    updateFormData({ country: countryName, province: '' });
  };

  // Label for state/province based on country
  const stateLabel = formData.country === 'United States' ? 'State' : 'Province';

  return (
    <div className="mb-8 md:mb-10">
      {/* Section Heading */}
      <h2
        className={`text-gray-900 mb-5 sm:mb-6 ${headerStyles.mResponsive} ${robotoCondensed.className}`}
      >
        Address Information
      </h2>

      {/* Mailing Address + City (2 columns) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 mb-4 md:mb-5">
        <FormInput
          name="mailingAddress"
          label="Mailing Address"
          type="text"
          value={formData.mailingAddress}
          onChange={(val) => updateFormData({ mailingAddress: val })}
          error={errors.mailingAddress}
          placeholder=""
          required
          showValidation={hasAttemptedValidation}
        />
        <FormInput
          name="city"
          label="City"
          type="text"
          value={formData.city}
          onChange={(val) => updateFormData({ city: val })}
          error={errors.city}
          placeholder=""
          required
          showValidation={hasAttemptedValidation}
        />
      </div>

      {/* Country + State/Province (2 columns) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 mb-4 md:mb-5">
        <FormSelect
          name="country"
          label="Country"
          options={COUNTRIES}
          value={formData.country}
          onChange={handleCountryChange}
          error={errors.country}
          placeholder="Select a country"
          required
          showValidation={hasAttemptedValidation}
        />
        <FormSelect
          name="province"
          label={stateLabel}
          options={states}
          value={formData.province}
          onChange={(val) => updateFormData({ province: val })}
          error={errors.province}
          placeholder={`Select a ${stateLabel.toLowerCase()}`}
          required
          showValidation={hasAttemptedValidation}
        />
      </div>

      {/* Postal Code (1/2 columns) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
        <FormInput
          name="postalCode"
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

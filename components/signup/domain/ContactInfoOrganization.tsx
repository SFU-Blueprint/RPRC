'use client';

import React from 'react';
import { useSignUp } from '@/lib/contexts/SignUpContext';
import { FormInput } from '../inputs/FormInput';
import { PhoneInput } from '../inputs/PhoneInput';
import { inter, robotoCondensed, headerStyles, bodyStyles } from '@/app/fonts';
import { FormRadioButton } from '../inputs/FormRadioButton';

export function ContactInfoOrganization() {
  const { formData, updateFormData, errors, hasAttemptedValidation } =
    useSignUp();

  return (
    <div className="mb-8 md:mb-10">
      {/* Section Heading */}
      <h2
        className={`text-gray-900 mb-5 sm:mb-6 ${headerStyles.mResponsive} ${robotoCondensed.className}`}
      >
        Contact Information
      </h2>

      {/* Organization Name + Organization Email (2 columns) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 mb-4 md:mb-5">
        {/* Organization Name */}
        <FormInput
          name="fullName"
          label="Organization Name"
          type="text"
          value={formData.fullName}
          onChange={(val) => updateFormData({ fullName: val })}
          error={errors.fullName}
          placeholder=""
          required
          showValidation={hasAttemptedValidation}
        />

        {/* Organization Email Address - Pre-filled and disabled */}
        <FormInput
          name="email"
          label="Organization Email Address"
          type="email"
          value={formData.email}
          onChange={() => { }} // No-op since it's disabled
          error={errors.email}
          placeholder=""
          required
          disabled
          showValidation={hasAttemptedValidation}
        />
      </div>

      {/* Organization Representative Name + Representative Email (2 columns) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 mb-4 md:mb-5">
        {/* Organization Representative Name */}
        <FormInput
          name="representativeName"
          label="Organization Representative Name"
          type="text"
          value={formData.representativeName || ''}
          onChange={(val) => updateFormData({ representativeName: val })}
          error={errors.representativeName}
          placeholder=""
          required
          showValidation={hasAttemptedValidation}
        />

        {/* Representative Email Address (Optional) */}
        <FormInput
          name="representativeEmail"
          label="Representative Email Address (if different from the one given above)"
          type="email"
          value={formData.representativeEmail || ''}
          onChange={(val) => updateFormData({ representativeEmail: val })}
          error={errors.representativeEmail}
          placeholder=""
          showValidation={hasAttemptedValidation}
        />
      </div>

      {/* Phone Number + Phone Type (2 columns) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
        {/* Phone Number */}
        <PhoneInput
          label="Phone Number"
          value={formData.phoneNumber}
          onChange={(val) => updateFormData({ phoneNumber: val })}
          error={errors.phoneNumber}
          required
          showValidation={hasAttemptedValidation}
        />

        {/* Phone Type Radio Buttons */}
        <div>
          <label
            className={`block text-gray-700 mb-2 ${bodyStyles.m} ${inter.className}`}
          >
            Phone Type <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-6 sm:gap-8 items-center h-[44px] sm:h-[48px]">
            <FormRadioButton
              name="phoneType"
              label="Home"
              value="home"
              checked={formData.phoneType === 'home'}
              onChange={(val) =>
                updateFormData({ phoneType: val as 'home' | 'cell' })
              }
            />

            <FormRadioButton
              name="phoneType"
              label="Cell"
              value="cell"
              checked={formData.phoneType === 'cell'}
              onChange={(val) =>
                updateFormData({ phoneType: val as 'home' | 'cell' })
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}

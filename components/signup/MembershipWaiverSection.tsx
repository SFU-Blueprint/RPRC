'use client';

import React from 'react';
import { useSignUp } from '@/lib/contexts/SignUpContext';
import { FormInput } from './FormInput';
import { inter, robotoCondensed, headerStyles, bodyStyles } from '@/app/fonts';
import { FormRadioButton } from './FormRadioButton';

export function MembershipWaiverSection() {
  const { formData, updateFormData, errors, hasAttemptedValidation } =
    useSignUp();

  return (
    <div className="mb-8 md:mb-10">
      {/* Section Heading */}
      <h2
        className={`text-gray-900 mb-3 ${headerStyles.sResponsive} ${robotoCondensed.className}`}
      >
        Membership Fee Waiver (Optional)
      </h2>

      {/* Helper Text - Only ~60% width */}
      <p
        className={`text-gray-700 mb-5 max-w-3xl ${bodyStyles.s} ${inter.className}`}
      >
        We are committed to making membership accessible to everyone. Applicants
        who are unable to afford the membership fee may request a waiver.
        Requests are reviewed confidentially, and approval is subject to
        availability and organizational policy.
      </p>

      {/* Radio + Reason Input on same line (2 columns) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
        {/* Radio Button Column */}
        <div className="flex items-center">
          <label className="flex items-center cursor-pointer">
            <FormRadioButton
              name="membershipWaiver"
              label="I would like to request a waiver of the Membership fee"
              value="yes"
              checked={formData.membershipwaiver || false}
              onChange={() =>
                updateFormData({ membershipwaiver: !formData.membershipwaiver })
              }
            />
          </label>
        </div>

        {/* Reason Input Column */}
        <FormInput
          label="Reason (optional)"
          type="text"
          value={formData.waiverreason || ''}
          onChange={(val) => updateFormData({ waiverreason: val })}
          error={errors.waiverreason}
          placeholder=""
          showValidation={hasAttemptedValidation}
        />
      </div>
    </div>
  );
}

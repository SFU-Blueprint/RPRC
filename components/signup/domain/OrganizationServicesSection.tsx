'use client';

import React from 'react';
import { useSignUp } from '@/lib/contexts/SignUpContext';
import { FormTextArea } from '../inputs/FormTextArea';

export function OrganizationServicesSection() {
  const { formData, updateFormData, errors, hasAttemptedValidation } =
    useSignUp();

  return (
    <div className="mb-8 md:mb-10">
      <FormTextArea
        label="What programs or services does your organization offer?"
        value={formData.organisationservices || ''}
        onChange={(val) => updateFormData({ organisationservices: val })}
        error={errors.organisationservices}
        placeholder=""
        rows={5}
        showValidation={hasAttemptedValidation}
      />
    </div>
  );
}

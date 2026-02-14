'use client';

import React, { useState } from 'react';
import '@/app/globals.css';
import { useSignUp } from '@/lib/contexts/SignUpContext';
import { FormTextArea } from '@/components/signup/inputs/FormTextArea';
import {
  inter,
  robotoCondensed,
  headerStyles,
  buttonStyles,
} from '@/app/fonts';
import { validateStep2, hasErrors } from '@/lib/signup-validation';
import { ConfirmationModal } from '@/components/signup/layout/ConfirmationModal';
import { submitToAPI } from '@/lib/signup-mock-api';
import { ContactInfoIndividual } from '../domain/ContactInfoIndividual';
import { ContactInfoOrganization } from '../domain/ContactInfoOrganization';
import { AddressInformation } from '../inputs/AddressInformation';
import { MembershipInterests } from '../cards/MembershipInterests';
import { MembershipWaiverSection } from '../cards/MembershipWaiverSection';
import { OrganizationServicesSection } from '../domain/OrganizationServicesSection';
import { PleaseNoteBox } from '../cards/PleaseNoteBox';

export function Step2Form() {
  const {
    formData,
    updateFormData,
    errors,
    setErrors,
    hasAttemptedValidation,
    setHasAttemptedValidation,
    goToNextStep,
  } = useSignUp();

  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleSubmit = () => {
    setHasAttemptedValidation(true);

    const validationErrors = validateStep2(formData);
    setErrors(validationErrors);

    if (!hasErrors(validationErrors)) {
      console.log('Step 2 validation passed');
      setShowConfirmModal(true);
    } else {
      console.log('Step 2 validation failed:', validationErrors);
    }
  };

  const handleConfirmSubmit = () => {
    // Call mock API to submit data
    const response = submitToAPI(formData);
    console.log('API Response:', response);

    // Close modal and proceed to success page
    setShowConfirmModal(false);
    goToNextStep();
  };

  // Dynamic form heading based on membership type
  const formHeading =
    formData.membershipType === 'individual'
      ? 'Individual Membership Application Form'
      : 'Organization Membership Application Form';

  return (
    <div
      className={`bg-signup-neutral-100 rounded-[25px] shadow-[0_4px_20px_rgba(0,0,0,0.1)] p-6 sm:p-8 md:p-10 lg:p-12 w-full max-w-6xl mx-auto ${inter.className}`}
    >
      {/* Dynamic Form Heading */}
      <h1
        className={`text-gray-900 mb-8 md:mb-10 ${headerStyles.lResponsive} ${robotoCondensed.className}`}
      >
        {formHeading}
      </h1>

      {/* Contact Information - Conditional based on membership type */}
      {formData.membershipType === 'individual' ? (
        <ContactInfoIndividual />
      ) : (
        <ContactInfoOrganization />
      )}

      {/* Address Information */}
      <AddressInformation />

      {/* Membership Interests */}
      <MembershipInterests />

      {/* Why do you want to be an RPRC member? */}
      <div className="mb-8 md:mb-10">
        <FormTextArea
          label="Why do you want to be an RPRC member?"
          value={formData.whyrpcmember}
          onChange={(val) => updateFormData({ whyrpcmember: val })}
          error={errors.whyrpcmember}
          placeholder=""
          rows={6}
          showValidation={hasAttemptedValidation}
        />
      </div>

      {/* Conditional Individual/Organization Sections */}
      {formData.membershipType === 'individual' ? (
        <MembershipWaiverSection />
      ) : (
        <OrganizationServicesSection />
      )}

      {/* Please Note - Info Box */}
      <PleaseNoteBox />

      {/* Submit Application Button */}
      <div className="flex justify-center">
        <button
          onClick={handleSubmit}
          className={`
            bg-signup-primary-green-500
            hover:bg-signup-primary-green-600
            active:bg-signup-primary-green-700
            text-white
            font-semibold
            px-12 sm:px-16 md:px-20
            py-3 md:py-4
            rounded-lg
            transition-colors
            ${buttonStyles.text}
          `}
        >
          Submit Application
        </button>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleConfirmSubmit}
      />
    </div>
  );
}

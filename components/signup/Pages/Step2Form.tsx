'use client';

import { useState } from 'react';
import '@/app/globals.css';
import { useSignUp } from '@/lib/contexts/SignUpContext';
import { FormTextArea } from '@/components/signup/inputs/FormTextArea';
import { inter, robotoCondensed, headerStyles } from '@/app/fonts';
import { validateStep2, hasErrors } from '@/lib/api/helpers/signup-validation';
import { ConfirmationModal } from '@/components/signup/layout/ConfirmationModal';
import { ContactInfoIndividual } from '../domain/ContactInfoIndividual';
import { ContactInfoOrganization } from '../domain/ContactInfoOrganization';
import { AddressInformation } from '../inputs/AddressInformation';
import { MembershipInterests } from '../cards/MembershipInterests';
import { MembershipWaiverSection } from '../cards/MembershipWaiverSection';
import { OrganizationServicesSection } from '../domain/OrganizationServicesSection';
import { PleaseNoteBox } from '../cards/PleaseNoteBox';
import { scrollToFirstError } from '@/lib/utils';
import { submitApplication } from '@/app/actions/application';
import { toast } from 'sonner';

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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = () => {
    setHasAttemptedValidation(true);
    setIsSubmitting(true);

    const validationErrors = validateStep2(formData);
    if (hasErrors(validationErrors)) {
      setErrors(validationErrors);
      console.error('Step 2 validation failed:', validationErrors);
      scrollToFirstError(validationErrors);
      return;
    }
    setShowConfirmModal(true);
  };

  const handleConfirmSubmit = async () => {
    const formDataObj = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        formDataObj.append(key, JSON.stringify(value));
      } else if (value !== undefined && value !== null) {
        formDataObj.append(key, String(value));
      }
    });
    const result = await submitApplication(formDataObj);
    if (!result.success) {
      toast.error('Failed to submit your application, please try again', {
        description: `Error: ${result.error}`
      });
    }

    // Close modal
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
      className={`bg-signup-neutral-100 rounded-[25px] shadow-[0px_-1px_2px_-1px_rgba(0,0,0,0.15),0px_1px_3px_1px_rgba(0,0,0,0.15)] p-6 sm:p-8 md:p-10 lg:p-12 w-full mx-auto ${inter.className}`}
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
          required
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

      {/* Submit button + Confirmation Modal */}
      <div className="flex justify-center">
        <ConfirmationModal
          isOpen={showConfirmModal}
          onClose={() => setShowConfirmModal(false)}
          onConfirm={handleConfirmSubmit}
          handleSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}

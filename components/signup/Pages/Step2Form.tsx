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
import { InfoBox } from "@/components/ui/infobox";
import { scrollToFirstError } from '@/lib/utils';
import { toast } from 'sonner';
import { UserRole } from '@/lib/constants/enums';

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

  // const userRole = await getUserRoleById(user.id);
  const userRole = formData.membershipType;
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleSubmit = () => {
    setHasAttemptedValidation(true);

    const validationErrors = validateStep2(formData, userRole);
    if (hasErrors(validationErrors)) {
      setErrors(validationErrors);
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

    // const result = await (isIndividual ? submitIndividualApplication : submitOrganizationApplication)(formDataObj);
    const result = await Promise.resolve<
      { success: true } | { success: false; error: string }
    >({ success: true });
    if (!result.success) {
      toast.error('Failed to submit your application, please try again', {
        description: `Error: ${result.error}`,
      });
      return;
    }

    setShowConfirmModal(false);
    toast.success('Demo application submitted. No data was saved.');
    goToNextStep();
  };

  // Dynamic form heading based on user role
  const isIndividual = userRole === UserRole.INDIVIDUAL;
  const formHeading = isIndividual
    ? 'Individual Membership Application Form'
    : 'Organization Membership Application Form';

  return (
    <div
      className={`bg-signup-neutral-100 rounded-4xl shadow-[0px_-1px_2px_-1px_rgba(0,0,0,0.15),0px_1px_3px_1px_rgba(0,0,0,0.15)] p-6 sm:p-8 md:p-10 lg:p-12 w-full mx-auto ${inter.className}`}
    >
      {/* Dynamic Form Heading */}
      <h1
        className={`text-gray-900 mb-8 md:mb-10 ${headerStyles.lResponsive} ${robotoCondensed.className}`}
      >
        {formHeading}
      </h1>

      {/* Contact Information - Conditional based on user role */}
      {isIndividual ? (
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
      {isIndividual ? (
        <MembershipWaiverSection />
      ) : (
        <OrganizationServicesSection />
      )}

      {/* Please Note - Info Box */}
      <InfoBox
        heading="Please Note"
        primaryLine="To vote at the Annual General Meeting, members must be registered at least 30 days in advance."
        secondaryLine="All memberships require renewal in January. Members who join after October 1 do not need to renew until January of the next calendar year"
      />

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

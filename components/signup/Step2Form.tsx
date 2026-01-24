'use client';

import React, { useState } from 'react';
import { useSignUp } from '@/lib/contexts/SignUpContext';
import { FormInput } from '@/components/signup/FormInput';
import { FormTextArea } from '@/components/signup/FormTextArea';
import { FormSelect } from '@/components/signup/FormSelect';
import { inter } from '@/app/fonts';
import { validateStep2, hasErrors } from '@/lib/signup-validation';
import { ConfirmationModal } from '@/components/signup/ConfirmationModal';
import { submitToAPI } from '@/lib/signup-mock-api'; // Mock api call
import {
  MEMBERSHIP_INTERESTS,
  CANADIAN_PROVINCES,
} from '@/app/membership/signup/const';

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

  const toggleInterest = (interest: string) => {
    const currentInterests = formData.interests || [];
    const newInterests = currentInterests.includes(interest)
      ? currentInterests.filter((i) => i !== interest)
      : [...currentInterests, interest];
    updateFormData({ interests: newInterests });
  };

  return (
    <div
      className={`bg-[#eeebe0] rounded-[25px] p-6 sm:p-8 md:p-10 lg:p-12 w-full max-w-6xl mx-auto ${inter.className}`}
    >
      {/* Contact Information Section */}
      <div className="mb-8 md:mb-10">
        <h2 className="text-[20px] sm:text-[22px] md:text-[24px] lg:text-[26px] font-normal mb-5 sm:mb-6 text-gray-900">
          Contact Information
        </h2>

        {/* Full Name + Email Address (2 columns on larger screens) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 mb-4 md:mb-5">
          <FormInput
            label="Full Name"
            type="text"
            value={formData.fullName}
            onChange={(val) => updateFormData({ fullName: val })}
            error={errors.fullName}
            placeholder=""
            required
            showValidation={hasAttemptedValidation}
          />

          <FormInput
            label="Email Address"
            type="email"
            value={formData.contactEmail}
            onChange={(val) => updateFormData({ contactEmail: val })}
            error={errors.contactEmail}
            placeholder=""
            required
            showValidation={hasAttemptedValidation}
          />
        </div>

        {/* Phone Number + Phone Type (2 columns) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
          {/* Phone Number */}
          <FormInput
            label="Phone Number"
            type="tel"
            value={formData.phoneNumber}
            onChange={(val) => updateFormData({ phoneNumber: val })}
            error={errors.phoneNumber}
            placeholder=""
            required
            showValidation={hasAttemptedValidation}
          />

          {/* Phone Type Radio Buttons */}
          <div>
            <label className="block text-[13px] sm:text-[14px] md:text-[15px] font-medium text-gray-700 mb-2">
              Phone Type
            </label>
            <div className="flex gap-6 sm:gap-8 items-center h-[44px] sm:h-[48px]">
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="phoneType"
                  value="home"
                  checked={formData.phoneType === 'home'}
                  onChange={(e) =>
                    updateFormData({
                      phoneType: e.target.value as 'home' | 'cell',
                    })
                  }
                  className="w-4 h-4 sm:w-5 sm:h-5 accent-[#383533] border-gray-400 focus:ring-[#383533] cursor-pointer"
                />
                <span className="ml-2 text-[14px] sm:text-[15px] md:text-[16px] text-gray-900">
                  Home
                </span>
              </label>

              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="phoneType"
                  value="cell"
                  checked={formData.phoneType === 'cell'}
                  onChange={(e) =>
                    updateFormData({
                      phoneType: e.target.value as 'home' | 'cell',
                    })
                  }
                  className="w-4 h-4 sm:w-5 sm:h-5 accent-[#383533] border-gray-400 focus:ring-[#383533] cursor-pointer"
                />
                <span className="ml-2 text-[14px] sm:text-[15px] md:text-[16px] text-gray-900">
                  Cell
                </span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Address Information Section */}
      <div className="mb-8 md:mb-10">
        <h2 className="text-[20px] sm:text-[22px] md:text-[24px] lg:text-[26px] font-normal mb-5 sm:mb-6 text-gray-900">
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

          {/* Province (half width, right-aligned) */}
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

        {/* Postal Code (half width, left-aligned) */}
        <div className="md:w-1/2 md:pr-2.5">
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

      {/* Membership Interests Section */}
      <div className="mb-8 md:mb-10">
        <h2 className="text-[20px] sm:text-[22px] md:text-[24px] lg:text-[26px] font-normal mb-5 sm:mb-6 text-gray-900">
          Membership Interests
        </h2>

        {/* Interest boxes - 3 columns grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
          {MEMBERSHIP_INTERESTS.map((interest) => (
            <button
              key={interest}
              type="button"
              onClick={() => toggleInterest(interest)}
              className={`
                px-4 py-3 sm:py-4 rounded-lg text-left text-[14px] sm:text-[15px] md:text-[16px] font-normal
                transition-colors border-2
                ${
                  formData.interests?.includes(interest)
                    ? 'bg-white border-[#67b827] text-gray-900'
                    : 'bg-white border-transparent text-gray-900 hover:border-gray-300'
                }
              `}
            >
              {interest}
            </button>
          ))}
        </div>
      </div>

      {/* Why do you want to be an RPRC member? */}
      <div className="mb-8 md:mb-10">
        <h2 className="text-[20px] sm:text-[22px] md:text-[24px] lg:text-[26px] font-normal mb-5 sm:mb-6 text-gray-900">
          Why do you want to be an RPRC member?
        </h2>
        <FormTextArea
          label=""
          value={formData.reasonForJoining}
          onChange={(val) => updateFormData({ reasonForJoining: val })}
          error={errors.reasonForJoining}
          placeholder=""
          rows={6}
          required
          showValidation={hasAttemptedValidation}
        />
      </div>

      {/* Please Note - Info Box */}
      <div className="mb-8 md:mb-10 bg-[#e3f2fd] border-l-4 border-[#2196f3] p-4 sm:p-5 rounded-r-lg flex gap-3">
        {/* Info Icon */}
        <div className="flex-shrink-0">
          <svg
            className="w-5 h-5 sm:w-6 sm:h-6 text-[#2196f3]"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
        </div>

        {/* Text Content */}
        <div>
          <h3 className="font-semibold text-[14px] sm:text-[15px] md:text-[16px] text-gray-900 mb-1">
            Please Note
          </h3>
          <p className="text-[13px] sm:text-[14px] md:text-[15px] text-gray-800 leading-relaxed">
            To be eligible to vote at our Annual General Meeting, members must
            have been registered for at least 30 days prior to the meeting.
          </p>
        </div>
      </div>

      {/* Submit Application Button */}
      <div className="flex justify-center">
        <button
          onClick={handleSubmit}
          className="bg-[#90cd5f] hover:bg-[#7ab84f] text-[#383533] font-semibold text-[15px] sm:text-[16px] md:text-[18px] lg:text-[20px] px-12 sm:px-16 md:px-20 py-3 md:py-4 rounded-lg transition-colors"
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

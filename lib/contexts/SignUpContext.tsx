'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { SignUpFormData, ValidationErrors } from '@/types/signup';
import { SIGNUP_INITIAL } from '@/app/membership/signup/const';

/**
 * Context type definition
 */
type SignUpContextType = {
  // Form data
  formData: SignUpFormData;
  updateFormData: (updates: Partial<SignUpFormData>) => void;

  // Step navigation
  currentStep: number;
  setCurrentStep: (step: number) => void;
  goToNextStep: () => void;
  goToPreviousStep: () => void;

  // Validation
  errors: ValidationErrors;
  setErrors: (errors: ValidationErrors) => void;
  hasAttemptedValidation: boolean; // Track if user tried to submit/proceed (for validation)
  setHasAttemptedValidation: (attempted: boolean) => void;

  // Submission
  isSubmitting: boolean;
  setIsSubmitting: (loading: boolean) => void;
};

/**
 * Create the context
 */
const SignUpContext = createContext<SignUpContextType | undefined>(undefined);

/**
 * Provider component
 */
export function SignUpProvider({ children, initialStep = 1 }: { children: ReactNode; initialStep?: number }) {
  const [formData, setFormData] = useState<SignUpFormData>(SIGNUP_INITIAL);
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [hasAttemptedValidation, setHasAttemptedValidation] = useState(false); // NEW
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Update form data (merge with existing data)
   */
  const updateFormData = (updates: Partial<SignUpFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  /**
   * Navigate to next step
   */
  const goToNextStep = () => {
    if (currentStep < 3) {
      setCurrentStep((prev) => prev + 1);
      setErrors({}); // Clear errors when moving to next step
      setHasAttemptedValidation(false); // Reset validation flag for new step
    }
  };

  /**
   * Navigate to previous step
   */
  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      setErrors({}); // Clear errors when going back
      setHasAttemptedValidation(false); // Reset validation flag
    }
  };

  const value: SignUpContextType = {
    formData,
    updateFormData,
    currentStep,
    setCurrentStep,
    goToNextStep,
    goToPreviousStep,
    errors,
    setErrors,
    hasAttemptedValidation,
    setHasAttemptedValidation,
    isSubmitting,
    setIsSubmitting,
  };

  return (
    <SignUpContext.Provider value={value}>{children}</SignUpContext.Provider>
  );
}

/**
 * Custom hook to use the context
 * Throws error if used outside provider
 */
export function useSignUp() {
  const context = useContext(SignUpContext);
  if (!context) {
    throw new Error('useSignUp must be used within SignUpProvider');
  }
  return context;
}

'use client';

import React from 'react';
import { useSignUp } from '@/lib/contexts/SignUpContext';
import { InterestCard } from './InterestCard';
import { robotoCondensed, headerStyles } from '@/app/fonts';
import { MEMBERSHIP_INTERESTS } from '@/app/membership/signup/const';

export function MembershipInterests() {
  const { formData, updateFormData } = useSignUp();

  const toggleInterest = (interest: string) => {
    const currentInterests = formData.interests || [];
    const newInterests = currentInterests.includes(interest)
      ? currentInterests.filter((i) => i !== interest)
      : [...currentInterests, interest];

    updateFormData({ interests: newInterests });
  };

  return (
    <div className="mb-8 md:mb-10">
      {/* Section Heading */}
      <h2
        className={`text-gray-900 mb-5 sm:mb-6 ${headerStyles.sResponsive} ${robotoCondensed.className}`}
      >
        Membership Interests
      </h2>

      {/* Interest Cards - 3 columns grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
        {MEMBERSHIP_INTERESTS.map((interest) => (
          <InterestCard
            key={interest}
            label={interest}
            isSelected={formData.interests?.includes(interest) || false}
            onToggle={() => toggleInterest(interest)}
          />
        ))}
      </div>
    </div>
  );
}

'use client';

import { useSignUp } from '@/lib/contexts/SignUpContext';
import { InterestCard } from './InterestCard';
import { robotoCondensed, headerStyles } from '@/app/fonts';
import { MEMBERSHIP_INTERESTS } from '@/lib/mock-data/membership-interests';
export function MembershipInterests() {
  const { formData, updateFormData } = useSignUp();
  const membershipInterests = MEMBERSHIP_INTERESTS;

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
        className={`text-gray-900 mb-5 sm:mb-6 ${headerStyles.mResponsive} ${robotoCondensed.className}`}
      >
        Membership Interests
      </h2>

      {/* Interest Cards - 3 columns grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
        {membershipInterests.map((interest) => (
          <InterestCard
            key={interest.id}
            label={interest.name}
            isSelected={formData.interests?.includes(interest.name) || false}
            onToggle={() => toggleInterest(interest.name)}
          />
        ))}
      </div>
    </div>
  );
}

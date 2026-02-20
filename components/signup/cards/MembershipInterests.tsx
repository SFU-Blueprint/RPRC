'use client';

import { useEffect, useState } from 'react';
import { useSignUp } from '@/lib/contexts/SignUpContext';
import { InterestCard } from './InterestCard';
import { robotoCondensed, headerStyles } from '@/app/fonts';
import {
  getMembershipInterests,
  type MembershipInterestItem,
} from '@/lib/api/services/application-service';

export function MembershipInterests() {
  const { formData, updateFormData } = useSignUp();
  const [membershipInterests, setMembershipInterests] = useState<
    MembershipInterestItem[]
  >([]);

  useEffect(() => {
    const fetchInterests = async () => {
      try {
        const data = await getMembershipInterests();
        setMembershipInterests(data);
      } catch (error) {
        console.error('Error fetching interests:', error);
      }
    };
    fetchInterests();
  }, []);

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

import { MEMBERSHIP_INTERESTS as interestValues } from '@/lib/schema/interests.schema';

export const MEMBERSHIP_INTERESTS = interestValues.map((value, index) => ({
  id: index + 1,
  value,
  name: value === 'Arts+Culture' ? 'Arts + Culture' : value,
}));

export function getMembershipInterestLabel(value: string) {
  return MEMBERSHIP_INTERESTS.find((interest) => interest.value === value)?.name ?? value;
}

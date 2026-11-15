import { MEMBERSHIP_INTERESTS as interestValues } from '@/lib/schema/interests.schema';

/**
 * Interest options for the profile edit form. The values are the
 * `membership_interests.name` rows (ids 1-6, inserted in this order by the
 * baseline migration), so they double as display labels.
 */
export const MEMBERSHIP_INTERESTS = interestValues.map((value, index) => ({
  id: index + 1,
  value,
  name: value,
}));

export function getMembershipInterestLabel(value: string) {
  return (
    MEMBERSHIP_INTERESTS.find((interest) => interest.value === value)?.name ??
    value
  );
}

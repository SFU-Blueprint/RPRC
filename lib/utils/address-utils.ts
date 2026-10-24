import { State } from 'country-state-city';

import {
  ADDRESS_LABELS,
  ALLOWED_COUNTRIES,
  COUNTRY_ISO_CODES,
  DEFAULT_COUNTRY,
} from '@/lib/constants/sign-up';
import type { FieldOption } from '@/types/sign-up-fields.types';
import type { AllowedCountry } from '@/types/sign-up-form.types';

export function isAllowedCountry(
  value: string | undefined,
): value is AllowedCountry {
  return ALLOWED_COUNTRIES.some((country) => country === value);
}

/** Provinces or states of an allowed country. Empty for anything else. */
export function getRegionOptions(
  countryName: string | undefined,
): FieldOption[] {
  if (!isAllowedCountry(countryName)) return [];

  return State.getStatesOfCountry(COUNTRY_ISO_CODES[countryName]).map(
    (state) => ({ value: state.name, label: state.name }),
  );
}

/** Labels for the selected country, Canada's until one is chosen. */
export function getAddressLabels(countryName: string | undefined) {
  return ADDRESS_LABELS[
    isAllowedCountry(countryName) ? countryName : DEFAULT_COUNTRY
  ];
}

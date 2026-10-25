import { z } from 'zod';
import { Country } from 'country-state-city';

/**
 * Country names come from `country-state-city`, which is already a dependency
 * and is already the source of the province/state dropdown in
 * components/signup/inputs/AddressInformation.tsx. Keeping one source of truth
 * means the country list and the province list can never drift apart.
 */
export const COUNTRY_NAMES = Country.getAllCountries().map(
  (country) => country.name,
) as [string, ...string[]];

/** Canadian: A1A 1A1 / A1A-1A1 / A1A1A1. US: 12345 or 12345-6789. */
const CANADIAN_POSTAL_CODE_REGEX = /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/;
const US_ZIP_CODE_REGEX = /^\d{5}(-\d{4})?$/;

/**
 * Letters (including accented ones), spaces, hyphens, apostrophes and periods
 * so that real place names such as "Québec", "St. John's" and
 * "Saint-Jean-sur-Richelieu" are accepted.
 */
const ALPHABETICAL_PLACE_NAME_REGEX = /^[\p{L}][\p{L}\s.'-]*$/u;

/**
 * Street addresses are alphanumeric, plus the punctuation every real address
 * needs: "1234 No. 3 Rd, Unit #205".
 */
const STREET_ADDRESS_REGEX = /^[\p{L}\p{N}][\p{L}\p{N}\s.,'#/-]*$/u;

export const mailingAddressSchema = z
  .string({ error: 'Mailing address is required' })
  .trim()
  .min(1, { error: 'Mailing address is required' })
  .max(200, { error: 'Mailing address must be at most 200 characters' })
  .regex(STREET_ADDRESS_REGEX, {
    error: 'Mailing address can only contain letters, numbers and . , # - /',
  });

export const countrySchema = z.enum(COUNTRY_NAMES, {
  error: 'Please select a country from the list',
});

export const postalCodeSchema = z
  .string({ error: 'Postal code is required' })
  .trim()
  .refine(
    (value) =>
      CANADIAN_POSTAL_CODE_REGEX.test(value) || US_ZIP_CODE_REGEX.test(value),
    { error: 'Enter a valid postal code (e.g. V5K 1A1 or 98101)' },
  );

export const citySchema = z
  .string({ error: 'City is required' })
  .trim()
  .min(1, { error: 'City is required' })
  .max(100, { error: 'City must be at most 100 characters' })
  .regex(ALPHABETICAL_PLACE_NAME_REGEX, {
    error: 'City can only contain letters, spaces, hyphens and apostrophes',
  });

export const provinceSchema = z
  .string({ error: 'Province or state is required' })
  .trim()
  .min(1, { error: 'Province or state is required' })
  .max(100, { error: 'Province or state must be at most 100 characters' })
  .regex(ALPHABETICAL_PLACE_NAME_REGEX, {
    error:
      'Province or state can only contain letters, spaces, hyphens and apostrophes',
  });

export const addressSchema = z.object({
  mailingAddress: mailingAddressSchema,
  country: countrySchema,
  postalCode: postalCodeSchema,
  city: citySchema,
  province: provinceSchema,
});

export type Address = z.infer<typeof addressSchema>;

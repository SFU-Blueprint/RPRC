'use client';

import { useWatch } from 'react-hook-form';

import { SelectField } from '@/components/sign-up/fields/SelectField';
import { TextField } from '@/components/sign-up/fields/TextField';
import {
  COUNTRY_OPTIONS,
  SIGN_UP_FIELD_LABELS,
  SIGN_UP_SECTION_TITLES,
} from '@/lib/constants/sign-up';
import { useSharedSignUpForm } from '@/lib/hooks/useSignUpFormContext';
import { getAddressLabels, getRegionOptions } from '@/lib/utils/address-utils';

import { SignUpSection } from './SignUpSection';

/** `address.*` from the application schemas. */
export function AddressSection() {
  const { control, setValue } = useSharedSignUpForm();
  const country = useWatch({ control, name: 'address.country' });

  const regionOptions = getRegionOptions(country);
  const labels = getAddressLabels(country);

  return (
    <SignUpSection title={SIGN_UP_SECTION_TITLES.ADDRESS}>
      <TextField
        control={control}
        name="address.mailingAddress"
        label={SIGN_UP_FIELD_LABELS.MAILING_ADDRESS}
        required
        inputProps={{ autoComplete: 'address-line1' }}
      />
      <TextField
        control={control}
        name="address.city"
        label={SIGN_UP_FIELD_LABELS.CITY}
        required
        inputProps={{ autoComplete: 'address-level2' }}
      />
      <SelectField
        control={control}
        name="address.country"
        label={SIGN_UP_FIELD_LABELS.COUNTRY}
        options={COUNTRY_OPTIONS}
        placeholder="Select a country"
        required
        // A province from the previous country is never valid for the new one.
        onValueChange={() =>
          setValue('address.province', '', { shouldDirty: true })
        }
      />
      <SelectField
        control={control}
        name="address.province"
        label={labels.region}
        options={regionOptions}
        placeholder={`Select a ${labels.region.toLowerCase()}`}
        required
      />
      <TextField
        control={control}
        name="address.postalCode"
        label={labels.postalCode}
        required
        inputProps={{ autoComplete: 'postal-code' }}
      />
    </SignUpSection>
  );
}

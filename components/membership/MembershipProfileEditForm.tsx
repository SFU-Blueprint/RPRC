'use client';

import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { State } from 'country-state-city';
import { InterestCard } from '@/components/signup/cards/InterestCard';
import { FormInput } from '@/components/signup/inputs/FormInput';
import { FormRadioButton } from '@/components/signup/inputs/FormRadioButton';
import { FormSelect } from '@/components/signup/inputs/FormSelect';
import { FormTextArea } from '@/components/signup/inputs/FormTextArea';
import { PhoneInput } from '@/components/signup/inputs/PhoneInput';
import { COUNTRIES } from '@/app/membership/signup/const';
import { bodyStyles, headerStyles, inter, robotoCondensed } from '@/app/fonts';
import { getMembershipInterests, type MembershipInterestItem } from '@/lib/api/services/application-service';
import { hasErrors, validateStep2 } from '@/lib/api/helpers/signup-validation';
import { scrollToFirstError } from '@/lib/utils';
import type { MemberDashboardData } from '@/types/membership.types';
import type { ValidationErrors } from '@/types/signup';

export type MembershipProfileEditValues = {
  name: string;
  phone: string;
  phoneType: 'home' | 'cell';
  mailingAddress: string;
  city: string;
  province: string;
  country: string;
  postalCode: string;
  interests: string[];
  reason: string;
  representativeName?: string;
  representativeEmail?: string;
  servicesOffered?: string | null;
};

type Props = {
  data: MemberDashboardData;
  onSave: (values: MembershipProfileEditValues) => Promise<void>;
  isSaving: boolean;
  formId?: string;
  onDirtyChange?: (isDirty: boolean) => void;
};

const normalize = (value: string) => value.trim();

const sameInterests = (first: string[], second: string[]) => {
  const normalizeList = (items: string[]) => items.map(normalize).filter(Boolean).sort();
  const firstList = normalizeList(first);
  const secondList = normalizeList(second);

  return firstList.length === secondList.length && firstList.every((item, index) => item === secondList[index]);
};

export default function MembershipProfileEditForm({
  data,
  onSave,
  isSaving,
  formId = 'membership-profile-edit-form',
  onDirtyChange,
}: Props) {
  const isOrganization = data.type === 'organization';
  const addressFields = data.contact.addressFields;

  const initialValues = useMemo(() => ({
    fullName: data.name ?? '',
    email: data.contact.email ?? '',
    phoneNumber: data.contact.phone ?? '',
    phoneType: data.contact.phoneType ?? 'cell',
    mailingAddress: addressFields?.mailingAddress || data.contact.address || '',
    city: addressFields?.city ?? '',
    province: addressFields?.province ?? '',
    country: addressFields?.country || 'Canada',
    postalCode: addressFields?.postalCode ?? '',
    interests: data.interests ?? [],
    whyrpcmember: data.reason ?? '',
    representativeName: 'representativeName' in data ? data.representativeName ?? '' : '',
    representativeEmail: 'representativeEmail' in data ? data.representativeEmail ?? '' : '',
    organisationservices: 'servicesOffered' in data ? data.servicesOffered ?? '' : '',
  }), [addressFields, data]);

  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [hasAttemptedValidation, setHasAttemptedValidation] = useState(false);
  const [membershipInterests, setMembershipInterests] = useState<MembershipInterestItem[]>([]);

  useEffect(() => {
    getMembershipInterests()
      .then(setMembershipInterests)
      .catch((error) => console.error('Error fetching interests:', error));
  }, []);

  const changedFields = useMemo(() => {
    const fields: string[] = [];

    if (normalize(values.fullName) !== normalize(initialValues.fullName)) fields.push('name');
    if (normalize(values.phoneNumber) !== normalize(initialValues.phoneNumber)) fields.push('phone');
    if (values.phoneType !== initialValues.phoneType) fields.push('phoneType');
    if (normalize(values.mailingAddress) !== normalize(initialValues.mailingAddress)) fields.push('mailingAddress');
    if (normalize(values.city) !== normalize(initialValues.city)) fields.push('city');
    if (normalize(values.province) !== normalize(initialValues.province)) fields.push('province');
    if (normalize(values.country) !== normalize(initialValues.country)) fields.push('country');
    if (normalize(values.postalCode) !== normalize(initialValues.postalCode)) fields.push('postalCode');
    if (!sameInterests(values.interests, initialValues.interests)) fields.push('interests');
    if (normalize(values.whyrpcmember) !== normalize(initialValues.whyrpcmember)) fields.push('reason');
    if (normalize(values.representativeName) !== normalize(initialValues.representativeName)) fields.push('representativeName');
    if (normalize(values.representativeEmail) !== normalize(initialValues.representativeEmail)) fields.push('representativeEmail');
    if (normalize(values.organisationservices) !== normalize(initialValues.organisationservices)) fields.push('servicesOffered');

    return fields;
  }, [initialValues, values]);

  useEffect(() => {
    onDirtyChange?.(changedFields.length > 0);
  }, [changedFields.length, onDirtyChange]);

  const countryCode =
    values.country === 'Canada' ? 'CA' : values.country === 'United States' ? 'US' : '';

  const states = useMemo(() => {
    if (!countryCode) return [];
    return State.getStatesOfCountry(countryCode).map((state) => state.name);
  }, [countryCode]);

  const updateValues = (updates: Partial<typeof values>) => {
    setValues((current) => ({ ...current, ...updates }));
  };

  const handleCountryChange = (country: string) => {
    updateValues({ country, province: '' });
  };

  const toggleInterest = (interest: string) => {
    updateValues({
      interests: values.interests.includes(interest)
        ? values.interests.filter((item) => item !== interest)
        : [...values.interests, interest],
    });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (changedFields.length === 0 || isSaving) return;

    setHasAttemptedValidation(true);

    const validationErrors = validateStep2(values, data.type ?? undefined);
    if (hasErrors(validationErrors)) {
      setErrors(validationErrors);
      scrollToFirstError(validationErrors);
      return;
    }

    setErrors({});

    await onSave({
      name: values.fullName.trim(),
      phone: values.phoneNumber.trim(),
      phoneType: values.phoneType,
      mailingAddress: values.mailingAddress.trim(),
      city: values.city.trim(),
      province: values.province.trim(),
      country: values.country.trim(),
      postalCode: values.postalCode.trim(),
      interests: values.interests,
      reason: values.whyrpcmember.trim(),
      representativeName: values.representativeName.trim(),
      representativeEmail: values.representativeEmail.trim(),
      servicesOffered: values.organisationservices.trim(),
    });
  };

  return (
    <form id={formId} onSubmit={handleSubmit} className="flex flex-col gap-8">
      <section>
        <h3 className={`text-gray-900 mb-5 sm:mb-6 ${headerStyles.mResponsive} ${robotoCondensed.className}`}>
          Contact Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 mb-4 md:mb-5">
          <FormInput
            name="fullName"
            label={isOrganization ? 'Organization Name' : 'Name'}
            type="text"
            value={values.fullName}
            onChange={(fullName) => updateValues({ fullName })}
            error={errors.fullName}
            required
            showValidation={hasAttemptedValidation}
          />
          <FormInput
            name="email"
            label={isOrganization ? 'Organization Email Address' : 'Email Address'}
            type="email"
            value={values.email}
            onChange={() => { }}
            error={errors.email}
            required
            disabled
            showValidation={hasAttemptedValidation}
          />
        </div>
        {isOrganization && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 mb-4 md:mb-5">
            <FormInput
              name="representativeName"
              label="Organization Representative Name"
              type="text"
              value={values.representativeName}
              onChange={(representativeName) => updateValues({ representativeName })}
              error={errors.representativeName}
              required
              showValidation={hasAttemptedValidation}
            />
            <FormInput
              name="representativeEmail"
              label="Representative Email Address (if different from the one given above)"
              type="email"
              value={values.representativeEmail}
              onChange={(representativeEmail) => updateValues({ representativeEmail })}
              error={errors.representativeEmail}
              showValidation={hasAttemptedValidation}
            />
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
          <PhoneInput
            label="Phone Number"
            value={values.phoneNumber}
            onChange={(phoneNumber) => updateValues({ phoneNumber })}
            error={errors.phoneNumber}
            required
            showValidation={hasAttemptedValidation}
          />
          <div>
            <label className={`block text-gray-700 mb-1 ${bodyStyles.m} ${inter.className}`}>
              Phone Type <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-6 sm:gap-8 items-center min-h-10">
              <FormRadioButton
                name="phoneType"
                label="Home"
                value="home"
                checked={values.phoneType === 'home'}
                onChange={(phoneType) => updateValues({ phoneType: phoneType as 'home' | 'cell' })}
              />
              <FormRadioButton
                name="phoneType"
                label="Cell"
                value="cell"
                checked={values.phoneType === 'cell'}
                onChange={(phoneType) => updateValues({ phoneType: phoneType as 'home' | 'cell' })}
              />
            </div>
          </div>
        </div>
      </section>

      <section>
        <h3 className={`text-gray-900 mb-5 sm:mb-6 ${headerStyles.mResponsive} ${robotoCondensed.className}`}>
          Address Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 mb-4 md:mb-5">
          <FormInput
            name="mailingAddress"
            label="Mailing Address"
            type="text"
            value={values.mailingAddress}
            onChange={(mailingAddress) => updateValues({ mailingAddress })}
            error={errors.mailingAddress}
            required
            showValidation={hasAttemptedValidation}
          />
          <FormInput
            name="city"
            label="City"
            type="text"
            value={values.city}
            onChange={(city) => updateValues({ city })}
            error={errors.city}
            required
            showValidation={hasAttemptedValidation}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 mb-4 md:mb-5">
          <FormSelect
            name="country"
            label="Country"
            options={COUNTRIES}
            value={values.country}
            onChange={handleCountryChange}
            error={errors.country}
            placeholder="Select a country"
            required
            showValidation={hasAttemptedValidation}
          />
          <FormSelect
            name="province"
            label={values.country === 'United States' ? 'State' : 'Province'}
            options={states}
            value={values.province}
            onChange={(province) => updateValues({ province })}
            error={errors.province}
            placeholder={`Select ${values.country === 'United States' ? 'a state' : 'a province'}`}
            required
            showValidation={hasAttemptedValidation}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
          <FormInput
            name="postalCode"
            label="Postal Code"
            type="text"
            value={values.postalCode}
            onChange={(postalCode) => updateValues({ postalCode })}
            error={errors.postalCode}
            required
            showValidation={hasAttemptedValidation}
          />
        </div>
      </section>

      <section>
        <h3 className={`text-gray-900 mb-5 sm:mb-6 ${headerStyles.mResponsive} ${robotoCondensed.className}`}>
          Membership Interests
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          {membershipInterests.map((interest) => (
            <InterestCard
              key={interest.id}
              label={interest.name}
              isSelected={values.interests.includes(interest.name)}
              onToggle={() => toggleInterest(interest.name)}
            />
          ))}
        </div>
      </section>

      <FormTextArea
        label="Why do you want to be an RPRC member?"
        value={values.whyrpcmember}
        onChange={(whyrpcmember) => updateValues({ whyrpcmember })}
        error={errors.whyrpcmember}
        rows={6}
        required
        showValidation={hasAttemptedValidation}
      />

      {isOrganization && (
        <FormTextArea
          label="What programs or services does your organization offer?"
          value={values.organisationservices}
          onChange={(organisationservices) => updateValues({ organisationservices })}
          error={errors.organisationservices}
          rows={5}
          showValidation={hasAttemptedValidation}
        />
      )}

    </form>
  );
}

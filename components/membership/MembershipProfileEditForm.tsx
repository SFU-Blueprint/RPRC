'use client';

import { useEffect, useMemo } from 'react';
import { Controller, useForm, useWatch, type FieldErrors, type SubmitErrorHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { State } from 'country-state-city';
import { InterestCard } from '@/components/signup/cards/InterestCard';
import { FormInput } from '@/components/signup/inputs/FormInput';
import { FormRadioButton } from '@/components/signup/inputs/FormRadioButton';
import { FormSelect } from '@/components/signup/inputs/FormSelect';
import { FormTextArea } from '@/components/signup/inputs/FormTextArea';
import { PhoneInput } from '@/components/signup/inputs/PhoneInput';
import { COUNTRIES } from '@/lib/constants/signup';
import { bodyStyles, headerStyles, inter, robotoCondensed } from '@/lib/fonts';
import { MEMBERSHIP_INTERESTS } from '@/lib/mock-data';
import { memberProfileEditSchema, type MemberProfileEditInput, type MemberProfileEditValues } from '@/lib/schema/member-profile-edit.schema';
import type { MemberDashboardData, OrganizationMemberDashboardData } from '@/types/membership.types';

export type MembershipProfileEditValues = MemberProfileEditValues;

type Props = {
  data: MemberDashboardData;
  onSave: (values: MembershipProfileEditValues) => Promise<void>;
  isSaving: boolean;
  formId?: string;
  onDirtyChange?: (isDirty: boolean) => void;
};

const normalize = (value?: string | null) => (value ?? '').trim();
const phoneDigits = (value?: string | null) => (value ?? '').replace(/\D/g, '');

const sameInterests = (first: string[], second: string[]) => {
  const normalizeList = (items: string[]) => items.map(normalize).filter(Boolean).sort();
  const firstList = normalizeList(first);
  const secondList = normalizeList(second);

  return firstList.length === secondList.length && firstList.every((item, index) => item === secondList[index]);
};

function findFirstErrorPath(errors: FieldErrors<MemberProfileEditInput>, parent = ''): string | undefined {
  for (const [key, value] of Object.entries(errors)) {
    if (!value || typeof value !== 'object') continue;
    const path = parent ? `${parent}.${key}` : key;
    if ('message' in value && typeof value.message === 'string') return path;
    const nestedPath = findFirstErrorPath(value as FieldErrors<MemberProfileEditInput>, path);
    if (nestedPath) return nestedPath;
  }

  return undefined;
}

const errorTargetIds: Record<string, string> = {
  phoneNumber: 'Phone Number',
  'address.mailingAddress': 'Mailing Address',
  'address.city': 'City',
  'address.country': 'Country',
  'address.province': 'Province',
  'address.postalCode': 'Postal Code',
  membershipInterests: 'membership-interests-heading',
  motivation: 'Why do you want to be an RPRC member?',
  representativeName: 'Organization Representative Name',
  representativeEmail: 'Representative Email Address (if different from the one given above)',
  programsOrServices: 'What programs or services does your organization offer?',
};

export default function MembershipProfileEditForm({
  data,
  onSave,
  isSaving,
  formId = 'membership-profile-edit-form',
  onDirtyChange,
}: Props) {
  const isOrganization = data.type === 'organization';
  const organizationData = isOrganization ? data as OrganizationMemberDashboardData : null;
  const addressFields = data.contact.addressFields;

  const initialValues = useMemo<MemberProfileEditInput>(() => {
    const membershipInterests = (data.interests ?? []) as MemberProfileEditInput['membershipInterests'];
    const common = {
      name: data.name ?? '',
      email: data.contact.email ?? '',
      phoneNumber: data.contact.phone ?? '',
      phoneType: data.contact.phoneType ?? 'cell',
      address: {
        mailingAddress: addressFields?.mailingAddress ?? '',
        city: addressFields?.city ?? '',
        province: addressFields?.province ?? '',
        country: addressFields?.country || 'Canada',
        postalCode: addressFields?.postalCode ?? '',
      },
      membershipInterests,
      motivation: data.reason ?? '',
    };

    if (organizationData) {
      return {
        ...common,
        role: 'organization',
        representativeName: organizationData.representativeName ?? '',
        representativeEmail: organizationData.representativeEmail ?? '',
        programsOrServices: organizationData.servicesOffered ?? '',
      };
    }

    return { ...common, role: 'individual' };
  }, [addressFields, data, organizationData]);

  const {
    control,
    handleSubmit,
    formState: { submitCount },
    setValue,
  } = useForm<MemberProfileEditInput, undefined, MemberProfileEditValues>({
    resolver: zodResolver(memberProfileEditSchema),
    defaultValues: initialValues,
    mode: 'onSubmit',
  });

  const values = (useWatch({ control }) ?? initialValues) as MemberProfileEditInput;
  const country = useWatch({ control, name: 'address.country' }) ?? initialValues.address.country;
  const changedFields = useMemo(() => {
    const fields: string[] = [];

    if (normalize(values.name) !== normalize(initialValues.name)) fields.push('name');
    if (phoneDigits(values.phoneNumber) !== phoneDigits(initialValues.phoneNumber)) fields.push('phoneNumber');
    if (values.phoneType !== initialValues.phoneType) fields.push('phoneType');
    if (normalize(values.address.mailingAddress) !== normalize(initialValues.address.mailingAddress)) fields.push('mailingAddress');
    if (normalize(values.address.city) !== normalize(initialValues.address.city)) fields.push('city');
    if (normalize(values.address.province) !== normalize(initialValues.address.province)) fields.push('province');
    if (normalize(values.address.country) !== normalize(initialValues.address.country)) fields.push('country');
    if (normalize(values.address.postalCode) !== normalize(initialValues.address.postalCode)) fields.push('postalCode');
    if (!sameInterests(values.membershipInterests, initialValues.membershipInterests)) fields.push('membershipInterests');
    if (normalize(values.motivation) !== normalize(initialValues.motivation)) fields.push('motivation');
    if (values.role === 'organization' && initialValues.role === 'organization') {
      if (normalize(values.representativeName) !== normalize(initialValues.representativeName)) fields.push('representativeName');
      if (normalize(values.representativeEmail) !== normalize(initialValues.representativeEmail)) fields.push('representativeEmail');
      if (normalize(values.programsOrServices) !== normalize(initialValues.programsOrServices)) fields.push('programsOrServices');
    }

    return fields;
  }, [initialValues, values]);

  useEffect(() => {
    onDirtyChange?.(changedFields.length > 0);
  }, [changedFields.length, onDirtyChange]);

  const countryCode = country === 'Canada' ? 'CA' : country === 'United States' ? 'US' : '';
  const states = useMemo(
    () => (countryCode ? State.getStatesOfCountry(countryCode).map((state) => state.name) : []),
    [countryCode],
  );

  const handleInvalid: SubmitErrorHandler<MemberProfileEditInput> = (errors) => {
    const firstErrorPath = findFirstErrorPath(errors);
    if (!firstErrorPath) return;

    const targetId = errorTargetIds[firstErrorPath] ?? firstErrorPath;
    const element = document.getElementsByName(firstErrorPath)[0]
      ?? document.getElementById(targetId);
    element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const handleValidSubmit = async (submittedValues: MemberProfileEditValues) => {
    if (changedFields.length === 0 || isSaving) return;
    await onSave(submittedValues);
  };

  const showValidation = submitCount > 0;

  return (
    <form id={formId} onSubmit={handleSubmit(handleValidSubmit, handleInvalid)} className="flex flex-col gap-8">
      <section>
        <h3 className={`text-gray-900 mb-5 sm:mb-6 ${headerStyles.mResponsive} ${robotoCondensed.className}`}>
          Contact Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 mb-4 md:mb-5">
          <Controller
            control={control}
            name="name"
            render={({ field, fieldState }) => (
              <FormInput
                name="name"
                label={isOrganization ? 'Organization Name' : 'Name'}
                type="text"
                value={field.value}
                onChange={field.onChange}
                error={fieldState.error?.message}
                required
                showValidation={showValidation}
              />
            )}
          />
          <Controller
            control={control}
            name="email"
            render={({ field, fieldState }) => (
              <FormInput
                name="email"
                label={isOrganization ? 'Organization Email Address' : 'Email Address'}
                type="email"
                value={field.value}
                onChange={field.onChange}
                error={fieldState.error?.message}
                required
                disabled
                showValidation={showValidation}
              />
            )}
          />
        </div>
        {isOrganization && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 mb-4 md:mb-5">
            <Controller
              control={control}
              name="representativeName"
              render={({ field, fieldState }) => (
                <FormInput
                  name="representativeName"
                  label="Organization Representative Name"
                  type="text"
                  value={field.value ?? ''}
                  onChange={field.onChange}
                  error={fieldState.error?.message}
                  required
                  showValidation={showValidation}
                />
              )}
            />
            <Controller
              control={control}
              name="representativeEmail"
              render={({ field, fieldState }) => (
                <FormInput
                  name="representativeEmail"
                  label="Representative Email Address (if different from the one given above)"
                  type="email"
                  value={field.value ?? ''}
                  onChange={field.onChange}
                  error={fieldState.error?.message}
                  showValidation={showValidation}
                />
              )}
            />
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
          <Controller
            control={control}
            name="phoneNumber"
            render={({ field, fieldState }) => (
              <PhoneInput
                label="Phone Number"
                value={field.value}
                onChange={field.onChange}
                error={fieldState.error?.message}
                required
                showValidation={showValidation}
              />
            )}
          />
          <Controller
            control={control}
            name="phoneType"
            render={({ field, fieldState }) => (
              <div>
                <label className={`block text-gray-700 mb-1 ${bodyStyles.m} ${inter.className}`}>
                  Phone Type <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-6 sm:gap-8 items-center min-h-10">
                  <FormRadioButton
                    name="phoneType"
                    label="Home"
                    value="home"
                    checked={field.value === 'home'}
                    onChange={field.onChange}
                  />
                  <FormRadioButton
                    name="phoneType"
                    label="Cell"
                    value="cell"
                    checked={field.value === 'cell'}
                    onChange={field.onChange}
                  />
                </div>
                {showValidation && fieldState.error?.message && (
                  <p className="mt-1 text-sm text-destructive" role="alert">
                    {fieldState.error.message}
                  </p>
                )}
              </div>
            )}
          />
        </div>
      </section>

      <section>
        <h3 className={`text-gray-900 mb-5 sm:mb-6 ${headerStyles.mResponsive} ${robotoCondensed.className}`}>
          Address Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 mb-4 md:mb-5">
          <Controller
            control={control}
            name="address.mailingAddress"
            render={({ field, fieldState }) => (
              <FormInput
                name="address.mailingAddress"
                label="Mailing Address"
                type="text"
                value={field.value}
                onChange={field.onChange}
                error={fieldState.error?.message}
                required
                showValidation={showValidation}
              />
            )}
          />
          <Controller
            control={control}
            name="address.city"
            render={({ field, fieldState }) => (
              <FormInput
                name="address.city"
                label="City"
                type="text"
                value={field.value}
                onChange={field.onChange}
                error={fieldState.error?.message}
                required
                showValidation={showValidation}
              />
            )}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 mb-4 md:mb-5">
          <Controller
            control={control}
            name="address.country"
            render={({ field, fieldState }) => (
              <FormSelect
                name="address.country"
                label="Country"
                options={COUNTRIES}
                value={field.value}
                onChange={(nextCountry) => {
                  field.onChange(nextCountry);
                  setValue('address.province', '', { shouldDirty: true, shouldTouch: true });
                }}
                error={fieldState.error?.message}
                placeholder="Select a country"
                required
                showValidation={showValidation}
              />
            )}
          />
          <Controller
            control={control}
            name="address.province"
            render={({ field, fieldState }) => (
              <FormSelect
                name="address.province"
                label={country === 'United States' ? 'State' : 'Province'}
                options={states}
                value={field.value}
                onChange={field.onChange}
                error={fieldState.error?.message}
                placeholder={`Select ${country === 'United States' ? 'a state' : 'a province'}`}
                required
                showValidation={showValidation}
              />
            )}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
          <Controller
            control={control}
            name="address.postalCode"
            render={({ field, fieldState }) => (
              <FormInput
                name="address.postalCode"
                label="Postal Code"
                type="text"
                value={field.value}
                onChange={field.onChange}
                error={fieldState.error?.message}
                required
                showValidation={showValidation}
              />
            )}
          />
        </div>
      </section>

      <section>
        <h3 id="membership-interests-heading" className={`text-gray-900 mb-5 sm:mb-6 ${headerStyles.mResponsive} ${robotoCondensed.className}`}>
          Membership Interests
        </h3>
        <Controller
          control={control}
          name="membershipInterests"
          render={({ field, fieldState }) => {
            const selected = field.value as string[];
            return (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                  {MEMBERSHIP_INTERESTS.map((interest) => (
                    <InterestCard
                      key={interest.id}
                      label={interest.name}
                      isSelected={selected.includes(interest.value)}
                      onToggle={() => field.onChange(
                        selected.includes(interest.value)
                          ? selected.filter((item) => item !== interest.value)
                          : [...selected, interest.value],
                      )}
                    />
                  ))}
                </div>
                {showValidation && fieldState.error?.message && (
                  <p className="mt-2 text-sm text-destructive" role="alert">
                    {fieldState.error.message}
                  </p>
                )}
              </>
            );
          }}
        />
      </section>

      <Controller
        control={control}
        name="motivation"
        render={({ field, fieldState }) => (
          <FormTextArea
            label="Why do you want to be an RPRC member?"
            value={field.value}
            onChange={field.onChange}
            error={fieldState.error?.message}
            rows={6}
            required
            showValidation={showValidation}
          />
        )}
      />

      {isOrganization && (
        <Controller
          control={control}
          name="programsOrServices"
          render={({ field, fieldState }) => (
            <FormTextArea
              label="What programs or services does your organization offer?"
              value={field.value ?? ''}
              onChange={field.onChange}
              error={fieldState.error?.message}
              rows={5}
              showValidation={showValidation}
            />
          )}
        />
      )}
    </form>
  );
}

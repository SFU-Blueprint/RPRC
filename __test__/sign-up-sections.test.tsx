import { describe, expect, expectTypeOf, test } from 'vitest';
import { act, fireEvent, render, screen, within } from '@testing-library/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from 'react-hook-form';

import { TextField } from '@/components/sign-up/fields/TextField';
import { AccountSection } from '@/components/sign-up/sections/AccountSection';
import { AddressSection } from '@/components/sign-up/sections/AddressSection';
import { ContactSection } from '@/components/sign-up/sections/ContactSection';
import { InterestsSection } from '@/components/sign-up/sections/InterestsSection';
import { MotivationSection } from '@/components/sign-up/sections/MotivationSection';
import { ProgramsSection } from '@/components/sign-up/sections/ProgramsSection';
import { WaiverSection } from '@/components/sign-up/sections/WaiverSection';
import {
  ALLOWED_COUNTRIES,
  DEFAULT_COUNTRY,
  SIGN_UP_FIELD_LABELS,
  SIGN_UP_SECTION_TITLES,
} from '@/lib/constants/sign-up';
import { useOrganizationSignUpForm } from '@/lib/hooks/useSignUpFormContext';
import { getRegionOptions } from '@/lib/utils/address-utils';
import {
  countrySchema,
  individualSchema,
  organizationSchema,
} from '@/lib/schema';
import type {
  IndividualSignUpInput,
  IndividualSignUpValues,
  OrganizationSignUpInput,
  OrganizationSignUpValues,
  SharedSignUpInput,
} from '@/types/sign-up-form.types';

const sharedDefaults = {
  membershipInterests: [],
  address: { country: DEFAULT_COUNTRY },
};

function IndividualSections() {
  const form = useForm<IndividualSignUpInput, unknown, IndividualSignUpValues>({
    resolver: zodResolver(individualSchema),
    defaultValues: sharedDefaults,
  });

  return (
    <FormProvider {...form}>
      <form noValidate onSubmit={form.handleSubmit(() => {})}>
        <AccountSection />
        <ContactSection nameLabel={SIGN_UP_FIELD_LABELS.NAME} />
        <AddressSection />
        <InterestsSection />
        <MotivationSection />
        <WaiverSection />
        <button type="submit">Submit</button>
      </form>
    </FormProvider>
  );
}

function OrganizationEmailField() {
  const { control } = useOrganizationSignUpForm();
  return (
    <TextField
      control={control}
      name="organizationEmail"
      type="email"
      label={SIGN_UP_FIELD_LABELS.ORGANIZATION_EMAIL}
    />
  );
}

function OrganizationSections() {
  const form = useForm<
    OrganizationSignUpInput,
    unknown,
    OrganizationSignUpValues
  >({
    resolver: zodResolver(organizationSchema),
    defaultValues: sharedDefaults,
  });

  return (
    <FormProvider {...form}>
      <form noValidate onSubmit={form.handleSubmit(() => {})}>
        <AccountSection />
        <ContactSection nameLabel={SIGN_UP_FIELD_LABELS.REPRESENTATIVE_NAME}>
          <OrganizationEmailField />
        </ContactSection>
        <AddressSection />
        <InterestsSection />
        <MotivationSection />
        <ProgramsSection />
      </form>
    </FormProvider>
  );
}

/** Names of every rendered form control, e.g. `address.city`. */
function renderedFieldNames(): Set<string> {
  return new Set(
    [...document.querySelectorAll('[name]')]
      .map((element) => element.getAttribute('name') ?? '')
      .filter(Boolean),
  );
}

function legendTexts(): string[] {
  return [...document.querySelectorAll('legend')].map(
    (legend) => legend.textContent ?? '',
  );
}

/** Opens a Radix select by keyboard and picks an option. */
function chooseOption(trigger: HTMLElement, optionName: string) {
  fireEvent.keyDown(trigger, { key: 'Enter' });
  const option = screen.getByRole('option', { name: optionName });
  fireEvent.keyDown(option, { key: 'Enter' });
}

describe('shared section types', () => {
  test('both schemas agree on every shared field', () => {
    expectTypeOf<IndividualSignUpInput>().toExtend<SharedSignUpInput>();
    expectTypeOf<OrganizationSignUpInput>().toExtend<SharedSignUpInput>();
  });
});

describe('individual sections', () => {
  test('render every individualSchema field, each section as a fieldset', () => {
    render(<IndividualSections />);

    const names = renderedFieldNames();
    for (const name of [
      'email',
      'password',
      'confirmPassword',
      'name',
      'phoneNumber',
      'phoneType',
      'address.mailingAddress',
      'address.city',
      'address.country',
      'address.province',
      'address.postalCode',
      'membershipInterests',
      'motivation',
      'waiverRequest',
    ]) {
      expect(names, name).toContain(name);
    }

    expect(legendTexts()).toEqual(
      expect.arrayContaining([
        SIGN_UP_SECTION_TITLES.ACCOUNT,
        SIGN_UP_SECTION_TITLES.CONTACT,
        SIGN_UP_SECTION_TITLES.ADDRESS,
        SIGN_UP_SECTION_TITLES.INTERESTS,
        SIGN_UP_SECTION_TITLES.MOTIVATION,
        SIGN_UP_SECTION_TITLES.WAIVER,
      ]),
    );
    expect(screen.queryByText(SIGN_UP_SECTION_TITLES.PROGRAMS)).toBeNull();
  });

  test('interests show friendly labels but keep schema values', () => {
    render(<IndividualSections />);

    const artsCulture = screen.getByLabelText('Arts + Culture');
    expect(artsCulture.getAttribute('value')).toBe('Arts+Culture');
  });

  test('waiver reason appears only when requested and is cleared when unticked', () => {
    render(<IndividualSections />);
    const reasonLabel = new RegExp(
      SIGN_UP_FIELD_LABELS.WAIVER_REASON.replace(/[()]/g, '\\$&'),
    );

    expect(screen.queryByLabelText(reasonLabel)).toBeNull();

    const request = screen.getByLabelText(SIGN_UP_FIELD_LABELS.WAIVER_REQUEST);
    fireEvent.click(request);
    fireEvent.change(screen.getByLabelText(reasonLabel), {
      target: { value: 'Fixed income' },
    });

    fireEvent.click(request);
    expect(screen.queryByLabelText(reasonLabel)).toBeNull();

    // Re-ticking shows an empty reason: the old one was cleared, not hidden.
    fireEvent.click(request);
    expect(
      (screen.getByLabelText(reasonLabel) as HTMLTextAreaElement).value,
    ).toBe('');
  });
});

describe('address section', () => {
  const countryTrigger = () =>
    screen.getByRole('combobox', { name: /Country/ });

  test('defaults to Canada with a province list', () => {
    render(<IndividualSections />);

    expect(countryTrigger().textContent).toContain('Canada');
    const province = screen.getByRole('combobox', { name: /^Province/ });
    fireEvent.keyDown(province, { key: 'Enter' });
    expect(
      screen.getByRole('option', { name: 'British Columbia' }),
    ).toBeDefined();
  });

  test('changing country clears the province and relabels the fields', () => {
    render(<IndividualSections />);

    chooseOption(
      screen.getByRole('combobox', { name: /^Province/ }),
      'Ontario',
    );
    expect(
      screen.getByRole('combobox', { name: /^Province/ }).textContent,
    ).toContain('Ontario');

    chooseOption(countryTrigger(), 'United States');

    const state = screen.getByRole('combobox', { name: /^State/ });
    expect(state.textContent).not.toContain('Ontario');
    expect(screen.getByLabelText(/^ZIP Code/)).toBeDefined();
  });

  test('offers exactly the allowed countries', () => {
    render(<IndividualSections />);

    fireEvent.keyDown(countryTrigger(), { key: 'Enter' });
    expect(
      screen.getAllByRole('option').map((option) => option.textContent),
    ).toEqual([...ALLOWED_COUNTRIES]);
  });

  test('every allowed country is schema-valid and has regions', () => {
    for (const country of ALLOWED_COUNTRIES) {
      expect(countrySchema.safeParse(country).success, country).toBe(true);
      expect(getRegionOptions(country).length, country).toBeGreaterThan(0);
    }
  });

  test('shows the schema error when the province is missing', async () => {
    render(<IndividualSections />);

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Submit' }));
    });

    const addressSection = screen
      .getByText(SIGN_UP_SECTION_TITLES.ADDRESS)
      .closest('fieldset')!;
    expect(
      within(addressSection).getByText('Province or state is required'),
    ).toBeDefined();
  });
});

describe('organization sections', () => {
  test('render every organizationSchema field and no waiver', () => {
    render(<OrganizationSections />);

    const names = renderedFieldNames();
    for (const name of ['organizationEmail', 'programsOrServices', 'name']) {
      expect(names, name).toContain(name);
    }
    expect(names).not.toContain('waiverRequest');
    expect(
      screen.getByLabelText(
        new RegExp(`^${SIGN_UP_FIELD_LABELS.REPRESENTATIVE_NAME}`),
      ),
    ).toBeDefined();
    expect(screen.getByText(SIGN_UP_SECTION_TITLES.PROGRAMS)).toBeDefined();
  });
});

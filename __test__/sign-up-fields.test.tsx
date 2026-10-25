import { describe, expect, test, vi } from 'vitest';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useWatch } from 'react-hook-form';
import type { z } from 'zod';

import { CheckboxField } from '@/components/sign-up/fields/CheckboxField';
import { CheckboxGroupField } from '@/components/sign-up/fields/CheckboxGroupField';
import { PasswordField } from '@/components/sign-up/fields/PasswordField';
import { PhoneField } from '@/components/sign-up/fields/PhoneField';
import { RadioGroupField } from '@/components/sign-up/fields/RadioGroupField';
import { SelectField } from '@/components/sign-up/fields/SelectField';
import { TextareaField } from '@/components/sign-up/fields/TextareaField';
import { TextField } from '@/components/sign-up/fields/TextField';
import {
  individualSchema,
  MEMBERSHIP_INTERESTS,
  MOTIVATION_MAX_WORDS,
  organizationSchema,
  PHONE_TYPES,
} from '@/lib/schema';

const toOptions = (values: readonly string[]) =>
  values.map((value) => ({ value, label: value }));

type OrgInput = z.input<typeof organizationSchema>;
type OrgOutput = z.output<typeof organizationSchema>;

function OrganizationHarness({
  onSubmit,
  disabled = false,
}: {
  onSubmit: (values: OrgOutput) => void;
  disabled?: boolean;
}) {
  const form = useForm<OrgInput, unknown, OrgOutput>({
    resolver: zodResolver(organizationSchema),
    mode: 'onTouched',
    defaultValues: {
      membershipInterests: [],
      address: { country: 'Canada', province: 'British Columbia' },
    },
  });
  const { control } = form;

  return (
    <form noValidate onSubmit={form.handleSubmit(onSubmit)}>
      <fieldset disabled={disabled}>
        <TextField control={control} name="name" label="Name" required />
        <TextField
          control={control}
          name="email"
          label="Email"
          type="email"
          required
        />
        <TextField
          control={control}
          name="organizationEmail"
          label="Organization email"
          type="email"
        />
        <PasswordField
          control={control}
          name="password"
          label="Password"
          showRules
          required
        />
        <PasswordField
          control={control}
          name="confirmPassword"
          label="Confirm password"
          required
        />
        <PhoneField
          control={control}
          name="phoneNumber"
          label="Phone number"
          required
        />
        <RadioGroupField
          control={control}
          name="phoneType"
          label="Phone type"
          options={toOptions(PHONE_TYPES)}
          required
        />
        <TextField
          control={control}
          name="address.mailingAddress"
          label="Mailing address"
          required
        />
        <TextField
          control={control}
          name="address.city"
          label="City"
          required
        />
        <SelectField
          control={control}
          name="address.country"
          label="Country"
          options={toOptions(['Canada', 'United States'])}
          required
        />
        <SelectField
          control={control}
          name="address.province"
          label="Province"
          options={toOptions(['British Columbia', 'Alberta'])}
          required
        />
        <TextField
          control={control}
          name="address.postalCode"
          label="Postal code"
          required
        />
        <CheckboxGroupField
          control={control}
          name="membershipInterests"
          label="Membership interests"
          options={toOptions(MEMBERSHIP_INTERESTS)}
        />
        <TextareaField
          control={control}
          name="motivation"
          label="Why join?"
          maxWords={MOTIVATION_MAX_WORDS}
          required
        />
        <TextareaField
          control={control}
          name="programsOrServices"
          label="Programs"
        />
        <button type="submit">Submit</button>
      </fieldset>
    </form>
  );
}

const PASSWORD = 'Abcdefghijklm1!';

/** Matches a field label with or without the required marker. */
function byLabel(label: string) {
  const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return screen.getByLabelText(new RegExp(`^${escaped}\\*?$`));
}

function change(label: string, value: string) {
  fireEvent.change(byLabel(label), { target: { value } });
}

function fillValidOrganization() {
  change('Name', 'Jane Doe');
  change('Email', 'jane@example.com');
  change('Password', PASSWORD);
  change('Confirm password', PASSWORD);
  change('Phone number', '6041234567');
  fireEvent.click(screen.getByLabelText('Cell'));
  change('Mailing address', '1234 No. 3 Rd');
  change('City', 'Richmond');
  change('Postal code', 'V6X 2B8');
  fireEvent.click(screen.getByLabelText('Housing'));
  fireEvent.click(screen.getByLabelText('Health'));
  change('Why join?', 'To help reduce poverty in Richmond.');
}

describe('schema-driven sign-up fields', () => {
  test('submits schema-valid values, with optional empty fields left out', async () => {
    const onSubmit = vi.fn();
    render(<OrganizationHarness onSubmit={onSubmit} />);

    fillValidOrganization();
    // Typed then cleared: must not fail the optional email check.
    change('Organization email', 'x');
    change('Organization email', '');

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Submit' }));
    });

    expect(onSubmit).toHaveBeenCalledTimes(1);
    const values = onSubmit.mock.calls[0][0] as OrgOutput;
    expect(values.phoneNumber).toBe('+16041234567');
    expect(values.phoneType).toBe('Cell');
    expect(values.organizationEmail).toBeUndefined();
    expect(values.programsOrServices).toBeUndefined();
    // Stored in option order, not click order.
    expect(values.membershipInterests).toEqual(['Health', 'Housing']);
    expect(values.address).toMatchObject({
      country: 'Canada',
      province: 'British Columbia',
    });
  });

  test('shows schema error messages and links them to the control', async () => {
    const onSubmit = vi.fn();
    render(<OrganizationHarness onSubmit={onSubmit} />);

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Submit' }));
    });

    expect(onSubmit).not.toHaveBeenCalled();
    const name = byLabel('Name');
    expect(name.getAttribute('aria-invalid')).toBe('true');
    const errorId = name.getAttribute('aria-describedby');
    expect(errorId).toContain('field-name-error');
    expect(document.getElementById('field-name-error')?.textContent).toBe(
      'Name is required',
    );
    expect(screen.getByText('Select either Home or Cell')).toBeDefined();
  });

  test('phone field shows a national format and stores E.164', () => {
    render(<OrganizationHarness onSubmit={vi.fn()} />);
    const phone = byLabel('Phone number') as HTMLInputElement;

    change('Phone number', '+1 (604) 123-4567');
    expect(phone.value).toBe('(604) 123-4567');

    change('Phone number', '60412');
    expect(phone.value).toBe('(604) 12');
  });

  test('password rules come from the schema and tick off as they pass', () => {
    render(<OrganizationHarness onSubmit={vi.fn()} />);

    change('Password', 'abc');
    expect(
      screen.getByText(/at least one lowercase letter/).textContent,
    ).toContain('(met)');
    expect(screen.getByText(/at least 15 characters/).textContent).toContain(
      '(not met)',
    );
  });

  test('textarea shows a live word count', () => {
    render(<OrganizationHarness onSubmit={vi.fn()} />);
    change('Why join?', 'one two three');
    expect(screen.getByText(`3 / ${MOTIVATION_MAX_WORDS} words`)).toBeDefined();
  });

  test('every control is disabled inside a disabled fieldset', () => {
    render(<OrganizationHarness onSubmit={vi.fn()} disabled />);

    const controls = [
      ...document.querySelectorAll('input, textarea, button'),
    ].filter((element) => !(element as HTMLElement).hidden);

    expect(controls.length).toBeGreaterThan(10);
    for (const control of controls) {
      expect(control.matches(':disabled')).toBe(true);
    }
  });
});

describe('CheckboxField', () => {
  type IndInput = z.input<typeof individualSchema>;
  type IndOutput = z.output<typeof individualSchema>;

  function WaiverHarness() {
    const form = useForm<IndInput, unknown, IndOutput>({
      resolver: zodResolver(individualSchema),
    });
    const waiverRequest = useWatch({
      control: form.control,
      name: 'waiverRequest',
    });

    return (
      <>
        <CheckboxField
          control={form.control}
          name="waiverRequest"
          label="Request a fee waiver"
        />
        <output>{String(waiverRequest)}</output>
      </>
    );
  }

  test('stores a boolean', async () => {
    render(<WaiverHarness />);
    fireEvent.click(screen.getByLabelText('Request a fee waiver'));
    await waitFor(() => expect(screen.getByText('true')).toBeDefined());
  });
});

async function submitHarness() {
  await act(async () => {
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }));
  });
}

describe('field edge cases', () => {
  test('TextField: whitespace only counts as empty', async () => {
    render(<OrganizationHarness onSubmit={vi.fn()} />);
    change('Name', '   ');
    await submitHarness();
    expect(screen.getByText('Name is required')).toBeDefined();
  });

  test('PasswordField: show/hide toggle switches the input type', () => {
    render(<OrganizationHarness onSubmit={vi.fn()} />);
    const password = byLabel('Password') as HTMLInputElement;

    expect(password.type).toBe('password');
    fireEvent.click(
      screen.getAllByRole('button', { name: 'Show password' })[0],
    );
    expect(password.type).toBe('text');
    fireEvent.click(screen.getByRole('button', { name: 'Hide password' }));
    expect(password.type).toBe('password');
  });

  test('PasswordField: a valid password ticks every rule; confirm has no rule list', () => {
    render(<OrganizationHarness onSubmit={vi.fn()} />);
    change('Password', PASSWORD);

    // Only the password field shows rules: one list, five rules, all met.
    const rules = screen.getAllByText(/^Password must/);
    expect(rules).toHaveLength(5);
    for (const rule of rules) expect(rule.textContent).toContain('(met)');
  });

  test.each([
    ['a pasted number with country code', '16041234567', '(604) 123-4567'],
    ['a pasted +1 number', '+1 (604) 123-4567', '(604) 123-4567'],
    ['more than 10 digits', '604123456789', '(604) 123-4567'],
    ['letters mixed in', 'abc604', '604'],
    ['the first six digits', '604123', '(604) 123'],
  ])('PhoneField: %s', (_label, typed, shown) => {
    render(<OrganizationHarness onSubmit={vi.fn()} />);
    change('Phone number', typed);
    expect((byLabel('Phone number') as HTMLInputElement).value).toBe(shown);
  });

  test('PhoneField: a cleared number shows the schema error', async () => {
    render(<OrganizationHarness onSubmit={vi.fn()} />);
    change('Phone number', '6041234567');
    change('Phone number', '');
    await submitHarness();
    expect(
      screen.getByText(
        'Enter a valid phone number in international format (+16041234567)',
      ),
    ).toBeDefined();
  });

  test('RadioGroupField: choosing Home submits Home', async () => {
    const onSubmit = vi.fn();
    render(<OrganizationHarness onSubmit={onSubmit} />);
    fillValidOrganization();
    fireEvent.click(screen.getByLabelText('Home'));
    await submitHarness();
    expect(onSubmit.mock.calls[0][0].phoneType).toBe('Home');
  });

  test('TextareaField: over the word limit turns the counter red and fails the schema', async () => {
    render(<OrganizationHarness onSubmit={vi.fn()} />);
    change('Why join?', 'word '.repeat(MOTIVATION_MAX_WORDS + 1));

    const counter = screen.getByText(
      `${MOTIVATION_MAX_WORDS + 1} / ${MOTIVATION_MAX_WORDS} words`,
    );
    expect(counter.className).toContain('text-destructive');

    await submitHarness();
    expect(
      screen.getByText(
        `Reason for joining must be at most ${MOTIVATION_MAX_WORDS} words`,
      ),
    ).toBeDefined();
  });

  test('TextareaField: whitespace only counts as empty', async () => {
    render(<OrganizationHarness onSubmit={vi.fn()} />);
    change('Why join?', '  \n  ');
    await submitHarness();
    expect(screen.getByText('Reason for joining is required')).toBeDefined();
  });

  test('CheckboxGroupField: unticking removes the value', async () => {
    const onSubmit = vi.fn();
    render(<OrganizationHarness onSubmit={onSubmit} />);
    fillValidOrganization(); // ticks Housing and Health
    fireEvent.click(screen.getByLabelText('Health'));
    await submitHarness();
    expect(onSubmit.mock.calls[0][0].membershipInterests).toEqual(['Housing']);
  });
});

describe('SelectField edge cases', () => {
  function SelectHarness({
    options,
    onValueChange,
  }: {
    options: { value: string; label: string }[];
    onValueChange?: (value: string) => void;
  }) {
    const form = useForm<{ pick?: string }>();
    return (
      <SelectField
        control={form.control}
        name="pick"
        label="Pick"
        options={options}
        onValueChange={onValueChange}
      />
    );
  }

  test('is disabled when there are no options', () => {
    render(<SelectHarness options={[]} />);
    expect(
      screen.getByRole('combobox', { name: 'Pick' }).matches(':disabled'),
    ).toBe(true);
  });

  test('calls onValueChange with the chosen value', () => {
    const onValueChange = vi.fn();
    render(
      <SelectHarness
        options={toOptions(['A', 'B'])}
        onValueChange={onValueChange}
      />,
    );
    fireEvent.keyDown(screen.getByRole('combobox', { name: 'Pick' }), {
      key: 'Enter',
    });
    fireEvent.keyDown(screen.getByRole('option', { name: 'B' }), {
      key: 'Enter',
    });
    expect(onValueChange).toHaveBeenCalledWith('B');
  });
});

describe('CheckboxField edge cases', () => {
  function ToggleHarness({
    onValueChange,
  }: {
    onValueChange: (v: boolean) => void;
  }) {
    const form = useForm<{ agree?: boolean }>();
    const agree = useWatch({ control: form.control, name: 'agree' });
    return (
      <>
        <CheckboxField
          control={form.control}
          name="agree"
          label="Agree"
          onValueChange={onValueChange}
        />
        <output>{String(agree)}</output>
      </>
    );
  }

  test('unticking stores false and onValueChange reports each change', async () => {
    const onValueChange = vi.fn();
    render(<ToggleHarness onValueChange={onValueChange} />);
    const box = screen.getByLabelText('Agree');

    fireEvent.click(box);
    await waitFor(() => expect(screen.getByText('true')).toBeDefined());
    fireEvent.click(box);
    await waitFor(() => expect(screen.getByText('false')).toBeDefined());

    expect(onValueChange.mock.calls).toEqual([[true], [false]]);
  });
});

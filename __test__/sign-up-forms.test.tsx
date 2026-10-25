import { beforeEach, describe, expect, test, vi } from 'vitest';
import { act, fireEvent, render, screen } from '@testing-library/react';

import { IndividualSignUpForm } from '@/components/sign-up/IndividualSignUpForm';
import { MembershipTypeChooser } from '@/components/sign-up/MembershipTypeChooser';
import { OrganizationSignUpForm } from '@/components/sign-up/OrganizationSignUpForm';
import { signUpIndividual, signUpOrganization } from '@/app/actions/auth';
import {
  SIGN_UP_FIELD_LABELS,
  SIGN_UP_FORM_COPY,
} from '@/lib/constants/sign-up';
import { ROUTES } from '@/lib/constants/routes';

vi.mock('@/app/actions/auth', () => ({
  signUpIndividual: vi.fn(),
  signUpOrganization: vi.fn(),
}));

const toastError = vi.hoisted(() => vi.fn());
vi.mock('sonner', () => ({ toast: { error: toastError } }));

const routerPush = vi.hoisted(() => vi.fn());
vi.mock('next/navigation', () => ({ useRouter: () => ({ push: routerPush }) }));

const SUCCESS_HEADING = 'Application Submitted Successfully!';
const PASSWORD = 'Abcdefghijklm1!';

beforeEach(() => {
  vi.mocked(signUpIndividual).mockReset();
  vi.mocked(signUpOrganization).mockReset();
  toastError.mockReset();
  routerPush.mockReset();
});

/** A promise the test resolves or rejects when it chooses to. */
function deferred() {
  let resolve!: () => void;
  let reject!: (error: Error) => void;
  const promise = new Promise<void>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}

function byLabel(label: string) {
  const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return screen.getByLabelText(new RegExp(`^${escaped}\\*?$`));
}

function type(label: string, value: string) {
  fireEvent.change(byLabel(label), { target: { value } });
}

function fillShared(nameLabel: string) {
  type(SIGN_UP_FIELD_LABELS.EMAIL, 'jane@example.com');
  type(SIGN_UP_FIELD_LABELS.PASSWORD, PASSWORD);
  type(SIGN_UP_FIELD_LABELS.CONFIRM_PASSWORD, PASSWORD);
  type(nameLabel, 'Jane Doe');
  type(SIGN_UP_FIELD_LABELS.PHONE_NUMBER, '6041234567');
  type(SIGN_UP_FIELD_LABELS.MAILING_ADDRESS, '1234 No. 3 Rd');
  type(SIGN_UP_FIELD_LABELS.CITY, 'Richmond');
  type('Postal Code', 'V6X 2B8');
  type('Your reason for joining', 'To help reduce poverty in Richmond.');

  const province = screen.getByRole('combobox', { name: /^Province/ });
  fireEvent.keyDown(province, { key: 'Enter' });
  fireEvent.keyDown(screen.getByRole('option', { name: 'British Columbia' }), {
    key: 'Enter',
  });
}

async function submit() {
  await act(async () => {
    fireEvent.click(
      screen.getByRole('button', { name: SIGN_UP_FORM_COPY.SUBMIT }),
    );
  });
}

/** Every form control on the page, excluding Radix's hidden native mirrors. */
function allControls(): HTMLElement[] {
  return [
    ...document.querySelectorAll<HTMLElement>('input, textarea, button'),
  ].filter(
    (element) =>
      !element.hidden && element.getAttribute('aria-hidden') !== 'true',
  );
}

describe('individual sign-up form', () => {
  test('one page, no progress bar, heading from the issue', () => {
    render(<IndividualSignUpForm />);

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: SIGN_UP_FORM_COPY.INDIVIDUAL_HEADING,
      }),
    ).toBeDefined();
    expect(screen.queryByText('Account Creation')).toBeNull();
    expect(screen.queryByText('Form Completion')).toBeNull();
  });

  test('defaults: Cell phone type and Canada preselected', () => {
    render(<IndividualSignUpForm />);

    expect(
      screen.getByRole('radio', { name: 'Cell' }).getAttribute('aria-checked'),
    ).toBe('true');
    expect(
      screen.getByRole('combobox', { name: /Country/ }).textContent,
    ).toContain('Canada');
  });

  test('invalid submit shows schema errors and never calls the service', async () => {
    render(<IndividualSignUpForm />);

    await submit();

    expect(signUpIndividual).not.toHaveBeenCalled();
    expect(screen.getByText('Name is required')).toBeDefined();
  });

  test('all controls are disabled until the submission completes, then success shows', async () => {
    const pending = deferred();
    vi.mocked(signUpIndividual).mockReturnValue(pending.promise);
    render(<IndividualSignUpForm />);

    fillShared(SIGN_UP_FIELD_LABELS.NAME);
    await submit();

    expect(signUpIndividual).toHaveBeenCalledTimes(1);
    expect(
      screen.getByRole('button', { name: SIGN_UP_FORM_COPY.SUBMITTING }),
    ).toBeDefined();
    const controls = allControls();
    expect(controls.length).toBeGreaterThan(15);
    for (const control of controls) {
      expect(control.matches(':disabled'), control.outerHTML.slice(0, 80)).toBe(
        true,
      );
    }

    await act(async () => pending.resolve());

    expect(screen.getByText(SUCCESS_HEADING)).toBeDefined();
    expect(
      screen.queryByRole('button', { name: SIGN_UP_FORM_COPY.SUBMIT }),
    ).toBeNull();
  });

  test('submits schema-parsed values', async () => {
    vi.mocked(signUpIndividual).mockResolvedValue();
    render(<IndividualSignUpForm />);

    fillShared(SIGN_UP_FIELD_LABELS.NAME);
    await submit();

    expect(vi.mocked(signUpIndividual).mock.calls[0][0]).toMatchObject({
      email: 'jane@example.com',
      name: 'Jane Doe',
      phoneNumber: '+16041234567',
      phoneType: 'Cell',
      address: {
        mailingAddress: '1234 No. 3 Rd',
        city: 'Richmond',
        country: 'Canada',
        province: 'British Columbia',
        postalCode: 'V6X 2B8',
      },
      membershipInterests: [],
      waiverRequest: false,
    });
  });

  test('failure: toast with the exact message, form re-enabled, values kept', async () => {
    const pending = deferred();
    vi.mocked(signUpIndividual).mockReturnValue(pending.promise);
    render(<IndividualSignUpForm />);

    fillShared(SIGN_UP_FIELD_LABELS.NAME);
    await submit();
    await act(async () => pending.reject(new Error('network')));

    expect(toastError).toHaveBeenCalledWith(
      'Submission failed. Try again later.',
    );
    expect(screen.queryByText(SUCCESS_HEADING)).toBeNull();
    for (const control of allControls()) {
      expect(control.matches(':disabled'), control.outerHTML.slice(0, 80)).toBe(
        false,
      );
    }
    expect((byLabel(SIGN_UP_FIELD_LABELS.NAME) as HTMLInputElement).value).toBe(
      'Jane Doe',
    );
  });
});

describe('organization sign-up form', () => {
  test('submits organization values, including the optional org email', async () => {
    vi.mocked(signUpOrganization).mockResolvedValue();
    render(<OrganizationSignUpForm />);

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: SIGN_UP_FORM_COPY.ORGANIZATION_HEADING,
      }),
    ).toBeDefined();

    fillShared(SIGN_UP_FIELD_LABELS.REPRESENTATIVE_NAME);
    type(SIGN_UP_FIELD_LABELS.ORGANIZATION_EMAIL, 'info@foodbank.org');
    await submit();

    expect(vi.mocked(signUpOrganization).mock.calls[0][0]).toMatchObject({
      name: 'Jane Doe',
      organizationEmail: 'info@foodbank.org',
    });
    expect(screen.getByText(SUCCESS_HEADING)).toBeDefined();
  });
});

describe('/sign-up membership type chooser', () => {
  test('is only a choice: heading, two cards, no account fields', () => {
    render(<MembershipTypeChooser />);

    expect(
      screen.getByRole('heading', { level: 1, name: 'Choose Membership Type' }),
    ).toBeDefined();
    expect(
      screen.getByRole('button', { name: /Individual membership/ }),
    ).toBeDefined();
    expect(
      screen.getByRole('button', { name: /Organization membership/ }),
    ).toBeDefined();
    expect(screen.queryByRole('textbox')).toBeNull();
  });

  test('continues to the form for the chosen type', () => {
    render(<MembershipTypeChooser />);

    fireEvent.click(screen.getByRole('button', { name: 'Continue' }));
    expect(routerPush).toHaveBeenLastCalledWith(ROUTES.SIGN_UP_ORGANIZATION);

    fireEvent.click(
      screen.getByRole('button', { name: /Individual membership/ }),
    );
    fireEvent.click(screen.getByRole('button', { name: 'Continue' }));
    expect(routerPush).toHaveBeenLastCalledWith(ROUTES.SIGN_UP_INDIVIDUAL);
  });

  test('the shared sign-up route now points to this page', () => {
    expect(ROUTES.MEMBERSHIP_SIGNUP).toBe('/sign-up');
  });
});

describe('submit behaviour edge cases', () => {
  test('clicking Submit again while pending sends only once', async () => {
    const pending = deferred();
    vi.mocked(signUpIndividual).mockReturnValue(pending.promise);
    render(<IndividualSignUpForm />);
    fillShared(SIGN_UP_FIELD_LABELS.NAME);

    await submit();
    await act(async () => {
      fireEvent.click(
        screen.getByRole('button', { name: SIGN_UP_FORM_COPY.SUBMITTING }),
      );
    });
    await act(async () => pending.resolve());

    expect(signUpIndividual).toHaveBeenCalledTimes(1);
  });

  test('after a failure, submitting again can succeed', async () => {
    vi.mocked(signUpIndividual)
      .mockRejectedValueOnce(new Error('network'))
      .mockResolvedValueOnce();
    render(<IndividualSignUpForm />);
    fillShared(SIGN_UP_FIELD_LABELS.NAME);

    await submit();
    expect(toastError).toHaveBeenCalledTimes(1);
    expect(screen.queryByText(SUCCESS_HEADING)).toBeNull();

    await submit();
    expect(signUpIndividual).toHaveBeenCalledTimes(2);
    expect(screen.getByText(SUCCESS_HEADING)).toBeDefined();
  });

  test('errors clear live once fixed, then the submit goes through', async () => {
    vi.mocked(signUpIndividual).mockResolvedValue();
    render(<IndividualSignUpForm />);

    await submit();
    expect(screen.getByText('Name is required')).toBeDefined();

    fillShared(SIGN_UP_FIELD_LABELS.NAME);
    await act(async () => {});
    expect(screen.queryByText('Name is required')).toBeNull();

    await submit();
    expect(signUpIndividual).toHaveBeenCalledTimes(1);
  });

  test('an invalid submit moves focus to the first invalid field', async () => {
    render(<IndividualSignUpForm />);

    await submit();

    expect(document.activeElement).toBe(byLabel(SIGN_UP_FIELD_LABELS.EMAIL));
  });

  test('success scrolls back to the top of the page', async () => {
    const scrollTo = vi.spyOn(window, 'scrollTo');
    vi.mocked(signUpIndividual).mockResolvedValue();
    render(<IndividualSignUpForm />);
    fillShared(SIGN_UP_FIELD_LABELS.NAME);

    await submit();

    expect(scrollTo).toHaveBeenCalledWith(expect.objectContaining({ top: 0 }));
    scrollTo.mockRestore();
  });

  test('organization failure shows the same toast and keeps the form', async () => {
    vi.mocked(signUpOrganization).mockRejectedValue(new Error('network'));
    render(<OrganizationSignUpForm />);
    fillShared(SIGN_UP_FIELD_LABELS.REPRESENTATIVE_NAME);

    await submit();

    expect(toastError).toHaveBeenCalledWith(
      'Submission failed. Try again later.',
    );
    expect(
      screen.getByRole('button', { name: SIGN_UP_FORM_COPY.SUBMIT }),
    ).toBeDefined();
    expect(screen.queryByText(SUCCESS_HEADING)).toBeNull();
  });
});

import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, test, vi } from 'vitest';

import MembershipProfileEditForm, { type MembershipProfileEditValues } from '@/components/membership/MembershipProfileEditForm';
import { MEMBER_DASHBOARD } from '@/lib/mock-data/member-dashboard';

vi.mock('next/font/google', () => ({
  Inter: () => ({ className: 'inter' }),
  Roboto_Condensed: () => ({ className: 'roboto-condensed' }),
}));

afterEach(cleanup);

describe('MembershipProfileEditForm', () => {
  test('clears its changed state when values are reverted', async () => {
    const onDirtyChange = vi.fn();

    render(
      <MembershipProfileEditForm
        data={MEMBER_DASHBOARD}
        onSave={vi.fn(async (_values: MembershipProfileEditValues) => {})}
        isSaving={false}
        onDirtyChange={onDirtyChange}
      />,
    );

    const nameInput = screen.getByLabelText(/Name/);
    fireEvent.change(nameInput, { target: { value: 'Leighton Smith' } });
    await waitFor(() => expect(onDirtyChange).toHaveBeenLastCalledWith(true));

    fireEvent.change(nameInput, { target: { value: MEMBER_DASHBOARD.name } });
    await waitFor(() => expect(onDirtyChange).toHaveBeenLastCalledWith(false));
  });

  test('submits schema-normalized phone values to the local save callback', async () => {
    const onSave = vi.fn(async (_values: MembershipProfileEditValues) => {});
    const onDirtyChange = vi.fn();

    render(
      <MembershipProfileEditForm
        data={MEMBER_DASHBOARD}
        onSave={onSave}
        isSaving={false}
        onDirtyChange={onDirtyChange}
      />,
    );

    fireEvent.change(screen.getByLabelText(/Name/), {
      target: { value: 'Leighton Smith' },
    });
    await waitFor(() => expect(onDirtyChange).toHaveBeenLastCalledWith(true));
    const form = document.getElementById('membership-profile-edit-form')!;
    const submitButton = document.createElement('button');
    submitButton.type = 'submit';
    form.appendChild(submitButton);
    fireEvent.click(submitButton);

    await waitFor(() => expect(onSave).toHaveBeenCalledTimes(1));
    expect(onSave.mock.calls[0][0]).toMatchObject({
      role: 'individual',
      phoneNumber: '+16045551234',
      phoneType: 'Cell',
      address: {
        mailingAddress: '123 Example Street',
        city: 'New Westminster',
        province: 'British Columbia',
        country: 'Canada',
        postalCode: 'V3L 1A1',
      },
    });
  });
});

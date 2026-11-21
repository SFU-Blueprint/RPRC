import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { afterEach, describe, expect, test, vi } from 'vitest';

import MembershipProfileEditForm from '@/components/membership/MembershipProfileEditForm';
import type { MemberProfileEditValues } from '@/lib/schema/member-profile-edit.schema';
import { ApplicationStatus, ApplicationType } from '@/lib/constants/enums';
import type { MemberDashboardData } from '@/types/membership.types';

// Shaped like getMemberDashboardData() output; phone uses the "+1 " format stored at signup.
const MEMBER_DASHBOARD: MemberDashboardData = {
  name: 'Leighton Kramer',
  status: ApplicationStatus.ACTIVE,
  type: ApplicationType.INDIVIDUAL,
  interests: ['Health', 'Environment'],
  reason:
    'I want to support community led poverty reduction and help make services more accessible in Richmond.',
  contact: {
    email: 'leighton.kramer@example.com',
    phone: '+1 (604)-555-1234',
    phoneType: 'cell',
    address:
      '123 Example Street, New Westminster, British Columbia, Canada, V3L 1A1',
    addressFields: {
      mailingAddress: '123 Example Street',
      city: 'New Westminster',
      province: 'British Columbia',
      country: 'Canada',
      postalCode: 'V3L 1A1',
    },
  },
  dateReceived: '2024-05-01',
  dateFinalized: '2024-05-15',
};

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
        onSave={vi.fn(async (_values: MemberProfileEditValues) => {})}
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

  test('submits schema-normalized phone values to the save callback', async () => {
    const onSave = vi.fn(async (_values: MemberProfileEditValues) => {});
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
      phoneNumber: '+1 (604)-555-1234',
      phoneType: 'cell',
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

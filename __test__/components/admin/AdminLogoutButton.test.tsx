import { beforeEach, describe, expect, test, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

/**
 * The admin Logout button only leaves the page once sign-out succeeded.
 */

const router = vi.hoisted(() => ({ push: vi.fn(), refresh: vi.fn() }));
vi.mock('next/navigation', () => ({ useRouter: () => router }));

const toast = vi.hoisted(() => ({ error: vi.fn() }));
vi.mock('sonner', () => ({ toast }));

const signOut = vi.hoisted(() => vi.fn());
vi.mock('@/lib/contexts/AuthContext', () => ({
  useAuth: () => ({ signOut }),
}));

import { AdminLogoutButton } from '@/components/admin/layout/AdminLogoutButton';
import { AUTH_COPY } from '@/lib/constants/auth';
import { ROUTES } from '@/lib/constants/routes';

beforeEach(() => {
  vi.clearAllMocks();
  vi.spyOn(console, 'error').mockImplementation(() => {});
});

describe('AdminLogoutButton', () => {
  test('goes home after a successful sign-out', async () => {
    signOut.mockResolvedValue(undefined);
    render(<AdminLogoutButton />);

    fireEvent.click(screen.getByRole('button', { name: 'Logout' }));

    await waitFor(() => expect(router.push).toHaveBeenCalledWith(ROUTES.HOME));
    expect(router.refresh).toHaveBeenCalled();
    expect(toast.error).not.toHaveBeenCalled();
  });

  test('stays on the page and shows a toast when sign-out fails', async () => {
    signOut.mockRejectedValue(new Error('network down'));
    render(<AdminLogoutButton />);
    const button = screen.getByRole('button', { name: 'Logout' });

    fireEvent.click(button);

    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith(AUTH_COPY.SIGN_OUT_FAILED),
    );
    expect(router.push).not.toHaveBeenCalled();
    await waitFor(() =>
      expect((button as HTMLButtonElement).disabled).toBe(false),
    );
  });
});

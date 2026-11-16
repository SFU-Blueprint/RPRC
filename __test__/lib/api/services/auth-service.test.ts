import { beforeEach, describe, expect, test, vi } from 'vitest';

/**
 * signOutClient surfaces the error Supabase returns instead of ignoring it.
 */

const supabaseAuth = vi.hoisted(() => ({ signOut: vi.fn() }));
vi.mock('@/lib/supabase/client', () => ({
  createClient: () => ({ auth: supabaseAuth }),
}));

import { signOutClient } from '@/lib/api/services/auth-service';

beforeEach(() => {
  vi.clearAllMocks();
});

describe('signOutClient', () => {
  test('resolves when Supabase signs out', async () => {
    supabaseAuth.signOut.mockResolvedValue({ error: null });
    await expect(signOutClient()).resolves.toBeUndefined();
  });

  test('throws the error Supabase returns', async () => {
    const error = new Error('network down');
    supabaseAuth.signOut.mockResolvedValue({ error });
    await expect(signOutClient()).rejects.toBe(error);
  });
});

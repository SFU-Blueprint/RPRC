// @vitest-environment node
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';

const getUser = vi.fn();

vi.mock('@supabase/ssr', () => ({
  createServerClient: () => ({ auth: { getUser } }),
}));

const { updateSession } = await import('@/lib/supabase/proxy');

function signInAs(role: string) {
  getUser.mockResolvedValue({
    data: { user: { id: 'user-1', user_metadata: { role } } },
  });
}

function request(path: string) {
  return new NextRequest(new URL(path, 'http://localhost:3000'));
}

describe('updateSession admin routing', () => {
  beforeEach(() => {
    getUser.mockReset();
  });

  it.each(['/', '/membership', '/sign-up'])(
    'redirects a signed-in admin from %s to the admin dashboard',
    async (path) => {
      signInAs('admin');

      const response = await updateSession(request(path));

      expect(response.status).toBe(307);
      expect(new URL(response.headers.get('location')!).pathname).toBe(
        '/admin/dashboard',
      );
    },
  );

  it.each(['/admin/dashboard', '/membership/dashboard'])(
    'lets a signed-in admin open %s',
    async (path) => {
      signInAs('admin');

      const response = await updateSession(request(path));

      expect(response.headers.get('location')).toBeNull();
    },
  );
});

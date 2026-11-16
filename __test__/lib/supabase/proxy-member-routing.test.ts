// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';

const getUser = vi.fn();
const profile = vi.hoisted(() => ({
  value: null as null | { role: string; applications: { id: string }[] },
}));

vi.mock('@supabase/ssr', () => ({
  createServerClient: () => ({
    auth: { getUser },
    from: () => {
      const builder = {
        select: () => builder,
        eq: () => builder,
        maybeSingle: async () => ({ data: profile.value, error: null }),
      };
      return builder;
    },
  }),
}));

const { updateSession } = await import('@/lib/supabase/proxy');

function signedInMember(role: string, hasApplication: boolean) {
  getUser.mockResolvedValue({
    data: { user: { id: 'user-1', user_metadata: { role } } },
  });
  profile.value = {
    role,
    applications: hasApplication ? [{ id: 'app-1' }] : [],
  };
}

async function visit(path: string) {
  const response = await updateSession(
    new NextRequest(new URL(path, 'http://localhost:3000')),
  );
  const location = response.headers.get('location');
  return location ? new URL(location).pathname : null;
}

beforeEach(() => {
  getUser.mockReset();
  profile.value = null;
});

describe('logged out', () => {
  beforeEach(() => {
    getUser.mockResolvedValue({ data: { user: null } });
  });

  it('a protected page goes to the log-in page, not sign-up', async () => {
    expect(await visit('/membership/dashboard')).toBe('/');
  });

  it('the sign-up forms are open', async () => {
    expect(await visit('/sign-up/individual')).toBeNull();
    expect(await visit('/sign-up/organization')).toBeNull();
  });
});

describe('signed in without an application', () => {
  it('their own form is let through (no redirect loop)', async () => {
    signedInMember('individual', false);
    expect(await visit('/sign-up/individual')).toBeNull();

    signedInMember('organization', false);
    expect(await visit('/sign-up/organization')).toBeNull();
  });

  it.each([
    '/',
    '/membership',
    '/sign-up',
    '/sign-up/organization',
    '/membership/dashboard',
    '/membership/form',
    '/admin/dashboard',
  ])('%s goes to their form', async (path) => {
    signedInMember('individual', false);
    expect(await visit(path)).toBe('/sign-up/individual');
  });

  it.each(['/membership/payment/return', '/auth/reset-password', '/error'])(
    '%s is let through',
    async (path) => {
      signedInMember('individual', false);
      expect(await visit(path)).toBeNull();
    },
  );

  it('a role other than individual or organization goes to the dashboard', async () => {
    getUser.mockResolvedValue({
      data: { user: { id: 'user-1', user_metadata: {} } },
    });
    profile.value = { role: 'admin', applications: [] };

    expect(await visit('/sign-up/individual')).toBe('/membership/dashboard');
  });
});

describe('signed in with an application', () => {
  it.each(['/', '/membership', '/sign-up', '/sign-up/individual'])(
    '%s goes to the dashboard',
    async (path) => {
      signedInMember('individual', true);
      expect(await visit(path)).toBe('/membership/dashboard');
    },
  );

  it('membership pages are let through', async () => {
    signedInMember('individual', true);
    expect(await visit('/membership/dashboard')).toBeNull();
  });
});

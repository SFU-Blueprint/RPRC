// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const recipient = vi.hoisted(() => ({
  response: { data: null as unknown, error: null as unknown },
}));
vi.mock('@/lib/supabase/admin', () => {
  const builder = {
    select: () => builder,
    eq: () => builder,
    maybeSingle: async () => recipient.response,
  };
  return { createAdminClient: () => ({ from: () => builder }) };
});

const transport = vi.hoisted(() => ({ deliverEmail: vi.fn() }));
vi.mock('@/lib/email/transport', () => transport);

const nextServer = vi.hoisted(() => ({ after: vi.fn() }));
vi.mock('next/server', () => nextServer);

const { queueStatusEmail, sendStatusEmail } =
  await import('@/lib/email/send-status-email');

const individual = {
  type: 'individual',
  users: {
    email: 'jane@example.com',
    individual_profiles: { name: 'Jane Doe' },
    organization_profiles: null,
  },
};
const organization = {
  type: 'organization',
  users: {
    email: 'info@foodbank.org',
    individual_profiles: null,
    organization_profiles: { org_name: 'Richmond Food Bank Society' },
  },
};

const sent = () => transport.deliverEmail.mock.calls[0]?.[0];

beforeEach(() => {
  vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'https://portal.example.org');
  recipient.response = { data: individual, error: null };
  transport.deliverEmail.mockReset();
  nextServer.after.mockReset();
  // Run the scheduled callback right away, as if the response had gone out.
  nextServer.after.mockImplementation((callback: () => Promise<void>) => {
    void callback();
  });
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe('sendStatusEmail', () => {
  it('sends the received email to the account email, greeting by name', async () => {
    await sendStatusEmail('app_1', {
      template: 'application_received',
      renewal: false,
    });

    expect(sent()).toMatchObject({
      to: 'jane@example.com',
      subject: 'We received your membership application',
    });
    expect(sent().html).toContain('Hi Jane Doe,');
    // A plain-text version goes with it, for clients that don't show HTML.
    expect(sent().text).toContain('Hi Jane Doe,');
    expect(sent().html).toContain(
      'Your application has been received and is under processing.',
    );
  });

  it('greets an organization by name and quotes the organization fee', async () => {
    recipient.response = { data: organization, error: null };

    await sendStatusEmail('app_1', { template: 'application_approved' });

    expect(sent().to).toBe('info@foodbank.org');
    expect(sent().html).toContain('Hi Richmond Food Bank Society,');
    expect(sent().text).toContain('$25 processing fee');
    expect(sent().html).toContain(
      'https://portal.example.org/membership/dashboard',
    );
  });

  it.each([
    [false, false, 'Payment successful! You are now an active member.'],
    [false, true, 'Payment successful! Your membership is renewed.'],
    [true, false, 'Welcome! You are now an active member.'],
    [true, true, 'Welcome back! Your membership is renewed.'],
  ])(
    'active email with feeWaived=%s renewal=%s has the right headline',
    async (feeWaived, renewal, headline) => {
      await sendStatusEmail('app_1', {
        template: 'membership_active',
        feeWaived,
        renewal,
      });

      expect(sent().html).toContain(headline);
    },
  );

  it('uses renewal wording in the received email for a renewal', async () => {
    await sendStatusEmail('app_1', {
      template: 'application_received',
      renewal: true,
    });

    expect(sent().subject).toBe('We received your membership renewal');
    expect(sent().html).toContain(
      'Your renewal has been received and is under processing.',
    );
  });

  it('puts the general contact address in the rejected email', async () => {
    await sendStatusEmail('app_1', { template: 'application_rejected' });

    expect(sent().html).toContain('mailto:info@richmondprc.org');
    expect(sent().html).toContain('Your application has been rejected.');
  });

  it('sends nothing when the application or its user is gone', async () => {
    recipient.response = { data: null, error: null };
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

    await sendStatusEmail('app_1', { template: 'application_rejected' });

    expect(transport.deliverEmail).not.toHaveBeenCalled();
    expect(warn).toHaveBeenCalled();
    warn.mockRestore();
  });
});

describe('queueStatusEmail', () => {
  it('schedules the send with after()', async () => {
    queueStatusEmail('app_1', { template: 'application_rejected' });
    await vi.waitFor(() => expect(transport.deliverEmail).toHaveBeenCalled());

    expect(nextServer.after).toHaveBeenCalledTimes(1);
  });

  it('logs instead of throwing when sending fails', async () => {
    transport.deliverEmail.mockRejectedValue(new Error('Resend is down'));
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() =>
      queueStatusEmail('app_1', { template: 'application_rejected' }),
    ).not.toThrow();
    await vi.waitFor(() =>
      expect(error).toHaveBeenCalledWith(
        '[email] sending failed',
        expect.anything(),
      ),
    );
    error.mockRestore();
  });

  it('logs instead of throwing when after() is unavailable', () => {
    nextServer.after.mockImplementation(() => {
      throw new Error('outside a request scope');
    });
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() =>
      queueStatusEmail('app_1', { template: 'application_rejected' }),
    ).not.toThrow();
    expect(error).toHaveBeenCalledWith(
      '[email] could not schedule',
      expect.anything(),
    );
    error.mockRestore();
  });
});

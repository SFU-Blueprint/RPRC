// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const resend = vi.hoisted(() => ({ send: vi.fn() }));
vi.mock('resend', () => ({
  Resend: class {
    emails = { send: resend.send };
  },
}));

const smtp = vi.hoisted(() => ({
  sendMail: vi.fn(),
  createTransport: vi.fn(),
}));
vi.mock('nodemailer', () => ({
  default: { createTransport: smtp.createTransport },
}));

const { deliverEmail } = await import('@/lib/email/transport');

const email = {
  to: 'jane@example.com',
  subject: 'Subject',
  html: '<p>Hi</p>',
  text: 'Hi',
};

beforeEach(() => {
  resend.send.mockReset();
  smtp.sendMail.mockReset();
  smtp.createTransport.mockReset();
  smtp.createTransport.mockReturnValue({ sendMail: smtp.sendMail });
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe('deliverEmail', () => {
  it('sends through Resend with the shared sender when RESEND_API_KEY is set', async () => {
    vi.stubEnv('RESEND_API_KEY', 're_test');
    resend.send.mockResolvedValue({ data: { id: 'em_1' }, error: null });

    await deliverEmail(email);

    expect(resend.send).toHaveBeenCalledWith(
      expect.objectContaining({
        ...email,
        from: expect.stringContaining('noreply@richmondprc.org'),
        replyTo: 'info@richmondprc.org',
      }),
    );
    expect(smtp.createTransport).not.toHaveBeenCalled();
  });

  it('throws when Resend reports an error', async () => {
    vi.stubEnv('RESEND_API_KEY', 're_test');
    resend.send.mockResolvedValue({
      data: null,
      error: { name: 'validation_error', message: 'bad from' },
    });

    await expect(deliverEmail(email)).rejects.toThrow('bad from');
  });

  it('sends to local Mailpit in development without a key', async () => {
    vi.stubEnv('RESEND_API_KEY', '');
    vi.stubEnv('NODE_ENV', 'development');

    await deliverEmail(email);

    expect(smtp.createTransport).toHaveBeenCalledWith(
      expect.objectContaining({ host: '127.0.0.1', port: 54325 }),
    );
    expect(smtp.sendMail).toHaveBeenCalledWith(expect.objectContaining(email));
  });

  it('never falls back to SMTP outside development; logs instead', async () => {
    vi.stubEnv('RESEND_API_KEY', '');
    vi.stubEnv('NODE_ENV', 'production');
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});

    await deliverEmail(email);

    expect(smtp.createTransport).not.toHaveBeenCalled();
    expect(resend.send).not.toHaveBeenCalled();
    expect(error).toHaveBeenCalledWith(
      '[email] RESEND_API_KEY missing; not sending',
      expect.anything(),
    );
    error.mockRestore();
  });
});

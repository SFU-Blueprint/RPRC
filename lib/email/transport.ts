import nodemailer from 'nodemailer';
import { Resend } from 'resend';
import { EMAIL_SENDER } from '@/lib/constants/brand';
import { LOCAL_SMTP } from '@/lib/constants/email';
import type { OutgoingEmail } from '@/types/email.types';

/**
 * Sends one email. With `RESEND_API_KEY` set it goes through Resend. Without it, local
 * development sends to Mailpit (inbox at http://127.0.0.1:54324). Anywhere else without a
 * key (production, Vercel previews) it logs an error and sends nothing, rather than trying
 * localhost and losing every email quietly.
 */
export async function deliverEmail(email: OutgoingEmail): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;

  if (apiKey) {
    const { error } = await new Resend(apiKey).emails.send({
      from: EMAIL_SENDER.FROM,
      replyTo: EMAIL_SENDER.REPLY_TO,
      ...email,
    });
    if (error) throw new Error(`Resend: ${error.name}: ${error.message}`);
    return;
  }

  if (process.env.NODE_ENV === 'development') {
    await nodemailer
      .createTransport({
        host: LOCAL_SMTP.HOST,
        port: LOCAL_SMTP.PORT,
        secure: false,
      })
      .sendMail({
        from: EMAIL_SENDER.FROM,
        replyTo: EMAIL_SENDER.REPLY_TO,
        ...email,
      });
    return;
  }

  console.error('[email] RESEND_API_KEY missing; not sending', {
    subject: email.subject,
  });
}

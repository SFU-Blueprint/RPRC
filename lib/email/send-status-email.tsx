import { render } from '@react-email/render';
import { after } from 'next/server';
import type { ReactElement } from 'react';
import ApplicationApproved from '@/emails/ApplicationApproved';
import ApplicationReceived from '@/emails/ApplicationReceived';
import ApplicationRejected from '@/emails/ApplicationRejected';
import MembershipActive from '@/emails/MembershipActive';
import { EMAIL_COPY } from '@/lib/constants/email';
import { ApplicationStatus, ApplicationType } from '@/lib/constants/enums';
import { APPLICATION_FEES } from '@/lib/constants/processing-fees';
import { createAdminClient } from '@/lib/supabase/admin';
import { getSiteUrl } from '@/lib/utils/site-url';
import { deliverEmail } from '@/lib/email/transport';
import { Recipient, StatusEmail } from '@/types/email.types';
import { one } from '@/lib/utils/rpc-utils';

/**
 * The application's account email and greeting name. Organizations get the
 * organization's account email (`users.email`) and are greeted by organization name.
 * Null when the application or its user no longer exists (e.g. the profile was deleted).
 */
async function getRecipient(applicationId: string): Promise<Recipient | null> {
  const { data, error } = await createAdminClient()
    .from('applications')
    .select(
      'type, users(email, individual_profiles(name), organization_profiles(org_name))',
    )
    .eq('id', applicationId)
    .maybeSingle();
  if (error) throw new Error(`Recipient lookup failed: ${error.message}`);

  const user = one(data?.users);
  if (!data || !user?.email) return null;

  const name =
    data.type === ApplicationType.ORGANIZATION
      ? one(user.organization_profiles)?.org_name
      : one(user.individual_profiles)?.name;
  return { email: user.email, name: name ?? '', type: data.type };
}

function buildEmail(
  email: StatusEmail,
  recipient: Recipient,
  siteUrl: string,
): { subject: string; element: ReactElement } {
  const base = { name: recipient.name, siteUrl };
  switch (email.status) {
    case ApplicationStatus.TO_REVIEW:
      return {
        subject: EMAIL_COPY.RECEIVED.SUBJECT(email.renewal),
        element: <ApplicationReceived {...base} renewal={email.renewal} />,
      };
    case ApplicationStatus.PAYMENT_PENDING:
      return {
        subject: EMAIL_COPY.APPROVED.SUBJECT,
        element: (
          <ApplicationApproved
            {...base}
            fee={
              recipient.type === ApplicationType.ORGANIZATION
                ? APPLICATION_FEES.ORGANIZATION
                : APPLICATION_FEES.INDIVIDUAL
            }
          />
        ),
      };
    case ApplicationStatus.ACTIVE:
      return {
        subject: EMAIL_COPY.ACTIVE.SUBJECT(email.renewal),
        element: (
          <MembershipActive
            {...base}
            feeWaived={email.feeWaived}
            renewal={email.renewal}
          />
        ),
      };
    case ApplicationStatus.REJECTED:
      return {
        subject: EMAIL_COPY.REJECTED.SUBJECT,
        element: <ApplicationRejected {...base} />,
      };
  }
}

/**
 * Renders and sends one status email for an application. Throws on failure; call sites
 * use `queueStatusEmail` instead, which never throws.
 */
export async function sendStatusEmail(
  applicationId: string,
  email: StatusEmail,
): Promise<void> {
  const recipient = await getRecipient(applicationId);
  if (!recipient) {
    console.warn('[email] no recipient; not sending', {
      applicationId,
      status: email.status,
    });
    return;
  }

  const { subject, element } = buildEmail(email, recipient, getSiteUrl());
  const [html, text] = await Promise.all([
    render(element),
    render(element, { plainText: true }),
  ]);
  await deliverEmail({ to: recipient.email, subject, html, text });
}

/**
 * Sends a status email after the response has gone out (`after()` keeps the function
 * alive until it finishes). Never throws and never fails the caller: a status change
 * that already happened stays successful even if the email can't be sent. Call it only
 * after the write that changed the status reported a changed row.
 */
export function queueStatusEmail(
  applicationId: string,
  email: StatusEmail,
): void {
  const send = async () => {
    try {
      await sendStatusEmail(applicationId, email);
    } catch (error) {
      console.error('[email] sending failed', {
        applicationId,
        status: email.status,
        error,
      });
    }
  };

  try {
    after(send);
  } catch (error) {
    // after() throws outside a request scope; nothing to attach the send to.
    console.error('[email] could not schedule', {
      applicationId,
      status: email.status,
      error,
    });
  }
}

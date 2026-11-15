'use client';

import Link from 'next/link';
import { AlertCircle } from 'lucide-react';
import { forwardRef } from 'react';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { SUBMIT_RESULT_COPY } from '@/lib/constants/sign-up';
import type { SignUpFormMode, SubmitResult } from '@/types/sign-up-form.types';

type Failure = Exclude<SubmitResult, { ok: true }>;

/** Which banner a failed submission shows. */
export function getSubmitResultCopy(
  result: Failure,
  submittedIn: SignUpFormMode,
) {
  switch (result.reason) {
    case 'email_exists':
      return SUBMIT_RESULT_COPY.EMAIL_EXISTS;
    case 'duplicate_org_phone':
      return SUBMIT_RESULT_COPY.DUPLICATE_ORG_PHONE;
    case 'invalid':
      return SUBMIT_RESULT_COPY.INVALID;
    case 'already_has_application':
      return SUBMIT_RESULT_COPY.ALREADY_APPLIED;
    case 'not_signed_in':
      return SUBMIT_RESULT_COPY.NOT_SIGNED_IN;
    case 'failed':
      if (result.stage === 'account') return SUBMIT_RESULT_COPY.ACCOUNT_FAILED;
      return submittedIn === 'sign-up'
        ? SUBMIT_RESULT_COPY.APPLICATION_FAILED_AFTER_SIGN_UP
        : SUBMIT_RESULT_COPY.APPLICATION_FAILED;
  }
}

type SubmitResultBannerProps = {
  result: Failure;
  /** The mode the form was in when it was submitted. */
  submittedIn: SignUpFormMode;
};

/** A banner that stays above the form until the next submission. */
export const SubmitResultBanner = forwardRef<
  HTMLDivElement,
  SubmitResultBannerProps
>(function SubmitResultBanner({ result, submittedIn }, ref) {
  const copy: {
    title: string;
    description?: string;
    link?: { label: string; href: string };
  } = getSubmitResultCopy(result, submittedIn);

  return (
    <Alert
      ref={ref}
      variant="destructive"
      tabIndex={-1}
      className="mb-8 border-destructive/40 md:mb-10"
    >
      <AlertCircle aria-hidden="true" />
      <AlertTitle className="line-clamp-none">{copy.title}</AlertTitle>
      {(copy.description || copy.link) && (
        <AlertDescription>
          {copy.description && <p>{copy.description}</p>}
          {copy.link && (
            <Link href={copy.link.href} className="font-medium underline">
              {copy.link.label}
            </Link>
          )}
        </AlertDescription>
      )}
    </Alert>
  );
});

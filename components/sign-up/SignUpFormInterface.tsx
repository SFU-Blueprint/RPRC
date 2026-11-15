'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import {
  FormProvider,
  type FieldValues,
  type UseFormReturn,
} from 'react-hook-form';
import { toast } from 'sonner';

import { headerStyles, robotoCondensed } from '@/app/fonts';
import { Step3Success } from '@/components/signup/Pages/Step3Success';
import { Button } from '@/components/ui/button';
import { InfoBox } from '@/components/ui/infobox';
import { SIGN_UP_FORM_COPY } from '@/lib/constants/sign-up';
import { cn } from '@/lib/utils';
import type { SignUpFormMode, SubmitResult } from '@/types/sign-up-form.types';

import { SubmitResultBanner } from './SubmitResultBanner';

/** Form and success section share one width: full on mobile, 4/5 on large. */
const FORM_WIDTH = 'mx-auto w-full lg:w-4/5';

type Failure = Exclude<SubmitResult, { ok: true }>;

type SignUpFormInterfaceProps<TInput extends FieldValues, TValues> = {
  form: UseFormReturn<TInput, unknown, TValues>;
  heading: string;
  mode: SignUpFormMode;
  /** Called with schema-parsed values. Throwing means an unexpected failure. */
  onSubmit: (values: TValues) => Promise<SubmitResult>;
  /** Called after a failed submission, e.g. to switch to application-only mode. */
  onFailure?: (result: Failure, submittedIn: SignUpFormMode) => void;
  /** The form's sections. */
  children: ReactNode;
};

/**
 * Everything both sign-up forms share:
 * - validation through the form's zod resolver (no native browser checks),
 * - every control disabled while submitting (`<fieldset disabled>`),
 * - the success section on success; on failure, a banner that stays above the
 *   form (or a toast for an unexpected error) and a usable form.
 */
export function SignUpFormInterface<TInput extends FieldValues, TValues>({
  form,
  heading,
  mode,
  onSubmit,
  onFailure,
  children,
}: SignUpFormInterfaceProps<TInput, TValues>) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [failure, setFailure] = useState<{
    result: Failure;
    submittedIn: SignUpFormMode;
  } | null>(null);
  const bannerRef = useRef<HTMLDivElement>(null);
  const { isSubmitting } = form.formState;

  useEffect(() => {
    if (!failure) return;
    bannerRef.current?.scrollIntoView?.({
      behavior: 'smooth',
      block: 'center',
    });
    bannerRef.current?.focus({ preventScroll: true });
  }, [failure]);

  const handleValidSubmit = async (values: TValues) => {
    const submittedIn = mode;
    setFailure(null);

    let result: SubmitResult;
    try {
      result = await onSubmit(values);
    } catch {
      // The form re-enables on its own once `isSubmitting` is false again.
      toast.error(SIGN_UP_FORM_COPY.SUBMIT_FAILED);
      return;
    }

    if (result.ok) {
      setIsSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setFailure({ result, submittedIn });
    onFailure?.(result, submittedIn);
  };

  if (isSubmitted) {
    return (
      <div className={FORM_WIDTH}>
        <Step3Success />
      </div>
    );
  }

  return (
    <div
      className={cn(
        FORM_WIDTH,
        'rounded-4xl bg-signup-neutral-100 p-6 shadow-card sm:p-8 md:p-10 lg:p-12',
      )}
    >
      <h1
        className={cn(
          'mb-8 text-primary-black md:mb-10',
          headerStyles.lResponsive,
          robotoCondensed.className,
        )}
      >
        {heading}
      </h1>

      {failure && (
        <SubmitResultBanner
          ref={bannerRef}
          result={failure.result}
          submittedIn={failure.submittedIn}
        />
      )}

      <FormProvider {...form}>
        <form
          noValidate
          aria-busy={isSubmitting}
          onSubmit={form.handleSubmit(handleValidSubmit)}
        >
          <fieldset
            disabled={isSubmitting}
            className="flex min-w-0 flex-col gap-8 md:gap-10"
          >
            {children}

            <InfoBox
              heading={SIGN_UP_FORM_COPY.NOTE_HEADING}
              primaryLine={SIGN_UP_FORM_COPY.NOTE_PRIMARY}
              secondaryLine={SIGN_UP_FORM_COPY.NOTE_SECONDARY}
            />

            <div className="flex justify-center">
              <Button type="submit" size="lg">
                {isSubmitting
                  ? SIGN_UP_FORM_COPY.SUBMITTING
                  : SIGN_UP_FORM_COPY.SUBMIT}
              </Button>
            </div>
          </fieldset>
        </form>
      </FormProvider>
    </div>
  );
}

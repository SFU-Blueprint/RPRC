'use client';

import { useState, type ReactNode } from 'react';
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

/** Form and success section share one width: full on mobile, 4/5 on large. */
const FORM_WIDTH = 'mx-auto w-full lg:w-4/5';

type SignUpFormInterfaceProps<TInput extends FieldValues, TValues> = {
  form: UseFormReturn<TInput, unknown, TValues>;
  heading: string;
  /** Called with schema-parsed values. Throwing means the submission failed. */
  onSubmit: (values: TValues) => Promise<void>;
  /** The form's sections. */
  children: ReactNode;
};

/**
 * Everything both sign-up forms share:
 * - validation through the form's zod resolver (no native browser checks),
 * - every control disabled while submitting (`<fieldset disabled>`),
 * - the success section on success, a toast and a usable form on failure.
 */
export function SignUpFormInterface<TInput extends FieldValues, TValues>({
  form,
  heading,
  onSubmit,
  children,
}: SignUpFormInterfaceProps<TInput, TValues>) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { isSubmitting } = form.formState;

  const handleValidSubmit = async (values: TValues) => {
    try {
      await onSubmit(values);
      setIsSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch {
      // The form re-enables on its own once `isSubmitting` is false again.
      toast.error(SIGN_UP_FORM_COPY.SUBMIT_FAILED);
    }
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

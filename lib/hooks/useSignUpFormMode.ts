'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type RefObject,
} from 'react';
import type { FieldValues, Resolver } from 'react-hook-form';
import type { z } from 'zod';

import type { SignUpFormMode, SubmitFailure } from '@/types/sign-up-form.types';

/**
 * The form's mode. It starts from what the page found (signed in without an
 * application → application-only) and switches to application-only in place
 * when the account was created but the application wasn't. The form is never
 * remounted, so the answers are kept.
 */
export function useSignUpFormMode(initialMode: SignUpFormMode) {
  const [accountCreated, setAccountCreated] = useState(false);
  const mode: SignUpFormMode =
    initialMode === 'application-only' || accountCreated
      ? 'application-only'
      : 'sign-up';

  const modeRef = useRef<SignUpFormMode>(mode);
  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);

  const onFailure = useCallback(
    (result: SubmitFailure, submittedIn: SignUpFormMode) => {
      if (result.stage === 'application' && submittedIn === 'sign-up')
        setAccountCreated(true);
    },
    [],
  );

  return { mode, modeRef, onFailure };
}

/**
 * Validates with the sign-up schema or the application-only schema, depending
 * on the current mode. In application-only mode the account fields aren't
 * rendered and the application schema strips them, so the password is never
 * sent.
 */
export function modeAwareResolver<TInput extends FieldValues, TValues>(
  modeRef: RefObject<SignUpFormMode>,
  signUpSchema: z.ZodType,
  applicationSchema: z.ZodType,
): Resolver<TInput, unknown, TValues> {
  const signUp = zodResolver(signUpSchema as never);
  const applicationOnly = zodResolver(applicationSchema as never);
  return ((values, context, options) =>
    (modeRef.current === 'sign-up' ? signUp : applicationOnly)(
      values,
      context,
      options as never,
    )) as Resolver<TInput, unknown, TValues>;
}

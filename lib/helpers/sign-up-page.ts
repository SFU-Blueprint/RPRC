import { createClient } from '@/lib/supabase/server';
import type { SignUpFormMode } from '@/types/sign-up-form.types';

/**
 * Props for the sign-up forms, from the session. Signed in means application-only
 * mode: the proxy only lets signed-in users without an application onto these
 * pages (on the form matching their role).
 *
 * Never redirect from here. A successful sign-up sets the session cookie, which
 * re-renders the page in the same response; a redirect would skip the success
 * section. The proxy sends members with an application to the dashboard on
 * their next navigation.
 */
export async function getSignUpFormProps(): Promise<{
  initialMode: SignUpFormMode;
  accountEmail?: string;
}> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user
    ? { initialMode: 'application-only', accountEmail: user.email ?? '' }
    : { initialMode: 'sign-up' };
}

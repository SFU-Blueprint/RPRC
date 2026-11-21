# Sign-up revamp (#66): Supabase integration and removal of the old path

Status: planned; final review complete and agreed (2026-11-15), including decisions 6 and 7. Revised 2026-11-14 after the team decided to **remove email confirmation**, then to add an application-only mode with no account rollback. Based on `origin/dev` de40596 and #66 (`feat/revamp-signup-forms` 87013b9). GoTrue behaviour is from the v2.197.0 source (the local stack's version).

## Goal

One form creates the account **and** the application, and the user is logged in straight away. There's no email confirmation step: applications go straight to `to_review`, and the "application received" email is sent from server code (`docs/email-templates-plan.md`). If the application step fails after the account exists, the user is told clearly and can retry on the same page without losing their answers.

## Blocker before integration: organization contact fields

#66's organization form doesn't match the database, or the old form:

- It has no **organization name**. `organizationSchema` (`lib/schema/organization.schema.ts:14-32`) and `OrganizationSignUpForm.tsx:44-58` have `name`, labelled "Organization Representative Name", and an optional `organizationEmail`.
- But `organization_profiles.org_name` is `text not null` (baseline line 61), `create_organization_application` takes `p_org_name`, `p_org_rep_name` and `p_org_rep_email`, and the admin list shows `org_name` as the applicant's name (`admin-application-service.ts:51`).

**Decided (2026-11-15): #66's organization contact fields follow the old form** (`components/signup/domain/ContactInfoOrganization.tsx` on dev), in this order:

| #   | Old form field                                                       | Required | #66 field                                                   | Sent as                             |
| --- | -------------------------------------------------------------------- | -------- | ----------------------------------------------------------- | ----------------------------------- |
| 1   | Organization Name                                                    | yes      | **new** `organizationName`                                  | `p_org_name`                        |
| 2   | Organization Email Address                                           | yes      | the **account email** (old form: pre-filled and disabled)   | `users.email` (the account)         |
| 3   | Organization Representative Name                                     | yes      | `name` (already exists)                                     | `p_org_rep_name`                    |
| 4   | Representative Email Address (if different from the one given above) | no       | **replaces** `organizationEmail` with `representativeEmail` | `p_org_rep_email` (null when empty) |

So the account email **is** the organization's email, as in the old flow. #66's `organizationEmail` ("the organization's address, only if different") is the wrong way round and goes.

Work, as a #66 follow-up:

1. **Schema:**
   - **`organizationName` already exists on dev:** `organizationName: organizationNameSchema` in `lib/schema/organization.schema.ts:17-19`, with `organizationNameSchema` in `shared.schema.ts` (trimmed, at most 200 characters, allows digits and `. , & ' ( ) / -`, so "A&B Society 2.0" passes). Profile edit uses the same schema, and `__test__/schema.test.ts` covers it.
     - #66 branched before that, so **keep dev's version** when merging dev into #66 (the add/add conflict in `lib/schema/organization.schema.ts`, section 5.1).
     - Don't add a second rule: a different limit at sign-up would drift from profile edit.
   - Rename `organizationEmail` to `representativeEmail`, using `optionalProfileEmailSchema` (`lib/schema/profile-edit.shared.schema.ts:25`). It turns a blank input `''` into `undefined`, so sign-up and profile edit both send null to `p_org_rep_email` the same way. Drop #66's `field-utils.ts:38` workaround for it.
   - Update `ORGANIZATION_SIGN_UP_DEFAULTS`.
2. **Labels** (`lib/constants/sign-up.ts`), using the old form's wording:
   - `ORGANIZATION_NAME = 'Organization Name'`;
   - `REPRESENTATIVE_EMAIL = 'Representative Email Address (if different from the one given above)'`;
   - **rename** `ORGANIZATION_EMAIL` ('Organization Email Address', `sign-up.ts:48`) to `ORGANIZATION_ACCOUNT_EMAIL` and use it as `AccountSection`'s `emailLabel` (step 3). Delete only its description (`sign-up.ts:62`).
3. **Account email label:** in the organization form, the `AccountSection` email reads "Organization Email Address". Give `AccountSection` an `emailLabel` prop, which individuals leave as "Email". In application-only mode (3.1), the account email is shown read-only under the same label, like the old form's disabled field.
4. **Order in the form:** the account email sits in `AccountSection` above the Contact section, so on screen the order is Organization Email (Account) → Organization Name → Representative Name → Representative Email → phone. If design wants the old form's exact order (name first, then email), move the email out of `AccountSection` for organizations. That's a layout call; the fields and labels above are the same either way.
5. **Form:** `TextField`s like the others.
   - Organization Name: `required`, `autoComplete: 'organization'`, placed first in the Contact section, above "Organization Representative Name". `ContactSection` only has a slot after the name today (`children`), so add one for fields before it, e.g. a `leadingFields` prop. Individuals leave it empty.
   - Representative Email goes in the existing after-name slot, in place of `organizationEmail`.
6. **Tests and comments to update:**
   - Schema tests: `representativeEmail` is optional, validated, and `''` becomes undefined. `organizationName` is already covered on dev.
   - #66 tests that still use `organizationEmail`:
     - `__test__/sign-up-actions.test.ts:41`
     - `__test__/sign-up-fields.test.tsx:65,196`
     - `__test__/sign-up-forms.test.tsx:214-219` (uses `SIGN_UP_FIELD_LABELS.ORGANIZATION_EMAIL`)
     - `__test__/sign-up-sections.test.tsx:73-75,279,491-492`. The order assertion `name < organizationEmail < phoneNumber` becomes `organizationName < name < representativeEmail < phoneNumber`.
     - `__test__/schema.test.ts`: dev lines 39, 243, 257; #66 lines 33, 163, 172.
   - Comments: `ContactSection.tsx:20`, `field-utils.ts:38`.
   - New: the organization form's email label is "Organization Email Address".
7. **Display name:** for organizations, sign-up metadata `full_name` = `organizationName`, not the representative's name (3.2 step 3). The dashboard shows `org_name` as the member's name (`member-dashboard-service.ts:115`), and the renewal banner shows `user_metadata.full_name` (`renew-success/page.tsx:31`), so they match.

Nothing else needs changing for this mapping. Profile edit, the member dashboard and the profile displays already read `org_rep_email` as the representative's email and `users.email` as the account/organization email. The admin detail page reads only `org_name`, phone and `users.email`. It never shows `org_rep_name` / `org_rep_email`; that predates this plan and is out of scope.

## Current state

**Old flow** (`/membership/signup`):

1. `Step1Form` calls `signup()`, which creates the auth account only.
2. The user confirms their email, then logs in.
3. The proxy sends them to `/membership/form`. `Step2Form` calls `submitIndividualApplication` / `submitOrganizationApplication` (`app/actions/application.ts`), which call `create_individual_application` / `create_organization_application` (status `to_review`).
4. They land on `/membership/confirmation`.

**New flow** (#66): single-page forms at `/sign-up/individual` and `/sign-up/organization`. `signUpIndividual` / `signUpOrganization` are placeholders that only log the values. On failure, `SignUpFormInterface` shows a toast ("Submission failed. Try again later.").

## 1. Turn off email confirmation

**How email confirmation behaves once it's off (GoTrue v2.197.0):**

- An existing **confirmed** email: `signUp` always returns `422 user_already_exists`. There's no disguised 200 response.
- An existing **unconfirmed** email: `signUp` **doesn't check the password**. It marks the account confirmed and returns a session. **Anyone who types an unconfirmed person's email, with any password, gets logged into that account.**
- Unconfirmed users still can't log in normally: the password grant returns `email_not_confirmed` whether or not confirmation is on.

So dealing with unconfirmed accounts is **mandatory** and part of the switch. Do this on each project (dev, then prod), with approval for the database step:

1. **Preview** (read-only), using the same conditions as the delete in step 3:
   ```sql
   select u.id, u.email from auth.users u
   where u.email_confirmed_at is null and u.invited_at is null
     and not exists (select 1 from public.applications a where a.user_id = u.id)
     and not exists (select 1 from public.payments p where p.user_id = u.id);
   ```
   Also list any unconfirmed accounts that **do** have applications or payments. There should be none; look at them by hand if there are. Hosted dev on 2026-11-14: 0 unconfirmed of 11 accounts.
2. Turn off **"Confirm email"**: Dashboard → Authentication → Sign In / Providers → Email.
3. **Straight after,** delete them (decision 6), with approval for each project. Doing it before step 2 would leave a gap for anyone who signs up in between.

   ```sql
   delete from auth.users u
   where u.email_confirmed_at is null and u.invited_at is null
     and not exists (select 1 from public.applications a where a.user_id = u.id)
     and not exists (select 1 from public.payments p where p.user_id = u.id)
   returning u.id, u.email;
   ```

   - The guards are inside the delete, so it can't remove an account that gained an application after the preview. `invited_at is null` keeps dashboard invites (e.g. an admin invite) that haven't been accepted yet, which also count as unconfirmed. `returning` records what was deleted.
   - **Public side:** `public.users` has no foreign key to `auth.users`. The `delete_profile_from_auth` trigger deletes the row, and every foreign key to `public.users` (profiles, addresses, applications, payments) cascades.
   - **Auth side**, checked on hosted dev on 2026-11-15: every foreign key to `auth.users` cascades on delete (identities, sessions, mfa, one_time_tokens, oauth, webauthn), except `scim_users`, which sets the reference to null. Nothing blocks the delete. Re-check on prod before running it:
     `select conrelid::regclass, conname, confdeltype from pg_constraint where contype='f' and confrelid='auth.users'::regclass;`
   - SQL is fine for this. The admin API's `deleteUser` does the same delete plus an audit-log entry.

**Local:** in `supabase/config.toml`, under `[auth.email]`, set `enable_confirmations = false`, then restart the stack. A seed reset leaves no unconfirmed users.

**Effect:** `signUp` returns a session straight away, and the SSR client stores it in cookies.

**Switch on hosted with the first deploy that contains the integration PR (#78).** #78 needs confirmation off: if `signUp` returns no session, it refuses to create the application and shows "We couldn't create your account". The old `Step1Form` also tells users to check their email, which is wrong once confirmation is off. Simplest: let #66, #78 and #79 reach `dev` together, then do the switch straight away.

**Trade-off the team has accepted:** nobody proves they own the email they sign up with. Someone can sign up with another person's address, and that person then gets the RPRC emails. Password reset still goes to the real address, so the owner can take the account over.

## 2. Database (new migration, via `npx supabase migration new`)

1. **Lock the application functions to the service role.** Revoke `execute` on `create_individual_application` and `create_organization_application` from `public`, `anon` and `authenticated`, then `grant execute ... to service_role`.
   - Neither function checks `auth.uid()`, so today anyone with the public key can create an application for any `p_user_id`.
   - Use only `revoke` / `grant`; don't recreate the functions. The baseline has no `grant` statements, so Supabase's default privileges give `execute` back to `anon` and `authenticated` whenever a function is dropped and recreated. Add a comment saying that anyone who changes these signatures later must re-apply the revoke.
2. No enum, trigger or index changes. Applications are created as `to_review`, as today.
3. Run `npx supabase db reset`, then `npm run types` (should be unchanged).

## 3. Form modes, server actions and failure messages

### 3.1 One form, two modes

| Who opens `/sign-up/individual` or `/sign-up/organization` | Form shows                                                                                                                                              | Submit calls                                                          |
| ---------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| Logged out                                                 | Everything, including `AccountSection` (email, password, confirm)                                                                                       | `signUpIndividual` / `signUpOrganization` (account, then application) |
| Logged in, **no application**, on the form for their role  | No `AccountSection`. A read-only email field: "Email Address" for individuals, "Organization Email Address" for organizations (blocker section, step 3) | `applyAsIndividual` / `applyAsOrganization` (application only)        |
| Logged in, has an application                              | Proxy redirects to the dashboard (section 4)                                                                                                            |                                                                       |

- The page (a server component) reads the session and passes `mode: 'sign-up' | 'application-only'` to the form.
- **The page must not redirect when it finds an application.** Setting cookies in a server action makes Next re-render the current page on the server in the same response. A redirect there would send a user who just succeeded to the dashboard before they see the success section (held in client state, `isSubmitted` in `SignUpFormInterface.tsx:43-61`). Leave that redirect to the proxy on the next navigation.
- **After an application failure,** that re-render already passes `mode='application-only'`. Treat that server prop as the source of truth, and **don't** `key` or remount the form on mode, or React Hook Form loses the values. Hidden email and password values stay in form state, so build the application-only payload from the application schema's output, and never send the password to `applyAs*`.

**Schemas (zod 4).**

- Zod 4's `.omit()`, `.pick()`, `.partial()` and `.merge()` throw on object schemas that contain refinements, so you can't derive the application schema from #66's refined `individualSchema` / `organizationSchema`.
- Export unrefined base objects (`individualApplicationObject`, `organizationApplicationObject`, `accountObject`) and refine only at the leaves:
  - `accountSchema = accountObject.refine(passwordsMatch, …)`
  - `individualSignUpSchema = individualApplicationObject.extend(accountObject.shape).refine(passwordsMatch, …)`
  - the same for organizations;
  - don't use `z.intersection`.
- Add `when: (p) => accountObject.pick({ password: true, confirmPassword: true }).safeParse(p.value).success` to the password-match refine. In zod 4, an object-level refine is skipped while any field has an invalid-type or enum error, so today "Passwords do not match" only appears once the rest of the form is valid.
- Update the callers:
  - `__test__/schema.test.ts` (lines 4, 7, 185–260 on dev);
  - `types/sign-up-form.types.ts` and `lib/schema/index.ts` (#66).

### 3.2 Server actions

Both actions return a typed result so the form knows which message to show:

```ts
type SubmitResult =
  | { ok: true }
  | {
      ok: false;
      stage: 'account';
      reason: 'invalid' | 'email_exists' | 'duplicate_org_phone' | 'failed';
    }
  | {
      ok: false;
      stage: 'application';
      reason:
        | 'invalid'
        | 'not_signed_in'
        | 'already_has_application'
        | 'duplicate_org_phone'
        | 'failed';
    };
```

`SignUpFormInterface`'s contract changes. Today `onSubmit` throwing means failure (`SignUpFormInterface.tsx:24-25, 45-53`). It will return a `SubmitResult` and the form branches on it. Update `__test__/sign-up-forms.test.tsx` to match.

**`signUpIndividual` / `signUpOrganization`** (`app/actions/auth.ts`, replacing #66's placeholders):

1. Validate on the server with the combined sign-up schema.
2. **Organizations:** run the duplicate-phone check (the one in `application.ts`, around line 241) **before** `signUp`, with the admin client. Otherwise a conflict the user can fix leaves a brand-new account stuck in application-only mode. Return `{ stage: 'account', reason: 'duplicate_org_phone' }`.
3. `supabase.auth.signUp({ email, password, options: { data: { role, full_name } } })` with the SSR server client (`lib/supabase/server.ts`), so the session cookie is set.
   - **`role` comes from which action runs** (`signUpIndividual` → `'individual'`, `signUpOrganization` → `'organization'`), never from form values. The trigger copies it into `users.role`, and the proxy trusts it.
   - This doesn't close the separate, pre-existing hole of calling Supabase's sign-up API directly with `role: 'admin'` (see `.claude/CLAUDE.md`).
   - `full_name` is for the emails and the renewal page, which already reads `user_metadata.full_name`. Individuals: their `name`. **Organizations: `organizationName`**, not the representative's name, to match the dashboard, which shows `org_name`.
4. If `signUp` returns no session ("Confirm email" still on), return `{ stage: 'account', reason: 'failed' }` and log an error; don't create the application.
5. Errors: `error.code === 'user_already_exists'` (also accept `email_exists`) → `{ stage: 'account', reason: 'email_exists' }`. Anything else → `{ stage: 'account', reason: 'failed' }`; nothing was created.
   - Don't keep the old `public.users` email lookup.
   - The disguised-200 response can't happen once confirmation is off, so no branch is needed for it. One defensive line that treats an empty `identities` as `email_exists` is optional, with no test.
6. Then run the shared application step for `data.user.id`. If it fails, return its `{ stage: 'application', … }` result.
   - **No rollback:** keep the account and the session. `signUp` and the application function are separate transactions, so a real rollback isn't possible. A compensating `deleteUser` would add a second failure mode ("half-created") that's harder to explain to the user. Application-only mode makes recovery simple instead.

**`applyAsIndividual` / `applyAsOrganization`** (application only, in `app/actions/sign-up.ts`; named so they don't clash with the old `submit*Application` actions, which the removal PR deletes):

1. Take the user from `supabase.auth.getUser()` on the server. No user → `not_signed_in`. A `users.role` that doesn't match the form → `failed` (the proxy makes this unreachable in normal use).
2. Validate with the application schema → `invalid`.
3. The user already has an application → `already_has_application`. Organization duplicate phone → `duplicate_org_phone`.
4. Call the RPC with the **admin client** (`lib/supabase/admin.ts`), because section 2 revokes `authenticated`.
   - Individuals also send `p_fee_waiver` and `p_fee_waiver_reason` (#75).
   - Organizations use the mapping from the blocker section.
   - Errors → `failed`.
5. After the application is created, send the "application received" email. A failed email never fails the action: catch it and log it.
6. Return a `SubmitResult` instead of redirecting.

Steps 3–5 are a shared internal helper, so the sign-up action and the application-only action behave the same.

- **Known limit:** the one-application-per-user check is check-then-insert, with no unique constraint. Two tabs submitting at the same moment could both create an application. The disabled form covers double-clicks; add a database constraint later if it ever happens.
- **Server key:** every RPC and lookup above goes through `lib/supabase/admin.ts`, which needs `SUPABASE_SECRET_KEY` in the app's environment. Without it, the application step fails after the account exists.
- **Testing the failure path:** in development only, open the form with `?simulate=application-failure`. The sign-up actions then fail the application step after creating the account. The application-only actions ignore it, so the retry succeeds.

### 3.3 What the user sees

Show failures as a banner that stays at the top of the form (and scroll to it), not only as a toast:

| Result                                             | Message                                                                                                                                                                      | Form afterwards                                                                                                          |
| -------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `ok`                                               | #66's success section, with a link to the dashboard                                                                                                                          | replaced by the success section                                                                                          |
| `account` / `email_exists`                         | "This email already has an account. **Log in** to continue your application."                                                                                                | unchanged, values kept                                                                                                   |
| `account` or `application` / `duplicate_org_phone` | "An organization with this phone number has already applied. Check the number, or contact info@richmondprc.org."                                                             | unchanged, values kept                                                                                                   |
| `account` / `failed`                               | "We couldn't create your account. Nothing was saved, so please try again."                                                                                                   | unchanged, values kept                                                                                                   |
| `application` / `failed`, after `signUp`           | "**Your account was created, but your application wasn't submitted.** Your answers are still below. Please submit again. If it keeps failing, contact info@richmondprc.org." | switches **in place** to application-only mode (`AccountSection` hidden, values kept, button reads "Submit application") |
| `application` / `failed`, application-only         | "Your application wasn't submitted. Please try again. If it keeps failing, contact info@richmondprc.org."                                                                    | stays in application-only mode                                                                                           |
| `application` / `already_has_application`          | "You've already applied. **Go to your dashboard**."                                                                                                                          |                                                                                                                          |
| `application` / `not_signed_in`                    | "You've been signed out. **Log in** to continue your application."                                                                                                           |                                                                                                                          |
| `invalid`                                          | field errors from the schema                                                                                                                                                 |                                                                                                                          |

If the user leaves after an application failure, logging in later brings them back to the form in application-only mode (section 4).

## 4. Proxy and removal of the old sign-up path

### 4.1 Proxy (`lib/supabase/proxy.ts`)

- **Sign-up route check:** make it exact: `pathname === '/sign-up' || pathname.startsWith('/sign-up/')`. Today `startsWith` would also match `/sign-ups`.
- **One query** for logged-in non-admins: `from('users').select('role, applications(id)').eq('id', user.id).single()` gives both the role and whether they have an application.
- **Logged in, no application,** with `target = /sign-up/<role>`:
  - On `target`: let the request through (`return supabaseResponse`). Without this, `/sign-up/individual` would redirect to itself forever, because the current logic redirects every sign-up route for logged-in users (dev, lines ~100–106).
  - On `/`, `/membership`, `/sign-up`, or the other type's form: redirect to `target`.
  - On `/membership/*` pages: redirect to `target`, **except `/membership/payment/return`**.
    - Neither the dashboard (which renders an empty shell with no application) nor `renew-success` (reached only after renewing an existing application) needs to stay reachable.
    - The payment-return exemption is defensive (checkout needs a `payment_pending` application), but bouncing a Stripe return is the worst place to get this wrong.
  - **Scope:** this redirect applies only to `/`, `/membership`, `/membership/*` and `/sign-up*`. Never apply it to `/auth/*` (callback, forgot-password, reset-password), `/error` or `/api/*`. Otherwise, for example, a member without an application following a password-reset link would be bounced away from `/auth/reset-password`.
  - Role isn't `individual` or `organization` (e.g. `users.role = 'admin'` while the metadata isn't): send them to the dashboard, never to `/sign-up`, or they'd bounce back again.
- **Logged in, has an application:** sign-up routes, `/` and `/membership` redirect to the dashboard, as today.
- **Admins:** #77's dev bypass (lines ~74–83) runs first and sends admins from sign-up routes to the admin dashboard. No change.
- **Logged out on a protected route:** redirect to `ROUTES.HOME`, which has the log-in form, not `ROUTES.MEMBERSHIP_SIGNUP` (lines ~58–61). After #66, that's the type chooser, so a returning member whose session expired would land on sign-up instead of log-in.
- `next.config` redirects run before the proxy, so `/membership/form` → `/sign-up` then lets the proxy pick the right form.

### 4.2 Delete

- `app/membership/signup/` (including `const.ts` / `SIGNUP_STEPS`), `app/membership/form/` and `app/membership/confirmation/`
- `components/signup/Pages/Step1Form.tsx` and `Step2Form.tsx`.
  - Step2Form is rendered only by `/membership/form` and `/membership/signup`, and it calls the old submit actions.
  - Also remove the unused `Step2Form` import at `app/membership/renew-success/page.tsx:6`.
- `components/signup/layout/ProgressIndicator.tsx`. Only the deleted pages use it; also update the doc comment at `types/signup.ts:46`.
- the old `signup()` action and its response type
- the old redirecting `submitIndividualApplication` / `submitOrganizationApplication` (replaced in 3.2)
- `resendConfirmationEmail`: only `Step1Form` uses it. Also delete any orphaned `ResendConfirmationResponse` / `AuthErrorCode` members.
- `app/api/application/route.ts` (GET and POST) and `app/api/application/[id]/route.ts` (GET, PATCH and DELETE). Nothing calls them, and they have no auth check; the PATCH applies arbitrary request JSON. Also delete `hasApplication` (`lib/helpers/auth-helper.ts:51`, unused) and the `API_APPLICATION*` route constants.
- After that, check `components/signup/{cards,domain}/*` and `AddressInformation` (which use `useSignUp`). Whatever no longer has a user is dead code. Check whether renewal still needs `SignUpProvider` without Step2Form.

### 4.3 Keep (still used elsewhere)

> **Moved since (2026-11-16):** `components/signup` was merged away. `Step3Success` is now `components/sign-up/SignUpSuccess.tsx`; `MembershipInfoCard`, `SignUpInfoBox` and `SuccessInfoCard` are in `components/sign-up/cards/`; `InterestCard` is in `components/membership/`; the `inputs/*` files are in `components/forms/inputs/`. The paths below are as they were when this plan was written.

| Piece                                                                                                   | Used by                                                                           |
| ------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| `Step3Success`                                                                                          | renewal (`renew-success/page.tsx:7,40`) and #66 (`SignUpFormInterface.tsx:12,59`) |
| `SignUpProvider`                                                                                        | renewal (`renew-success/page.tsx:4,47`), possibly removable                       |
| `components/signup/inputs/PasswordInput`                                                                | reset password, homepage login                                                    |
| `inputs/FormInput`, `FormRadioButton`, `FormSelect`, `FormTextArea`, `PhoneInput`, `cards/InterestCard` | profile edit (`MembershipProfileEditForm.tsx:13-18`)                              |
| `MembershipInfoCard`, `SignUpInfoBox`                                                                   | #66 reuses them; move them to a shared folder                                     |
| `/auth/callback`                                                                                        | password reset links; check before touching                                       |

### 4.4 Routes

- Change `MEMBERSHIP_SIGNUP` to `/sign-up` (#66 does this). The navbar and homepage use the constant.
- Remove `MEMBERSHIP_FORM`, `MEMBERSHIP_CONFIRMATION` and `MEMBERSHIP_RENEW` from `ROUTES` and `PROTECTED_ROUTES`. `MEMBERSHIP_RENEW` (`routes.ts:22,46`) has no page behind it. Other users: `application.ts:146/288`, removed with the old actions, and `proxy.ts`, rewritten in 4.1.
- Add redirects in `next.config`: `/membership/signup` → `/sign-up`, and `/membership/form` → `/sign-up`.

## 5. PR order

1. **#66:** merge `dev` into it first. Expect add/add conflicts in `lib/schema/*` (#62 is already on dev), plus `app/actions/auth.ts`, `lib/constants/routes.ts` and the lockfile. Merge it as UI only.
2. **#66 follow-up:** the organization contact fields (blocker section). The schema rename, labels and form fields can go ahead now. Only the on-screen field order (blocker step 4) waits for design.
3. **Integration PR:** sections 1–3 and the proxy (4.1), plus the "received" email once the email work exists (until then, leave a clearly marked call site).
   - Unit tests, with Supabase mocked:
     - new user succeeds;
     - `email_exists`;
     - account creation fails;
     - organization duplicate phone is caught **before** `signUp`;
     - application step fails after `signUp`: `stage: 'application'`, no `deleteUser`, and the session is kept;
     - application-only submit: success, `not_signed_in`, `already_has_application`;
     - `role` comes from the action, not the form;
     - an email failure doesn't fail either action.
   - Form tests:
     - each result shows its banner;
     - after an application failure the form switches to application-only mode with the values kept, and the password isn't sent;
     - the page doesn't redirect on success.
   - Proxy tests:
     - a logged-in user with no application on `/sign-up/<role>` gets through (no redirect, no loop);
     - the other type's form, `/sign-up` and `/membership/dashboard` redirect to `/sign-up/<role>`;
     - `/membership/payment/return` is let through;
     - `/auth/reset-password` is let through for a user with no application;
     - a role other than individual or organization goes to the dashboard;
     - logged out on a protected route goes to `/`.
   - Switch test, on the local stack:
     1. Turn confirmation off with one unconfirmed user still present.
     2. Check that a repeat `signUp` for that email returns a session. That's the evidence for why the one-off in section 1 is mandatory.
     3. Run the one-off and check the repeat `signUp` now returns 422.
   - Manual pass on the local stack:
     1. Submit the form. You're logged in, the dashboard shows "Under Processing", and admins see the application as `to_review`.
     2. Submitting again with the same email shows "already has an account".
     3. Force the application step to fail (`?simulate=application-failure`). Check the banner, the mode switch, and that retrying succeeds.
     4. Log in as an account with no application and check you land on the right form in application-only mode.
4. **Removal PR:** 4.2–4.4.
5. **Deploy checklist** (hosted dev, then prod; each database step needs approval):
   1. `SUPABASE_SECRET_KEY` is set in the app's environment (Stripe already needs it).
   2. Merge #66, #78 and #79 together. CI applies the revoke migration; until the new app deploy is live, the old `/membership/form` gets "permission denied" on submit.
   3. Straight after: the section 1 switch (preview, turn off "Confirm email", delete unconfirmed accounts).

**As built:** #66 (`feat/revamp-signup-forms`), #78 (`feat/signup-integration`, integration) and #79 (`chore/remove-old-signup`, removal), stacked in that order.

## Decisions

1. **No email confirmation** (team decision, 2026-11-14). Applications go straight to `to_review`.
2. **Submission date:** admins see `created_at`, the submission time. No change.
3. **No account rollback** when the application step fails. Keep the account, say so clearly, and offer application-only mode (2026-11-14).
4. **`/membership/form` is retired,** along with `Step2Form` and `/membership/confirmation`. Application-only mode on `/sign-up/*` replaces them.
5. **Emails:** four, application received, payment pending (approved), active and rejected, all sent from server code. See `docs/email-templates-plan.md`.
6. **Unconfirmed accounts at the switch: delete them** (decided 2026-11-14). They never proved they own the address, and under the old flow they can't have an application. Deleting the auth user also deletes the `public.users` row through the trigger.
7. **Organization contact fields follow the old form** (decided 2026-11-15; see the blocker section):
   - Organization Name → `p_org_name`;
   - the account email is the organization's email;
   - Representative Name → `p_org_rep_name`;
   - the optional Representative Email → `p_org_rep_email`;
   - #66's `organizationEmail` is replaced.

Earlier ideas dropped: the `pending_confirmation` status and its trigger, hiding pending applications from admins, the unconfirmed-email handling in the action, the custom confirmation email, the "Your email is confirmed" callback page, and the `deleteUser` rollback.

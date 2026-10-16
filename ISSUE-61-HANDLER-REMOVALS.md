# Issue 61: Removed or Reduced Handlers and Mock Data

Inventory of the Issue 61 UI branch compared with `origin/dev` at `fad105c` (before restoring the removed handler flows). This record was created before the corrective implementation.

## Handlers removed or substantially reduced

| File | Handler or flow | What this branch removed or reduced | Demo implementation should retain |
| --- | --- | --- | --- |
| `components/signup/Pages/Step1Form.tsx` | `handleSubmit` | Removed the `signup` action call and its result branches for validation, existing email, user ID, and confirmation email; now validates and advances. | Keep validation and confirmation UI; comment out the action call and model a successful mock result, including a mock user ID/email confirmation state. |
| `components/signup/Pages/Step1Form.tsx` | `handleResendEmail` and related resend flow | Removed the handler, action call, rate-limit/error handling, countdown state/effect, and resend confirmation UI. | Keep the resend interaction and countdown; use mock success/error results without calling the action. |
| `components/signup/Pages/Step2Form.tsx` | `handleConfirmSubmit` | Removed FormData creation, role-based application action, result/error handling; now closes the modal, shows a toast, and advances. Also removed the authenticated user-role lookup effect. | Preserve form submission flow and role selection; comment out server action and use a mock success result. Use the selected signup role as the demo role. |
| `app/auth/forgot-password/page.tsx` | `handleSubmit` | Removed `forgotPassword` call, result/error handling, success state, and the “check your email” result view; replaced with an unavailable notice. | Keep the result/success flow and resend UI; comment out `await forgotPassword(...)` and assign a mock success result as Daniel described. |
| `app/auth/forgot-password/page.tsx` | `handleResendEmail` | Entire resend handler, countdown, and resend result/error UI were removed. | Restore it with a mock response and no action call. |
| `app/auth/reset-password/page.tsx` | reset-link verification effect | Removed URL error/code handling, `exchangeCodeForSession`, loading state, and invalid/expired-link routing. | Keep the verification/result states for UI preview; replace the backend result with a mock session/verification result. |
| `app/auth/reset-password/page.tsx` | `handleSubmit` | Removed `resetPassword`, weak-password/server-error handling, and success redirect; only client-side password-match validation remains, followed by a disabled-backend notice. | Keep validation and result states; use a mock success/error result instead of the server action. |
| `components/homepage/HomePageForm.tsx` | `handleSubmit` | Removed `login`, result/error mapping, exception handling, and submitting-state lifecycle; now shows an unavailable notice. | Keep the handler and UI states; replace the login result with a mock response. |
| `components/membership/MembershipInfoReviewModal.tsx` | `handleSubmit` | Removed `submitMembershipRenewal`, missing-user/error handling, and submitting state; now only closes and navigates. | Keep confirmation/error/loading flow; return a mock renewal result and route on mock success. |
| `components/admin/application/SubmitReview.tsx` | `handleConfirmSubmit` | Removed `submitApplicationReview`, validation/loading/error handling, form reset, and `router.refresh`; now closes the modal and shows a demo toast. | Preserve the handler/confirmation behavior; comment out the action and use a mock success result, while clearly indicating no review is saved. |
| `components/admin/application/ConflictResolution.tsx` | `handleConfirmSubmit` | Same removal as `SubmitReview`: action/result handling and refresh/reset were replaced by close + toast. | Preserve the handler and demo result path; no real action call. |
| `app/membership/dashboard/page.tsx` | dashboard data load effect | Removed auth/user lookup, member-dashboard action fetch, loading/error lifecycle; dashboard now reads one fixture directly. | Keep the page’s data consumer and loading/empty handling if useful; source data from a fixture rather than the backend. |
| `app/admin/dashboard/page.tsx` | dashboard data fetch | Removed application-list and stats service calls; now derives stats/list from local fixtures. | Keep the data shape and consumers; use fixtures as the service result. |
| `app/admin/dashboard/[id]/page.tsx` | application-detail data fetch | Removed server detail service call; now indexes the local detail fixture with an `APP01` fallback. | Keep route/data flow; use the matching detail mock and avoid silently substituting another application when an ID is missing. |
| `components/layout/Navbar.tsx` / `app/layout.tsx` / `components/providers/Providers.tsx` | auth-backed account/sign-out flow | Removed server-provided initial user, auth provider/context consumption, account menu, sign-out handler, and root user lookup. `Providers.tsx` was deleted. | Preserve the rendered preview shell and its mock account states where needed; backend auth calls can remain commented out with local mock auth state. |

## Mock data and mock shape removals

| File | Removed mock data or type | Current branch state |
| --- | --- | --- |
| `lib/constants/admin/application-details.ts` | `APPLICATIONS_MOCK`, `USERS_MOCK`, `USER_ADDRESSES_MOCK`, `INDIVIDUAL_PROFILES_MOCK`, `INDIVIDUAL_APPLICATION_DETAILS_MOCK` | Removed from their original source file. Recreate/retain these fixtures; avoid deleting mock source data as part of disabling Supabase. |
| `lib/constants/admin/application-details.ts` | `REVIEW_HISTORY_MOCK_ONE_APPROVAL`, `REVIEW_HISTORY_MOCK_ONE_REJECT`, `REVIEW_HISTORY_MOCK_CONFLICT`, `REVIEW_HISTORY_MOCK_APPROVAL`, `REVIEW_HISTORY_MOCK_NO_APPROVAL` | Removed. Some admin fixture data was added under `lib/mock-data/admin-applications.ts`, but the named scenario fixtures are no longer exported from their former file. |
| `types/review-history-mock.ts` | `ReviewHistoryMockType` | File deleted. Restore or replace with a clearly app-owned mock type if these fixture scenarios still use it. |

## Scope note

This is an inventory, not approval to remove any of the listed flows. For the demo, retain handlers and mock sources; comment out only Supabase/server-action calls and substitute deterministic mock results. Backend service and action modules remain owned by the backend work split.

## Follow-up implementation

The working tree now restores the removed mock fixtures and original mock history type. Reusable demo records live in `lib/mock-data/` and are exposed from `lib/mock-data/index.ts`; authenticated member data uses the shared `MOCK_AUTHENTICATED_USER` identity and member dashboard fixture. Admin list/detail pages continue to render their full application data from the same catalog, and the database-shaped admin fixtures are stored there with compatibility exports retained from the old constants module. Signup, resend, forgot-password, reset-password, login, renewal, admin review, and member/admin dashboard flows retain handler/result branches; backend action/service calls are commented at the call sites and local mock responses drive the demo. The recorded original removals remain above as an audit trail.

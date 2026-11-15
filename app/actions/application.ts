'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { ApplicationStatus, ReviewDecision } from '@/lib/constants/enums';
import { ROUTES } from '@/lib/constants/routes';
import { ReviewErrorMessage } from '@/lib/constants/application-errors';
import { isAdmin } from '@/lib/helpers/auth-helper';
import { isCalendarDate } from '@/lib/utils/time-utils';
import { isFeeWaiverGranted } from '@/lib/utils/fee-waiver';
import type { Database } from '@/types/database';

type SubmitApplicationReviewInput = {
  appId: string;
  reviewerName: string;
  reviewDate: string;
  decision: Database['public']['Enums']['review_decision'];
  reason: string;
  waiverDecision?: Database['public']['Enums']['review_decision'];
  waiverReason?: string;
};

type SubmitApplicationReviewResult = {
  success: boolean;
  error?: string;
};

function getNextApplicationStatus(
  reviews: Array<
    Pick<Database['public']['Tables']['application_reviews']['Row'], 'decision'>
  >,
): Database['public']['Enums']['application_status'] {
  const approveCount = reviews.filter(
    (review) => review.decision === ReviewDecision.APPROVE,
  ).length;
  const rejectCount = reviews.filter(
    (review) => review.decision === ReviewDecision.REJECT,
  ).length;

  if (approveCount >= 2) {
    return ApplicationStatus.PAYMENT_PENDING;
  }

  if (rejectCount >= 2) {
    return ApplicationStatus.REJECTED;
  }

  if (approveCount > 0 && rejectCount > 0) {
    return ApplicationStatus.CONFLICT;
  }

  return ApplicationStatus.TO_REVIEW;
}

export async function submitApplicationReview(
  input: SubmitApplicationReviewInput,
): Promise<SubmitApplicationReviewResult> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'User not authenticated' };
  }

  if (!(await isAdmin())) {
    return { success: false, error: 'Unauthorized: admin role required' };
  }

  if (
    !input.appId ||
    !input.reviewerName.trim() ||
    !input.reviewDate ||
    !input.decision ||
    !input.reason.trim()
  ) {
    return { success: false, error: 'All review fields are required' };
  }

  if (!isCalendarDate(input.reviewDate)) {
    return { success: false, error: ReviewErrorMessage.INVALID_REVIEW_DATE };
  }

  const { data: application } = await supabase
    .from('applications')
    .select('status')
    .eq('id', input.appId)
    .single();

  if (!application) {
    return { success: false, error: ReviewErrorMessage.NOT_FOUND };
  }
  // Only applications under review can be reviewed. Anything else (finalized, active, or
  // expiring/expired with last round's reviews still attached) would add a stray review.
  if (
    application.status !== ApplicationStatus.TO_REVIEW &&
    application.status !== ApplicationStatus.CONFLICT
  ) {
    return {
      success: false,
      error: ReviewErrorMessage.ALREADY_FINALIZED,
    };
  }

  const { data: existingReviews, error: reviewsError } = await supabase
    .from('application_reviews')
    .select('decision, waiver_decision')
    .eq('application_id', input.appId);

  if (reviewsError) {
    return { success: false, error: reviewsError.message };
  }

  const { data: insertedReview, error: insertError } = await supabase
    .from('application_reviews')
    .insert({
      application_id: input.appId,
      reviewer_name: input.reviewerName.trim(),
      decision: input.decision,
      reason: input.reason.trim(),
      // created_at defaults to the submission time.
      review_date: input.reviewDate,
      waiver_decision: input.waiverDecision ?? null,
      waiver_note: input.waiverReason ?? null,
    })
    .select('id')
    .single();

  if (insertError || !insertedReview) {
    return {
      success: false,
      error: insertError?.message ?? ReviewErrorMessage.SAVE_FAILED,
    };
  }

  // The outcome (and which review decides the waiver) is worked out from the reviews read
  // above. If another admin's review landed at the same time, that set is stale: withdraw
  // this review rather than record an outcome that ignores the other one.
  const withdrawReview = async () => {
    const { error: deleteError } = await supabase
      .from('application_reviews')
      .delete()
      .eq('id', insertedReview.id);
    if (deleteError) {
      // The review is still saved, so retrying would add a duplicate.
      return {
        success: false,
        error: ReviewErrorMessage.CONCURRENT_REVIEW_NOT_WITHDRAWN,
      };
    }
    return { success: false, error: ReviewErrorMessage.CONCURRENT_REVIEW };
  };

  const { data: reviewsNow, error: recountError } = await supabase
    .from('application_reviews')
    .select('id')
    .eq('application_id', input.appId);
  if (recountError) {
    return { success: false, error: recountError.message };
  }
  if ((reviewsNow?.length ?? 0) !== (existingReviews?.length ?? 0) + 1) {
    return withdrawReview();
  }

  const currentReview = {
    decision: input.decision as Database['public']['Enums']['review_decision'],
    waiver_decision: input.waiverDecision ?? null,
  };
  let nextStatus = getNextApplicationStatus([
    ...(existingReviews ?? []),
    currentReview,
  ]);

  // An approved application whose fee waiver is granted skips payment.
  if (nextStatus === ApplicationStatus.PAYMENT_PENDING) {
    const { data: details, error: detailsError } = await supabase
      .from('individual_application_details')
      .select('fee_waiver')
      .eq('application_id', input.appId)
      .maybeSingle();
    if (detailsError) {
      return { success: false, error: detailsError.message };
    }
    if (
      isFeeWaiverGranted({
        requested: details?.fee_waiver ?? false,
        earlierReviews: existingReviews ?? [],
        currentReview,
        resolvesConflict: application.status === ApplicationStatus.CONFLICT,
      })
    ) {
      nextStatus = ApplicationStatus.ACTIVE;
    }
  }

  const isFinalized =
    nextStatus === ApplicationStatus.PAYMENT_PENDING ||
    nextStatus === ApplicationStatus.ACTIVE ||
    nextStatus === ApplicationStatus.REJECTED;

  // Nothing to write when the outcome doesn't change the status (typically a first review
  // that leaves the application in to_review). Skipping it also means a review that another
  // admin's request has already counted is never withdrawn because of this update.
  //
  // Known gap: if this is the second review and a third lands before this update, the third
  // can update first, and this review is then withdrawn although the third counted it. A
  // database-side lock (an RPC with select ... for update) would close that; it's rare with
  // a handful of admins.
  if (nextStatus === application.status && !isFinalized) {
    revalidatePath(ROUTES.ADMIN_DASHBOARD);
    revalidatePath(ROUTES.ADMIN_APPLICATION_DETAIL(input.appId));
    return { success: true };
  }

  // Only applies if the status hasn't changed since it was read.
  const { data: updatedApplication, error: updateError } = await supabase
    .from('applications')
    .update({
      status: nextStatus,
      finalized_at: isFinalized ? new Date().toISOString() : null,
    })
    .eq('id', input.appId)
    .eq('status', application.status)
    .select('id');

  if (updateError) {
    return { success: false, error: updateError.message };
  }
  if (!updatedApplication?.length) {
    return withdrawReview();
  }

  revalidatePath(ROUTES.ADMIN_DASHBOARD);
  revalidatePath(ROUTES.ADMIN_APPLICATION_DETAIL(input.appId));

  if (isFinalized) {
    revalidatePath(ROUTES.MEMBERSHIP_DASHBOARD);
  }

  return { success: true };
}

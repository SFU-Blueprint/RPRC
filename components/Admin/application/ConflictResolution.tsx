'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AlertTriangle } from 'lucide-react';

import { inter, robotoCondensed } from '@/app/fonts';
import { BackdropContainer } from '@/components/admin/layout/BackdropContainer';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

import { submitApplicationReview } from '@/app/actions/application';
import { ReviewDecision } from '@/lib/constants/enums';
import type { ReviewHistoryItem } from '@/types/admin.types';

import SubmitReviewModal from './SubmitReviewModal';

type ConflictResolutionProps = {
  appId: string;
  reviewHistory: ReviewHistoryItem[];
};

export default function ConflictResolution({ appId, reviewHistory }: ConflictResolutionProps) {
  const router = useRouter();

  const [decision, setDecision] = useState<ReviewDecision | ''>('');
  const [reason, setReason] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const approvalCount = reviewHistory.filter(r => r.decision === ReviewDecision.APPROVE).length;
  const rejectionCount = reviewHistory.filter(r => r.decision === ReviewDecision.REJECT).length;

  const isFormValid = Boolean(decision && reason.trim());

  const handleConfirmSubmit = async () => {
    if (!isFormValid || isSubmitting) return;

    setIsSubmitting(true);
    setSubmitError('');

    const result = await submitApplicationReview({
      appId,
      reviewerName: 'Board Admin',
      reviewDate: new Date().toISOString().slice(0, 10),
      decision: decision as ReviewDecision,
      reason,
    });

    setIsSubmitting(false);

    if (!result.success) {
      setIsModalOpen(false);
      setSubmitError(result.error ?? 'Failed to submit review');
      return;
    }

    setDecision('');
    setReason('');
    setSubmitError('');
    setIsModalOpen(false);

    router.refresh();
  };

  return (
    <BackdropContainer className="bg-application-conflict-background border border-application-conflict-border p-5 rounded-xl flex flex-col gap-y-6 mt-3 w-full">
      <p className={`${robotoCondensed.className} text-3xl font-bold`}>Submit Review</p>

      {/* Conflict warning banner */}
      <div className="bg-application-conflict-note border-l-4 border-application-conflict-border rounded-md px-4 py-3">
        <div className="flex items-center gap-2 mb-1">
          <AlertTriangle size={18} className="text-application-conflict-border shrink-0" />
          <p className="font-semibold text-sm">Conflicting decisions</p>
        </div>
        <p className="text-sm text-application-detail-text-secondary">
          This application has {approvalCount} approval{approvalCount !== 1 ? 's' : ''} and{' '}
          {rejectionCount} rejection{rejectionCount !== 1 ? 's' : ''}. Please discuss with your
          team and finalize the decision with a note.
        </p>
      </div>

      <div>
        <Label className="text-application-detail-text-secondary text-md">Final Decision</Label>

        <div className="flex justify-center w-full mt-2">
          <RadioGroup
            value={decision}
            className="w-[75%] flex flex-row justify-between"
            onValueChange={(val) => setDecision(val as ReviewDecision)}
          >
            <div className="flex items-center gap-3">
              <RadioGroupItem
                value={ReviewDecision.APPROVE}
                id="conflict-approve"
                className="w-10 h-10 border-2 border-application-detail-border-100 cursor-pointer"
              />
              <Label
                htmlFor="conflict-approve"
                className="text-application-detail-text-primary text-md sm:text-sm cursor-pointer"
              >
                Approve
              </Label>
            </div>

            <div className="flex items-center gap-3">
              <RadioGroupItem
                value={ReviewDecision.REJECT}
                id="conflict-reject"
                className="w-10 h-10 border-2 border-application-detail-border-100 cursor-pointer"
              />
              <Label
                htmlFor="conflict-reject"
                className="text-application-detail-text-primary text-md sm:text-sm cursor-pointer"
              >
                Reject
              </Label>
            </div>
          </RadioGroup>
        </div>
      </div>

      <div>
        <Label htmlFor="conflict-reason" className="text-application-detail-text-secondary text-md">
          Resolution Note
        </Label>
        <textarea
          id="conflict-reason"
          name="reason"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className={`${inter.className} w-full h-42.5 bg-signup-neutral-50 border-2 border-[#D4D0C5] rounded-xl p-3.5 mt-2 focus:outline-none focus:border-ring focus:ring-ring/50 focus:ring-[3px]`}
          placeholder="Enter your reasoning..."
        />
      </div>

      {submitError ? <p className="text-destructive text-sm">{submitError}</p> : null}

      <div className="flex justify-center mt-10">
        <Button
          type="button"
          onClick={() => setIsModalOpen(true)}
          disabled={!isFormValid || isSubmitting}
          className="bg-primary hover:bg-primary/90 cursor-pointer"
        >
          {isSubmitting ? 'Submitting…' : 'Submit Review'}
        </Button>
      </div>

      <SubmitReviewModal
        isOpen={isModalOpen}
        reviewHistory={reviewHistory}
        action={decision as ReviewDecision}
        setModalOpen={setIsModalOpen}
        onConfirm={handleConfirmSubmit}
        isSubmitting={isSubmitting}
      />
    </BackdropContainer>
  );
}

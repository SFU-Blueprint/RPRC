'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { inter, robotoCondensed } from '@/app/fonts';
import { BackdropContainer } from '@/components/admin/layout/BackdropContainer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

import { submitApplicationReview } from '@/app/actions/application';
import { ReviewDecision } from '@/lib/constants/enums';
import type { ReviewHistoryItem } from '@/types/admin.types';

import SubmitReviewModal from './SubmitReviewModal';

type SubmitReviewProps = {
  appId: string;
  reviewHistory: ReviewHistoryItem[];
};

export default function SubmitReview({ appId, reviewHistory }: SubmitReviewProps) {
  const router = useRouter();

  const [boardMemberName, setBoardMemberName] = useState('');
  const [reviewDate, setReviewDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [decision, setDecision] = useState<ReviewDecision | ''>('');
  const [reason, setReason] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const isFormValid = Boolean(boardMemberName && reviewDate && decision && reason);

  const handleConfirmSubmit = async () => {
    if (!isFormValid || isSubmitting) return;

    setIsSubmitting(true);
    setSubmitError('');

    const result = await submitApplicationReview({
      appId,
      reviewerName: boardMemberName,
      reviewDate,
      decision: decision as ReviewDecision,
      reason,
    });

    setIsSubmitting(false);

    if (!result.success) {
      setIsModalOpen(false);
      setSubmitError(result.error ?? 'Failed to submit review');
      return;
    }

    // Reset form after successful submission
    setBoardMemberName('');
    setReviewDate(new Date().toISOString().slice(0, 10));
    setDecision('');
    setReason('');
    setSubmitError('');
    setIsModalOpen(false);

    router.refresh();
  };

  return (
    <BackdropContainer className="bg-signup-neutral-50 shadow-card p-4 text w-full">
      <p className={`${robotoCondensed.className} text-3xl font-bold border-b pb-5`}>Submit Review</p>

      <div className="flex flex-col gap-x-6 gap-y-4 mt-8">
        <div className="flex-2">
          <Label htmlFor="boardMemberName" className="text-application-detail-text-secondary text-md">
            Board Member Name
          </Label>
          <Input
            id="boardMemberName"
            placeholder="Enter your name"
            value={boardMemberName}
            onChange={(e) => setBoardMemberName(e.target.value)}
            className="mt-2 w-full"
          />
        </div>

        <div className="flex-1">
          <Label htmlFor="reviewDate" className="text-application-detail-text-secondary text-md">
            Review Date
          </Label>
          <Input
            id="reviewDate"
            type="date"
            value={reviewDate}
            onChange={(e) => setReviewDate(e.target.value)}
            className="mt-2 w-full"
          />
        </div>
      </div>

      <div className="mt-4">
        <Label className="text-application-detail-text-secondary text-md">Decision</Label>

        <div className="flex justify-center w-full mt-2">
          <RadioGroup
            value={decision}
            className="w-[75%] flex flex-row justify-between"
            onValueChange={(val) => setDecision(val as ReviewDecision)}
          >
            <div className="flex items-center gap-3">
              <RadioGroupItem
                value={ReviewDecision.APPROVE}
                id="approve"
                className="w-10 h-10 border-2 border-application-detail-border-100 cursor-pointer"
              />
              <Label
                htmlFor="approve"
                className="text-application-detail-text-primary text-md sm:text-sm cursor-pointer"
              >
                Approve
              </Label>
            </div>

            <div className="flex items-center gap-3">
              <RadioGroupItem
                value={ReviewDecision.REJECT}
                id="reject"
                className="w-10 h-10 border-2 border-application-detail-border-100 cursor-pointer"
              />
              <Label
                htmlFor="reject"
                className="text-application-detail-text-primary text-md sm:text-sm cursor-pointer"
              >
                Reject
              </Label>
            </div>
          </RadioGroup>
        </div>
      </div>

      <div>
        <Label htmlFor="reason" className="text-application-detail-text-secondary text-md">
          Note
        </Label>
        <textarea
          id="reason"
          name="reason"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className={`${inter.className} w-full h-15 border-2 border-[#D4D0C5] rounded-xl p-3.5 mt-2 focus:outline-none focus:border-ring focus:ring-ring/50 focus:ring-[3px]`}
          placeholder="Enter your reasoning..."
        />
      </div>

      {submitError ? <p className="text-destructive text-sm">{submitError}</p> : null}

      <div className="flex justify-center mt-3">
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
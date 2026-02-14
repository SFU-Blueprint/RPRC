'use client';

import { inter } from '@/app/fonts';
import { Input } from '@/components/ui/Input';
import { RadioGroup } from '@/components/Admin';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { AdminSection } from './AdminSection';
import SubmitReviewModal from './SubmitReviewModal';

export default function SubmitReview() {
  const [boardMemberName, setBoardMemberName] = useState('');
  const [reviewDate, setReviewDate] = useState('');
  const [decision, setDecision] = useState('');
  const [reason, setReason] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const isFormValid = boardMemberName && reviewDate && decision && reason;

  return (
    <AdminSection title="Submit Your Review">
      <div>
        <label
          htmlFor="board-member-name"
          className={`${inter.className} block mb-2 font-medium`}
        >
          Board Member Name
        </label>
        <Input
          id="board-member-name"
          type="text"
          placeholder="Enter your name"
          value={boardMemberName}
          onChange={(e) => setBoardMemberName(e.target.value)}
          className="w-[370px] h-10 px-3 py-2 border-2 border-[#D4D0C5] rounded-xl"
        />
      </div>
      <div className="mt-5.5">
        <label
          htmlFor="review-date"
          className={`${inter.className} block mb-2 font-medium`}
        >
          Review Date
        </label>
        <Input
          id="review-date"
          type="text"
          value={reviewDate}
          onChange={(e) => setReviewDate(e.target.value)}
          className="w-[384px] h-10 px-3 py-2 border-2 border-[#D4D0C5] rounded-xl"
        />
      </div>
      <RadioGroup
        label="Decision"
        name="decision"
        options={[
          { label: 'Approve', value: 'approve' },
          { label: 'Reject', value: 'reject' },
        ]}
        selectedValue={decision}
        onChange={setDecision}
        additionalClasses={{
          wrapper: 'mt-[22px]',
          optionsContainer: 'gap-x-[13px]',
          option:
            'border-2 border-[#D4D0C5] rounded-xl w-[356px] py-3.5 flex items-center justify-center',
          radioLabel: 'text-base',
        }}
      />
      <div>
        <p className={`${inter.className} block mb-2 font-medium mt-5.5`}>
          Reason
        </p>
        <textarea
          name="reason"
          id="reason"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="w-full h-42.5 border-2 border-[#D4D0C5] rounded-xl p-3.5"
          placeholder="Enter your reasoning..."
        />
      </div>
      <div className="flex justify-center mt-10">
        <Button
          type="button"
          onClick={() => {
            // TODO: submit to API, then open modal
            setIsModalOpen(true);
          }}
          disabled={!isFormValid}
          className="bg-[#5EB42D] border-transparent"
        >
          Submit Review
        </Button>
      </div>
      <SubmitReviewModal isOpen={isModalOpen} setModalOpen={setIsModalOpen} />
    </AdminSection>
  );
}

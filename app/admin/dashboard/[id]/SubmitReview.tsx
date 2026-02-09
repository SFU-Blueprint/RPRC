'use client';

import { inter, robotoCondensed } from '@/app/fonts';
import { Input } from '@/components/ui/input';
import { RadioGroup } from '@/components/RadioGroup';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/Modal';
import SubmitReviewModal from './SubmitReviewModal';

export default function SubmitReview({}) {
  const [boardMemberName, setBoardMemberName] = useState('');
  const [reviewDate, setReviewDate] = useState('');
  const [decision, setDecision] = useState('');
  const [reason, setReason] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Check if any field is empty
  const isFormValid = boardMemberName && reviewDate && decision && reason;

  return (
    <div className="flex-1">
      <p className={`${robotoCondensed.className} text-[32px] font-bold`}>
        Submit Your Review
      </p>
      <div className="rounded-4xl border-2 border-[#E6E3DA] py-10.75 px-8.5 mt-6">
        <Input
          label="Board Member Name"
          placeholder="Enter your name"
          value={boardMemberName}
          onChange={(e) => setBoardMemberName(e.target.value)}
          additionalClasses={{ input: 'w-[370px]' }}
        />
        <Input
          label="Review Date"
          // type="date"
          value={reviewDate}
          onChange={(e) => setReviewDate(e.target.value)}
          additionalClasses={{ input: 'w-[384px]', wrapper: 'mt-5.5' }}
        />
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
          ></textarea>
        </div>
        <div className="flex justify-center mt-10">
          <Button
            handleClick={() => {
              // Handle form submission
              console.log({ boardMemberName, reviewDate, decision, reason });
              setIsModalOpen(true);
            }}
            disabled={!isFormValid}
            additionalClasses={{ button: ['bg-[#5EB42D] border-transparent'] }}
          >
            Submit Review
          </Button>
        </div>
      </div>
      <SubmitReviewModal isOpen={isModalOpen} setModalOpen={setIsModalOpen} />
    </div>
  );
}

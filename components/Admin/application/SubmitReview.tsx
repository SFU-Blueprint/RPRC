'use client';

import { inter } from '@/app/fonts';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup } from '@/components/RadioGroup';
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
        <Label htmlFor="boardMemberName">Board Member Name</Label>
        <Input
          id="boardMemberName"
          placeholder="Enter your name"
          value={boardMemberName}
          onChange={(e) => setBoardMemberName(e.target.value)}
          className="w-[370px] mt-2"
        />
      </div>
      
      <div className="mt-5.5">
        <Label htmlFor="reviewDate">Review Date</Label>
        <Input
          id="reviewDate"
          type="date"
          value={reviewDate}
          onChange={(e) => setReviewDate(e.target.value)}
          className="w-[384px] mt-2"
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

      <div className="mt-5.5">
        <Label htmlFor="reason">Reason</Label>
        <textarea
          name="reason"
          id="reason"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className={`${inter.className} w-full h-42.5 border-2 border-[#D4D0C5] rounded-xl p-3.5 mt-2 focus:outline-none focus:border-ring focus:ring-ring/50 focus:ring-[3px]`}
          placeholder="Enter your reasoning..."
        />
      </div>

      <div className="flex justify-center mt-10">
        <Button
          onClick={() => {
            console.log({ boardMemberName, reviewDate, decision, reason });
            setIsModalOpen(true);
          }}
          disabled={!isFormValid}
          className="bg-[#5EB42D] border-transparent hover:bg-[#4da327]"
        >
          Submit Review
        </Button>
      </div>
      <SubmitReviewModal isOpen={isModalOpen} setModalOpen={setIsModalOpen} />
    </AdminSection>
  );
}

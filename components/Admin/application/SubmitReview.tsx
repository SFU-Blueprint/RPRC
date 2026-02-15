'use client';

import { inter } from '@/app/fonts';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { AdminSection } from './AdminSection';
import SubmitReviewModal from './SubmitReviewModal';
import { BackdropContainer } from '@/components/ui/BackdropContainer';
import { robotoCondensed } from '@/app/fonts';
import "@/app/globals.css";
import { RadioGroupItem, RadioGroup } from '@/components/ui/radio-group';

import { ReviewHistoryMockType } from '@/types/review-history-mock';

export default function SubmitReview({ reviewHistory }: { reviewHistory: ReviewHistoryMockType[] }) {

  const [boardMemberName, setBoardMemberName] = useState('');
  const [reviewDate, setReviewDate] = useState('');
  const [decision, setDecision] = useState('');
  const [reason, setReason] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const isFormValid = boardMemberName && reviewDate && decision && reason;

  return (
    <BackdropContainer className="bg-application-detail-background border border-application-detail-border-50 p-5 rounded-lg flex flex-col gap-y-6 mt-6 w-full" >
      <p className={`${robotoCondensed.className} text-[32px] font-bold`}>
        Submit Review
      </p>
      <div className="flex flex-col md:flex-row gap-x-6">
        <div className="flex-2">
          <Label htmlFor="boardMemberName" className='text-application-detail-text-secondary text-md'>Board Member Name</Label>
          <br />
          <Input
            id="boardMemberName"
            placeholder="Enter your name"
            value={boardMemberName}
            onChange={(e) => setBoardMemberName(e.target.value)}
            className="mt-2 w-full"
          />
        </div>

        <div className="flex-1 mt-4 md:mt-0">
          <Label htmlFor="reviewDate" className='text-application-detail-text-secondary text-md'>Review Date</Label>
          <br />
          <Input
            id="reviewDate"
            type="date"
            value={reviewDate}
            onChange={(e) => setReviewDate(e.target.value)}
            className="mt-2 w-full"
          />
        </div>
      </div>

      <Label className='text-application-detail-text-secondary text-md'>Decision</Label>
      <div className="flex justify-center w-full">
        <RadioGroup defaultValue="" className='w-[75%] flex flex-row justify-between ' onValueChange={setDecision}>
          <div className="flex items-center gap-3">
            <RadioGroupItem value="approve" id="approve" className="w-10 h-10 border-2 border-application-detail-border-100 cursor-pointer" />
            <Label htmlFor="approve" className='text-application-detail-text-primary text-md sm:text-xs cursor-pointer'>Approve</Label>
          </div>
          <div className="flex items-center gap-3">
            <RadioGroupItem value="reject" id="reject" className="w-10 h-10 border-2 border-application-detail-border-100 cursor-pointer" />
            <Label htmlFor="reject" className='text-application-detail-text-primary text-md sm:text-sm cursor-pointer'>Reject</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="mt-5.5">
        <Label htmlFor="reason" className='text-application-detail-text-secondary text-md'>Reason</Label>
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
          className="bg-primary hover:bg-primary/10 cursor-pointer"
        >
          Submit Review
        </Button>
      </div>
      <SubmitReviewModal isOpen={isModalOpen} reviewHistory={reviewHistory} action={decision as 'approve' | 'reject'} setModalOpen={setIsModalOpen} />
    </BackdropContainer >
  );
}

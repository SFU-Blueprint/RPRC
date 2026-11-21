import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';

import AdminReview from '@/components/admin/application/AdminReview';
import { ReviewDecision } from '@/lib/constants/enums';

const baseProps = {
  reviewDate: '2026-11-10',
  reviewerName: 'Board Member',
  decision: ReviewDecision.APPROVE,
  reason: 'Looks good.',
  isFinalDecision: false,
};

describe('AdminReview fee waiver row', () => {
  test('is hidden when the review made no waiver decision', () => {
    // ReviewHistory passes `waiver_decision ?? undefined`.
    render(<AdminReview {...baseProps} waiverDecision={undefined} />);
    expect(screen.queryByText('Fee Waived?')).toBeNull();
  });

  test('shows Yes when the waiver was approved', () => {
    render(
      <AdminReview {...baseProps} waiverDecision={ReviewDecision.APPROVE} />,
    );
    expect(screen.getByText('Fee Waived?')).toBeDefined();
    expect(screen.getByText('Yes')).toBeDefined();
  });

  test('shows No when the waiver was rejected', () => {
    render(
      <AdminReview {...baseProps} waiverDecision={ReviewDecision.REJECT} />,
    );
    expect(screen.getByText('No')).toBeDefined();
  });
});

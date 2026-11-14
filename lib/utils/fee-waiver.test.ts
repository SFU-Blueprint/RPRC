import { describe, expect, it } from 'vitest';
import { isFeeWaiverGranted } from './fee-waiver';

const approve = (waiver: 'approve' | 'reject' | null = null) => ({
  decision: 'approve' as const,
  waiver_decision: waiver,
});
const reject = () => ({ decision: 'reject' as const, waiver_decision: null });

describe('isFeeWaiverGranted', () => {
  it('is never granted when no waiver was requested', () => {
    expect(
      isFeeWaiverGranted({
        requested: false,
        earlierReviews: [approve('approve')],
        currentReview: approve('approve'),
        resolvesConflict: false,
      }),
    ).toBe(false);
  });

  describe('two approvals in a row', () => {
    it("uses the first reviewer's waiver decision", () => {
      expect(
        isFeeWaiverGranted({
          requested: true,
          earlierReviews: [approve('approve')],
          currentReview: approve('reject'),
          resolvesConflict: false,
        }),
      ).toBe(true);
      expect(
        isFeeWaiverGranted({
          requested: true,
          earlierReviews: [approve('reject')],
          currentReview: approve('approve'),
          resolvesConflict: false,
        }),
      ).toBe(false);
    });

    it("uses the second reviewer's decision when the first left it blank", () => {
      expect(
        isFeeWaiverGranted({
          requested: true,
          earlierReviews: [approve(null)],
          currentReview: approve('approve'),
          resolvesConflict: false,
        }),
      ).toBe(true);
    });

    it('is not granted when neither reviewer decided the waiver', () => {
      expect(
        isFeeWaiverGranted({
          requested: true,
          earlierReviews: [approve(null)],
          currentReview: approve(null),
          resolvesConflict: false,
        }),
      ).toBe(false);
    });
  });

  describe('approval by conflict resolution', () => {
    it("lets the resolution's waiver decision override the reviewers'", () => {
      expect(
        isFeeWaiverGranted({
          requested: true,
          earlierReviews: [approve('reject'), reject()],
          currentReview: approve('approve'),
          resolvesConflict: true,
        }),
      ).toBe(true);
      expect(
        isFeeWaiverGranted({
          requested: true,
          earlierReviews: [reject(), approve('approve')],
          currentReview: approve('reject'),
          resolvesConflict: true,
        }),
      ).toBe(false);
    });

    it("keeps the approving reviewer's decision when the resolution leaves it blank", () => {
      expect(
        isFeeWaiverGranted({
          requested: true,
          earlierReviews: [reject(), approve('approve')],
          currentReview: approve(null),
          resolvesConflict: true,
        }),
      ).toBe(true);
    });

    it('ignores waiver decisions on rejecting reviews', () => {
      expect(
        isFeeWaiverGranted({
          requested: true,
          earlierReviews: [
            { decision: 'reject', waiver_decision: 'approve' },
            approve(null),
          ],
          currentReview: approve(null),
          resolvesConflict: true,
        }),
      ).toBe(false);
    });
  });
});

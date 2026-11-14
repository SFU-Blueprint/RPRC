import { describe, expect, it } from 'vitest';
import { formatCalendarDate } from './time-utils';

describe('formatCalendarDate', () => {
  it('formats the calendar date as given, regardless of time zone', () => {
    // new Date('2026-11-14') is midnight UTC, which is Nov 13 west of UTC.
    expect(formatCalendarDate('2026-11-14')).toBe('Nov 14th, 2026');
    expect(formatCalendarDate('2026-03-01')).toBe('Mar 1st, 2026');
    expect(formatCalendarDate('2026-12-22')).toBe('Dec 22nd, 2026');
  });

  it('returns the input unchanged when it is not a YYYY-MM-DD date', () => {
    expect(formatCalendarDate('not a date')).toBe('not a date');
  });
});

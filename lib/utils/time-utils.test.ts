import { describe, expect, it } from 'vitest';
import {
  formatCalendarDate,
  getLocalDateString,
  isCalendarDate,
} from './time-utils';

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

describe('getLocalDateString', () => {
  it('uses the local date, not the UTC date', () => {
    // 8pm local time: in Vancouver the UTC date is already the next day.
    expect(getLocalDateString(new Date(2026, 10, 13, 20, 0))).toBe(
      '2026-11-13',
    );
    expect(getLocalDateString(new Date(2026, 0, 5, 9, 0))).toBe('2026-01-05');
  });
});

describe('isCalendarDate', () => {
  it('accepts real YYYY-MM-DD dates only', () => {
    expect(isCalendarDate('2026-11-14')).toBe(true);
    expect(isCalendarDate('2024-02-29')).toBe(true);
    expect(isCalendarDate('2026-02-30')).toBe(false);
    expect(isCalendarDate('today')).toBe(false);
    expect(isCalendarDate('Nov 14 2026')).toBe(false);
    expect(isCalendarDate('2026-11-14T00:00:00Z')).toBe(false);
  });
});

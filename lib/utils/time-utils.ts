function getOrdinal(day: number) {
  if (day > 3 && day < 21) return 'th';
  switch (day % 10) {
    case 1:
      return 'st';
    case 2:
      return 'nd';
    case 3:
      return 'rd';
    default:
      return 'th';
  }
}

export function formatDateWithOrdinal(date: string | Date) {
  const d = new Date(date);

  const day = d.getDate();
  const month = d.toLocaleString('en-US', { month: 'short' });
  const year = d.getFullYear();

  return `${month} ${day}${getOrdinal(day)}, ${year}`;
}

/**
 * Formats a calendar date (YYYY-MM-DD) without converting time zones. Parsing it with
 * `new Date()` would read it as midnight UTC and show the previous day west of UTC.
 */
export function formatCalendarDate(date: string) {
  const [year, month, day] = date.split('-').map(Number);
  if (!year || !month || !day) return date;
  return formatDateWithOrdinal(new Date(year, month - 1, day));
}

export function formatDisplayDate(date: string) {
  if (!date) return '';
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return date;
  return formatDateWithOrdinal(parsed);
}

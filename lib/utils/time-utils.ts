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
 * Today's date (YYYY-MM-DD) in the user's time zone. `toISOString()` would give the UTC date,
 * which is already tomorrow in the evening west of UTC.
 */
export function getLocalDateString(date: Date = new Date()) {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/** Whether a value is a real calendar date written as YYYY-MM-DD. */
export function isCalendarDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
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

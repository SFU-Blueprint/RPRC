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

  return `${day}${getOrdinal(day)} ${month} ${year}`;
}

export function formatDisplayDate(date: string) {
  if (!date) return '';
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return date;
  return formatDateWithOrdinal(parsed);
}

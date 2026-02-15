import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

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

export function scrollToFirstError(errors: Record<string, string | undefined>) {
  // Get first key that has an actual error
  const firstErrorKey = Object.keys(errors).find(
    (key) => errors[key] !== undefined,
  );

  if (!firstErrorKey) return; // No errors to scroll to

  const cleanKey = firstErrorKey.replace('Id', '');

  // Find element to scroll to by name
  let elements = Array.from(document.getElementsByName(cleanKey));
  let element = elements.find((el) => !el.hidden);

  if (!element) {
    element = document.getElementById(cleanKey)!;
  }

  element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
export { formatDateWithOrdinal, formatDisplayDate } from '@/lib/utils/time-utils';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
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

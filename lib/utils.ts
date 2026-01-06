import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format a number as currency.
 * Returns a hyphen if the value is null/undefined/NaN.
 */
export function formatCurrency(
  value: number | null | undefined,
  currency = 'USD',
  locale = 'en-US'
) {
  if (value == null || Number.isNaN(value)) return '-';
  return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(value);
}

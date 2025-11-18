import { toast } from 'react-toastify';

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function onMutateError(error: any) {
  if (!error) return;
  return toast.error(error?.response?.data?.meta?.message || error?.message || error?.statusText);
}

export const sleep = async (time: number) => {
  return new Promise<void>((resolve) =>
    setTimeout(() => {
      resolve();
    }, time)
  );
};

/**
 * Format Number With Custom Fraction Precision
 * Can expan with more locale option
 *
 * @param {(string | number | null | undefined)} value The Inputed Number/String
 * @param {{ minFrac?: number; maxFrac?: number }} [params={
 *     maxFrac: undefined,
 *     minFrac: 2,
 *   }] maxFrac is set to undefined to not cause any data loss, minFrac decide how many zeros ex. 0.000 is 3
 * @returns {string} The Inputed Number Formated With Minimum And Maximum Fraction Digits
 */
export function FormatNum(
  value: string | number | null | undefined,
  params: { minFrac?: number; maxFrac?: number } = {
    maxFrac: undefined,
    minFrac: 2,
  }
): string {
  if (value === undefined || value === null) return '-';
  if (Number.isNaN(value)) return `invalid number: ${value}`;
  return Number(value).toLocaleString(undefined, {
    maximumFractionDigits: params.maxFrac,
    minimumFractionDigits: params.minFrac,
  });
}

export const formatDate = (date: Date, locale: string = 'en-us'): string => {
  return date.toLocaleDateString(locale, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

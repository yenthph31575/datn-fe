import type { ButtonProps } from '../button';

export interface DateRangePickerProps {
  /** Click handler for applying the updates from DateRangePicker. */
  onUpdate?: (values: {
    range?: DateRange;
    rangeCompare?: DateRange;
    typeDate: 'range' | 'multiple';
    listDate?: Date[];
  }) => void;
  /** Initial value for start date */
  initialDateFrom?: Date | string;
  /** Initial value for end date */
  initialDateTo?: Date | string;
  /** Initial value for start date for compare */
  initialCompareFrom?: Date | string;
  /** Initial value for end date for compare */
  initialCompareTo?: Date | string;
  // Initial value multiple date
  listDate?: Date[] | string[];
  /** Alignment of popover */
  align?: 'start' | 'center' | 'end';
  /** Option for locale */
  locale?: string;
  /** Option for showing compare feature */
  showCompare?: boolean;

  prefix?: any;
  suffix?: any;
  btnProps?: ButtonProps;
  sidebar?: boolean;
}

export const formatDate = (date: Date, locale: string = 'en-us'): string => {
  return date?.toLocaleDateString(locale, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

export interface DateRange {
  from: Date;
  to: Date | undefined;
}

export interface Preset {
  name: string;
  label: string;
}

// Define presets
export const PRESETS: Preset[] = [
  { name: 'today', label: 'Today' },
  { name: 'yesterday', label: 'Yesterday' },
  { name: 'last7', label: 'Last 7 days' },
  { name: 'last14', label: 'Last 14 days' },
  { name: 'last30', label: 'Last 30 days' },
  { name: 'thisWeek', label: 'This Week' },
  { name: 'lastWeek', label: 'Last Week' },
  { name: 'thisMonth', label: 'This Month' },
  { name: 'lastMonth', label: 'Last Month' },
  { name: 'custom-dates', label: 'Custom range' },
  { name: 'multiple-dates', label: 'Multiple Dates' },
];

import React from 'react';
import type { Control, FieldPath, FieldPathValue, FieldValues } from 'react-hook-form';

import { cn } from '@/libs/common';
import { DatePicker, type DatePickerProps } from '../ui/date-picker';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Show } from '../utilities';

interface Props<T extends FieldValues = FieldValues> extends Omit<DatePickerProps, 'onChange' | 'value'> {
  control: Control<T>;
  name: FieldPath<T>;
  label?: string;
  labelClassName?: string;
  defaultValue?: FieldPathValue<T, FieldPath<T>>;
  onChange?: (value?: Date) => void;
}

const DatePickerField = <T extends FieldValues>({
  control,
  name,
  label = 'Choose date',
  required,
  className,
  calendarProps,
  disablePast = true,
  labelClassName,
  onChange,
  ...props
}: Props<T>) => {
  return (
    <FormField
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <FormItem>
          <FormControl>
            <div className="space-y-1">
              <Show when={!!label}>
                <FormLabel className={labelClassName}>
                  {label} {required && <span className="text-red-500">*</span>}
                </FormLabel>
              </Show>
              <DatePicker
                className={cn(className, {
                  'border-amaranth-600 shadow-[0px_0px_0px_4px_#E0384B40] outline-amaranth-600': !!fieldState.error,
                })}
                disablePast={disablePast}
                calendarProps={calendarProps}
                {...props}
                {...field}
                onChange={(date) => {
                  field.onChange(date);
                  onChange?.(date);
                }}
              />
            </div>
          </FormControl>
          <FormMessage className="mt-1 text-xs" />
        </FormItem>
      )}
    />
  );
};

export { DatePickerField };

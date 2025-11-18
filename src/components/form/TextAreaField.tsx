import { cn } from '@/libs/common';
import type { ReactNode } from 'react';
import React from 'react';
import type { Control, FieldPath, FieldPathValue, FieldValues } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { TextArea, type TextAreaProps } from '../ui/textarea';
import { Show } from '../utilities';

export interface Props<T extends FieldValues = FieldValues> extends TextAreaProps {
  control: Control<T>;
  name: FieldPath<T>;
  defaultValue?: FieldPathValue<T, FieldPath<T>>;
  label?: ReactNode;
  required?: boolean;
  labelClassName?: string;
}

const TextAreaField = <T extends FieldValues>({
  defaultValue,
  labelClassName,
  control,
  label,
  required,
  className,
  onChange,
  ...props
}: Props<T>) => {
  return (
    <FormField
      control={control}
      name={props.name}
      defaultValue={defaultValue}
      render={({ field, fieldState }) => (
        <FormItem>
          <FormControl>
            <div className="space-y-1">
              <Show when={!!label}>
                <FormLabel className={labelClassName}>
                  {label} {required && <span className="text-red-500">*</span>}
                </FormLabel>
              </Show>
              <TextArea
                {...field}
                {...props}
                onChange={(e) => {
                  field.onChange(e);
                  onChange?.(e);
                }}
                className={cn(className, {
                  'border-amaranth-600 shadow-[0px_0px_0px_4px_#E0384B40] outline-amaranth-600': !!fieldState.error,
                })}
              />
            </div>
          </FormControl>
          <FormMessage className="mt-1 text-xs" />
        </FormItem>
      )}
    />
  );
};

export { TextAreaField };

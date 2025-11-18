'use client';

import type { Control, FieldPath, FieldPathValue, FieldValues } from 'react-hook-form';

import { cn } from '@/libs/common';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import InputMask, { type InputMaskProps } from '../ui/input-mask';
import { Show } from '../utilities';

interface Props<T extends FieldValues = FieldValues> extends InputMaskProps {
  control: Control<T>;
  name: FieldPath<T>;
  defaultValue?: FieldPathValue<T, FieldPath<T>>;
  label?: string;
  labelClassName?: string;
  required?: boolean;
}

const TextMaskField = <T extends FieldValues>({
  className,
  labelClassName,
  control,
  defaultValue,
  label,
  required,
  variant,
  onChange,
  options,
  ...props
}: Props<T>) => {
  return (
    <FormField
      defaultValue={defaultValue}
      control={control}
      name={props.name}
      render={({ field, fieldState }) => (
        <FormItem>
          <FormControl>
            <div className="space-y-1">
              <Show when={!!label}>
                <FormLabel className={cn('text-base', labelClassName)}>
                  {label} {required && <span className="text-amaranth-600">*</span>}
                </FormLabel>
              </Show>
              <InputMask
                {...field}
                {...props}
                onChange={(e) => {
                  field.onChange(e);
                  onChange?.(e);
                }}
                variant={variant}
                className={cn(className, {
                  'border-amaranth-600 shadow-[0px_0px_0px_4px_#E0384B40] outline-amaranth-600': !!fieldState.error,
                })}
                options={options}
              />
              <FormMessage className="mt-1 text-xs" />
            </div>
          </FormControl>
        </FormItem>
      )}
    />
  );
};

export { TextMaskField };

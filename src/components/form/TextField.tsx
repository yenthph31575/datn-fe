'use client';

import type { Control, FieldPath, FieldPathValue, FieldValues } from 'react-hook-form';

import { cn } from '@/libs/common';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import type { InputProps } from '../ui/input';
import { Input } from '../ui/input';
import { Show } from '../utilities';

interface Props<T extends FieldValues = FieldValues> extends InputProps {
  control: Control<T>;
  name: FieldPath<T>;
  defaultValue?: FieldPathValue<T, FieldPath<T>>;
  label?: string;
  labelClassName?: string;
  required?: boolean;
}

const TextField = <T extends FieldValues>({
  className,
  labelClassName,
  control,
  defaultValue,
  label,
  required,
  variant,
  onChange,
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
                <FormLabel className={cn('', labelClassName)}>
                  {label} {required && <span className="text-amaranth-600">*</span>}
                </FormLabel>
              </Show>
              <Input
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
              />
              <FormMessage className="mt-1 text-xs" />
            </div>
          </FormControl>
        </FormItem>
      )}
    />
  );
};

export { TextField };

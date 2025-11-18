'use client';

import type { Control, FieldPath, FieldPathValue, FieldValues } from 'react-hook-form';

import { cn } from '@/libs/common';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import TextAdd from '../ui/text-add';
import { Show } from '../utilities';

interface Props<T extends FieldValues = FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  defaultValue?: FieldPathValue<T, FieldPath<T>>;
  label?: string;
  labelClassName?: string;
  className?: string;
  required?: boolean;
  placeholder?: string;
  childMaxLength?: number;
}

const TextAddField = <T extends FieldValues>({
  className,
  childMaxLength,
  labelClassName,
  control,
  defaultValue,
  label,
  required,
  ...props
}: Props<T>) => {
  return (
    <FormField
      defaultValue={defaultValue}
      control={control}
      name={props.name}
      render={({ field, fieldState }) => {
        return (
          <FormItem>
            <FormControl>
              <div className="space-y-1">
                <Show when={!!label}>
                  <FormLabel className={labelClassName}>
                    {label} {required && <span className="text-red-500">*</span>}
                  </FormLabel>
                </Show>
                <TextAdd
                  {...field}
                  {...props}
                  childMaxLength={childMaxLength}
                  className={cn(className, {
                    'border-amaranth-600 shadow-[0px_0px_0px_4px_#E0384B40] outline-amaranth-600': !!fieldState.error,
                  })}
                />
                <FormMessage className="mt-1 text-xs" />
              </div>
            </FormControl>
          </FormItem>
        );
      }}
    />
  );
};

export { TextAddField };

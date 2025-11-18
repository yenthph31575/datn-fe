import type { VariantProps } from 'class-variance-authority';
import type { ReactNode } from 'react';
import React from 'react';
import type { Control, FieldPath, FieldPathValue, FieldValues } from 'react-hook-form';
import type { Props as StateManagerProps } from 'react-select';

import { cn } from '@/libs/common';

import { FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import type { selectTriggerVariants } from '../ui/select';
import SelectMultiCreatable from '../ui/select-custom/SelectMultiCreatable';
import { Show } from '../utilities';

interface IData {
  label: string;
  value: string;
  image?: string;
  group?: string;
}

interface Props<T extends FieldValues = FieldValues>
  extends React.SelectHTMLAttributes<HTMLSelectElement>,
    VariantProps<typeof selectTriggerVariants> {
  control: Control<T>;
  name: FieldPath<T>;
  defaultValue?: FieldPathValue<T, FieldPath<T>>;
  label?: ReactNode;
  required?: boolean;
  fullWidth?: boolean;
  labelClassName?: string;
  data: IData[];
  onChange?: any;
  height?: string;
  placeholder?: string;
  selectProps?: Omit<StateManagerProps, 'options' | 'onChange' | 'value'>;
}

const SelectMultiCreatableField = <T extends FieldValues>({
  name,
  defaultValue,
  control,
  label,
  required,
  data,
  variant,
  inputSize,
  fullWidth,
  className,
  labelClassName,
  onChange,
  height,
  selectProps,
  ...props
}: Props<T>) => {
  return (
    <FormField
      defaultValue={defaultValue}
      control={control}
      name={name}
      render={({ field }) => {
        return (
          <div className={cn('relative', fullWidth ? 'w-full' : '')}>
            <FormItem>
              <Show when={!!label}>
                <FormLabel className={labelClassName}>
                  {label} {required && <span className="text-red-500">*</span>}
                </FormLabel>
              </Show>
              <SelectMultiCreatable
                name={field.name}
                data={data}
                value={field.value || []}
                height={height}
                placeholder={props.placeholder}
                {...selectProps}
                onValueChange={(e: string[]) => field.onChange(e)}
              />
              <FormMessage className="mt-1 text-xs" />
            </FormItem>
          </div>
        );
      }}
    />
  );
};

export { SelectMultiCreatableField };

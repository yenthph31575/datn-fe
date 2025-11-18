import { cn } from '@/libs/common';
import type { VariantProps } from 'class-variance-authority';
import type { ReactNode } from 'react';
import React from 'react';
import type { Control, FieldPath, FieldPathValue, FieldValues } from 'react-hook-form';
import type { Props as StateManagerProps } from 'react-select';
import { FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import type { selectTriggerVariants } from '../ui/select';
import SelectCustom from '../ui/select-custom';
import { Show } from '../utilities';

interface IData {
  label: React.ReactNode;
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
  selectProps?: Omit<StateManagerProps, 'options' | 'onChange'>;
}

const SelectCustomField = <T extends FieldValues>({
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
  disabled,
  selectProps,
  ...props
}: Props<T>) => {
  return (
    <FormField
      defaultValue={defaultValue}
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        return (
          <div className={cn('relative', fullWidth ? 'w-full' : '')}>
            <FormItem>
              <Show when={!!label}>
                <FormLabel className={cn('flex', labelClassName)}>
                  {label} {required && <span className="ml-1 text-red-500">*</span>}
                </FormLabel>
              </Show>
              <SelectCustom
                name={field.name}
                data={data}
                value={field.value}
                height={height}
                placeholder={props.placeholder}
                {...selectProps}
                onChange={(e: any) => {
                  onChange?.(e);
                  field.onChange(e.value);
                }}
                isDisabled={disabled}
                isError={!!fieldState.error}
              />
              <FormMessage className="mt-1 text-xs" />
            </FormItem>
          </div>
        );
      }}
    />
  );
};

export { SelectCustomField };

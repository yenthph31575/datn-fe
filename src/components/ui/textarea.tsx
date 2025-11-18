import type { VariantProps } from 'class-variance-authority';
import { cva } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/libs/common';

export const textAreaVariants = cva(
  cn(
    'border-input border placeholder:font-light ring-offset-background peer',
    'focus-visible:ring-transparent focus-visible:shadow-[0px_0px_0px_4px_#38E09640] focus-visible:border-[#00A061] focus-visible:border flex w-full file:border-0 file:bg-transparent',
    'focus-visible:outline-none read-only:bg-readonly read-only:border-readonly-border read-only:cursor-default focus-visible:ring-1 focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 rounded-xl'
  ),
  {
    variants: {
      variant: {
        default: 'shadow-[0px_1px_2px_0px_#1018280D] bg-[#FAFAFA26] placeholder:text-[#8A513659]',
        filled: 'bg-background',
        floating: '',
      },
      inputSize: {
        default: 'min-h-14 py-2 px-3 text-sm rounded',
      },
    },
    defaultVariants: {
      inputSize: 'default',
    },
  }
);
export interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement>, VariantProps<typeof textAreaVariants> {
  suffix?: any;
  label?: React.ReactNode;
  fullWidth?: boolean;
}

const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ className, variant = 'default', label, rows = 5, placeholder = '', children, fullWidth, inputSize, suffix, id, ...props }, ref) => {
    return (
      <textarea
        rows={rows}
        className={cn(textAreaVariants({ variant, inputSize, className }))}
        placeholder={placeholder}
        ref={ref}
        {...props}
      />
    );
  }
);
TextArea.displayName = 'TextArea';

export { TextArea };

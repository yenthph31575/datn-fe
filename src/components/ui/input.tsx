import { Icons } from '@/assets/icons';
import { cn } from '@/libs/common';
/* eslint-disable no-nested-ternary */
import type { VariantProps } from 'class-variance-authority';
import { cva } from 'class-variance-authority';
import * as React from 'react';
import { Show } from '../utilities';

export const inputVariants = cva(
  cn(
    'border-input border placeholder:font-normal bg-transparent ring-offset-background peer',
    'focus-visible:ring-transparent focus-visible:shadow-[0px_0px_0px_4px_#38E09640] focus-visible:border-[#00A061] focus-visible:border flex w-full file:border-0 file:bg-transparent',
    'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 placeholder:text-primary-500'
    // 'read-only:bg-readonly read-only:border-readonly-border read-only:cursor-default'
  ),
  {
    variants: {
      variant: {
        default: 'shadow-[0px_1px_2px_0px_#1018280D] bg-[#FAFAFA26] placeholder:text-grey-400',
      },
      inputSize: {
        sm: 'h-11 px-3 py-2 text-sm rounded-sm file:text-sm file:font-medium ',
        xs: 'h-9 px-3 py-2 text-sm rounded-sm file:text-sm file:font-medium ',
        md: 'h-12 px-3 py-2 text-sm rounded-md file:text-sm file:font-medium ',
        default: 'h-11 px-3 text-sm rounded file:text-sm file:font-medium',
      },
    },
    defaultVariants: {
      inputSize: 'default',
    },
  }
);

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement>, VariantProps<typeof inputVariants> {
  errorClassName?: string;
  suffix?: any;
  fullWidth?: boolean;
  label?: React.ReactNode;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ leftIcon, className, variant = 'default', label, children, fullWidth, inputSize, type, suffix, id, rightIcon, ...props }, ref) => {
    const [show, setShow] = React.useState(false);
    return (
      <div className={cn('relative', fullWidth && 'w-full')}>
        {leftIcon && <div className="-translate-y-1/2 absolute top-1/2 left-2">{leftIcon}</div>}
        <input
          id={id}
          type={type === 'password' ? (show ? 'text' : 'password') : type}
          className={cn(
            {
              'read-only:cursor-no-drop': type === 'text' || type === 'password' || type === 'email',
            },
            inputVariants({ variant, inputSize, className }),
            {
              'pl-11': leftIcon,
            }
          )}
          ref={ref}
          {...props}
        />
        <Show when={type !== 'password'}>{suffix && <div className="-translate-y-1/2 absolute top-1/2 right-[16px]">{suffix}</div>}</Show>
        <Show when={type === 'password'}>
          <div onClick={() => setShow(!show)} className="-translate-y-1/2 absolute top-1/2 right-[10px] cursor-pointer">
            {show ? <Icons.openEye /> : <Icons.eyeOff />}
          </div>
        </Show>
        {rightIcon || <></>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };

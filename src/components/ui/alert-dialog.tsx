'use client';

import * as AlertDialogPrimitive from '@radix-ui/react-alert-dialog';
import * as React from 'react';

import { Icons } from '@/assets/icons';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/libs/common';
import type { FCC } from '@/types';
import { HStack } from '../utilities';

const AlertDialog = AlertDialogPrimitive.Root;

const AlertDialogTrigger = AlertDialogPrimitive.Trigger;

const AlertDialogPortal = AlertDialogPrimitive.Portal;

const AlertDialogOverlay = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Overlay
    className={cn(
      'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/80 data-[state=closed]:animate-out data-[state=open]:animate-in',
      className
    )}
    {...props}
    ref={ref}
  />
));
AlertDialogOverlay.displayName = AlertDialogPrimitive.Overlay.displayName;

const AlertDialogContent = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Content>
>(({ className, ...props }, ref) => (
  <AlertDialogPortal>
    <AlertDialogOverlay />
    <AlertDialogPrimitive.Content
      ref={ref}
      className={cn(
        'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] fixed top-[50%] left-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=closed]:animate-out data-[state=open]:animate-in sm:rounded-lg',
        className
      )}
      {...props}
    />
  </AlertDialogPortal>
));
AlertDialogContent.displayName = AlertDialogPrimitive.Content.displayName;

const AlertDialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('flex flex-col space-y-2 text-center sm:text-left', className)} {...props} />
);
AlertDialogHeader.displayName = 'AlertDialogHeader';

const AlertDialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('flex flex-col-reverse sm:flex-row sm:justify-end', className)} {...props} />
);
AlertDialogFooter.displayName = 'AlertDialogFooter';

const AlertDialogTitle = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Title ref={ref} className={cn('text-lg text-tertiary-900', className)} {...props} />
));
AlertDialogTitle.displayName = AlertDialogPrimitive.Title.displayName;

const AlertDialogDescription = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Description asChild ref={ref} className={cn('text-primary-700 text-sm', className)} {...props} />
));
AlertDialogDescription.displayName = AlertDialogPrimitive.Description.displayName;

const AlertDialogAction = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Action>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Action>
>(({ className, ...props }, ref) => <AlertDialogPrimitive.Action ref={ref} className={cn(buttonVariants(), className)} {...props} />);
AlertDialogAction.displayName = AlertDialogPrimitive.Action.displayName;

const AlertDialogCancel = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Cancel>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Cancel>
>(({ className, ...props }, ref) => <AlertDialogPrimitive.Cancel asChild ref={ref} className={cn(className)} {...props} />);
AlertDialogCancel.displayName = AlertDialogPrimitive.Cancel.displayName;

type AlertDialogComponentProps = {
  onOk: () => void;
  loading?: boolean;
  title: React.ReactNode;
  isOpen?: boolean;
  setIsOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  titleClassName?: string;
  okClassName?: string;
  description: React.ReactNode;
  okText?: React.ReactNode;
  cancelText?: React.ReactNode;
  variant?: 'success' | 'alert';
  okType?: 'button' | 'submit';
};
export const AlertDialogComponent: FCC<AlertDialogComponentProps> = ({
  loading,
  title,
  description,
  onOk,
  isOpen = undefined,
  setIsOpen = undefined,
  children,
  okText,
  cancelText,
  titleClassName,
  variant = 'alert',
  okClassName,
  okType = 'button',
}) => {
  return (
    <AlertDialog open={isOpen}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent className="z-[100] max-w-[424px] bg-gray-300 pt-2">
        <HStack pos="apart">
          <AlertDialogTitle
            className={cn(
              'mt-2 font-semibold text-xl',
              // {
              //   'text-quaternary-300': variant === 'alert',
              //   'text-primary-400': variant === 'success',
              // },
              titleClassName
            )}
          >
            {title}
          </AlertDialogTitle>
          <AlertDialogCancel>
            <button onClick={() => setIsOpen?.(false)} className="w-7 text-tertiary-900 hover:opacity-75">
              <Icons.X />
            </button>
          </AlertDialogCancel>
        </HStack>

        <AlertDialogDescription className="mt-7">{description}</AlertDialogDescription>
        <AlertDialogFooter className="mt-6 grid w-full grid-cols-2 gap-4">
          <AlertDialogCancel className=" flex-1">
            <Button onClick={() => setIsOpen?.(false)} variant="gray" className="w-full">
              {cancelText ?? 'Cancel'}
            </Button>
          </AlertDialogCancel>

          <AlertDialogCancel className=" flex-1">
            <HStack>
              <Button
                className={cn('w-full', okClassName)}
                variant={variant === 'success' ? 'default' : 'alert'}
                onClick={() => {
                  onOk();
                }}
                loading={loading}
                type={okType}
              >
                {okText ?? 'Ok'}
              </Button>
            </HStack>
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  AlertDialogPortal,
  AlertDialogTitle,
  AlertDialogTrigger,
};

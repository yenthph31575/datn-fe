import { cn } from '@/libs/common';
import { forwardRef } from 'react';

interface Props extends React.ComponentPropsWithoutRef<'div'> {
  loading?: boolean;
  fullWidth?: boolean;
}

const SkeletonWrapper = forwardRef<HTMLDivElement, Props>(({ className, fullWidth = false, children, loading, ...props }, ref) => {
  if (!loading) return <>{children}</>;
  return (
    <div
      ref={ref}
      className={cn({ '[&>*]:!invisible h-fit w-fit animate-pulse rounded-md bg-primary-100': loading, 'w-auto': fullWidth }, className)}
      {...props}
    >
      {children}
    </div>
  );
});

export { SkeletonWrapper };

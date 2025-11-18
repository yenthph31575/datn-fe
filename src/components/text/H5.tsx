import { cn } from '@/libs/common';
import type { TextProps } from '@/types';

function H5({ className, children, ...props }: TextProps) {
  return (
    <h5 {...props} className={cn('font-medium font-orbitron text-sm lg:text-base', className)}>
      {children}
    </h5>
  );
}

export default H5;

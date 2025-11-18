import { cn } from '@/libs/common';
import type { TextProps } from '@/types';

function H4({ className, children, ...props }: TextProps) {
  return (
    <h4 {...props} className={cn('font-medium font-orbitron text-base lg:text-lg', className)}>
      {children}
    </h4>
  );
}

export default H4;

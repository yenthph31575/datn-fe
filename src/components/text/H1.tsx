import { cn } from '@/libs/common';
import type { TextProps } from '@/types';

function H1({ className, children, ...props }: TextProps) {
  return (
    <h1 {...props} className={cn('font-bold font-orbitron text-3xl lg:text-4xl', className)}>
      {children}
    </h1>
  );
}

export default H1;

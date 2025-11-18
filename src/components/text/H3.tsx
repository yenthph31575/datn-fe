import { cn } from '@/libs/common';
import type { TextProps } from '@/types';

function H3({ className, children, ...props }: TextProps) {
  return (
    <h3 {...props} className={cn('font-orbitron font-semibold text-lg lg:text-xl', className)}>
      {children}
    </h3>
  );
}

export default H3;

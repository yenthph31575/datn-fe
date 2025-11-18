import { forwardRef } from 'react';

import { cn } from '@/libs/common';
import type { TextProps } from '@/types';

const H2 = forwardRef<any, TextProps>(({ className, children, ...props }, ref) => {
  return (
    <h2 {...props} ref={ref} className={cn('font-orbitron font-semibold text-xl lg:text-3xl', className)}>
      {children}
    </h2>
  );
});

export default H2;

import { forwardRef } from 'react';

import { cn } from '@/libs/common';
import type { TextProps } from '@/types';

const TextContent = forwardRef<HTMLParagraphElement, TextProps>(({ className, children, ...props }, ref) => {
  return (
    <p {...props} ref={ref} className={cn('font-normal text-foreground text-sm ', className)}>
      {children}
    </p>
  );
});

export default TextContent;

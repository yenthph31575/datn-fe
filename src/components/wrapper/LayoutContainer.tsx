import { cn } from '@/libs/common';
import React from 'react';

const LayoutContainer = ({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className={cn('mx-auto max-w-[1440px]', className)} {...props}>
      {children}
    </div>
  );
};

export default LayoutContainer;

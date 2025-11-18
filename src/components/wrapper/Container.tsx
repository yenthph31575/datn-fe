import { cn } from '@/libs/common';
import React from 'react';

const Container = ({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className={cn('mx-auto max-w-[1440px] px-4 lg:px-8 ', className)} {...props}>
      {children}
    </div>
  );
};

export default Container;

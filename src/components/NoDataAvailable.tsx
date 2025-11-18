import React, { type ReactNode } from 'react';

import { Icons } from '@/assets/icons';
import { VStack } from './utilities';

type Props = {
  message?: string;
  title?: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
};

const NoDataAvailable = ({ message, title, description, icon, action }: Props) => {
  return (
    <VStack spacing={16} align="center" className="my-8 py-8">
      <span>{icon || <Icons.noData className="h-24 w-24" />}</span>

      {title && <h3 className="font-semibold text-gray-800 text-xl">{title}</h3>}

      <span className="max-w-md text-center font-medium text-gray-500 text-sm">{message || description || 'No data available!'}</span>

      {action && <div className="mt-4">{action}</div>}
    </VStack>
  );
};

export default NoDataAvailable;

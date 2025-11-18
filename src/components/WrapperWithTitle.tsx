import React from 'react';
import { VStack } from './utilities';

interface Props {
  label: string;
  children: React.ReactNode;
  className?: string;
}

const WrapperWithTitle = (props: Props) => {
  const { label, children, className } = props;
  return (
    <VStack className={className}>
      <label className={'font-semibold text-[#7E7E7E] text-sm'}>{label}</label>
      {children}
    </VStack>
  );
};

export default WrapperWithTitle;

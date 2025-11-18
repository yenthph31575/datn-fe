import React from 'react';

import { VStack } from '@/components/utilities';
import { cn } from '@/libs/common';
import { PRESETS } from './const';

type SidebarProps = {
  setPreset: (value: string) => void;
  selectedPreset?: string;
};
const Sidebar = ({ setPreset, selectedPreset }: SidebarProps) => {
  const handleSetPreset = (preset: string) => {
    setPreset(preset);
  };
  return (
    <VStack className="border-grey-200 border-r-[1px]" spacing={0}>
      {PRESETS.map((preset) => (
        <button
          key={preset.name}
          onClick={() => handleSetPreset(preset.name)}
          className={cn('rounded-none px-6 py-2 text-left text-sm hover:bg-primary-400 hover:text-white', {
            'bg-primary-400 text-white': selectedPreset === preset.name,
          })}
        >
          {preset.label}
        </button>
      ))}
    </VStack>
  );
};

export default Sidebar;

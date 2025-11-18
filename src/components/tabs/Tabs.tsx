import { cn } from '@/libs/common';
import { motion } from 'framer-motion';
import React, { useState } from 'react';

export type TabOption = {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  disabled?: boolean;
};

type TabsProps = {
  data: TabOption[];
  value?: string | number;
  onChange?: (value: string | number) => void;
  layoutId?: string;
  className?: string;
  tabClassName?: string;
  activeTabClassName?: string;
  inactiveTabClassName?: string;
  disabledTabClassName?: string;
};

const Tabs = ({
  data,
  value,
  onChange,
  layoutId,
  className,
  tabClassName,
  activeTabClassName,
  inactiveTabClassName,
  disabledTabClassName,
}: TabsProps) => {
  const [activeTab, setActiveTab] = useState<string | number>(value || data[0]?.value || '');

  const handleTabClick = (tab: TabOption) => {
    if (tab.disabled) return;

    const newValue = tab.value;
    setActiveTab(newValue);
    onChange?.(newValue);
  };

  return (
    <div className={cn('flex overflow-x-auto', className)}>
      {data.map((tab) => {
        const isActive = value !== undefined ? tab.value === value : tab.value === activeTab;

        return (
          <button
            key={tab.value}
            onClick={() => handleTabClick(tab)}
            disabled={tab.disabled}
            className={cn(
              'relative px-4 py-2 font-medium text-sm transition-colors',
              'focus:outline-none',
              tabClassName,
              isActive ? cn('text-primary-600', activeTabClassName) : cn('text-gray-600 hover:text-gray-900', inactiveTabClassName),
              tab.disabled && cn('cursor-not-allowed opacity-50', disabledTabClassName)
            )}
          >
            <div className="flex items-center gap-2">
              {tab.icon}
              {tab.label}
            </div>

            {isActive && layoutId && (
              <motion.div
                layoutId={layoutId}
                className="absolute right-0 bottom-0 left-0 h-0.5 bg-primary-600"
                initial={false}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
};

export default Tabs;

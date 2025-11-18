import { useClickOutside } from '@mantine/hooks';
import { CalendarClock } from 'lucide-react';
import React, { useEffect } from 'react';
import type { Matcher, SelectSingleEventHandler } from 'react-day-picker';

import usePopover from '@/hooks/usePopover';
import { cn } from '@/libs/common';
import { format } from 'date-fns';
import { Calendar, type CalendarProps } from './calendar';
import { Input, type InputProps } from './input';
import { DateInput } from './select-custom/date-input';

export interface DatePickerProps extends Omit<InputProps, 'onChange' | 'value'> {
  onChange: (date?: Date) => void;
  value?: Date;
  calendarProps?: CalendarProps;
  label?: string;
  disablePast?: boolean;
  disableDay?: Matcher | Matcher[];
  calendarIconClassName?: string;
}
const DatePicker = React.forwardRef<HTMLInputElement, DatePickerProps>(
  ({ onChange, value, onBlur, disableDay, calendarProps, calendarIconClassName, disablePast, label = 'Choose date', ...props }, ref) => {
    const [inputValue, setInputValue] = React.useState<string>('');
    const [timer, setTimer] = React.useState<string>(value ? format(new Date(value), 'HH:ss') : '');
    const [isOpen, floatingStyles, refs, { open, toggle, close }] = usePopover();
    const popoverRef = useClickOutside(close);

    const handleSelect: SelectSingleEventHandler = (date) => {
      if (!date) {
        return;
      }
      const newDate = new Date(date);
      const currentTime = timer.split(':');

      if (currentTime.length === 2) {
        newDate.setHours(Number(currentTime[0]), Number(currentTime[1]));
      }

      onChange(newDate);
      setInputValue(format(newDate, 'MM/dd/yyyy - hh:mm a'));
    };

    const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const timeValue = e.target.value;
      setTimer(timeValue);
      if (!timeValue) return;

      if (value) {
        const newDate = new Date(value);
        const [hours, minutes] = timeValue.split(':').map(Number);

        newDate.setHours(hours, minutes);
        onChange(newDate);

        setInputValue(`${format(newDate, 'MM/dd/yyyy')} - ${format(newDate, 'hh:mm a')}`);
      }
    };

    useEffect(() => {
      if (!value) return;

      const formattedDate = format(new Date(value), 'MM/dd/yyyy - hh:mm a');
      const formattedTime = format(new Date(value), 'HH:mm');

      setInputValue(formattedDate);
      setTimer(formattedTime);
    }, [value]);

    return (
      <div className="font-sans">
        <div className="relative" ref={refs.setReference}>
          <Input
            {...props}
            label={label}
            suffix={
              <CalendarClock
                className={cn('cursor-pointer stroke-grey-600 hover:stroke-grey-700', calendarIconClassName)}
                onClick={toggle}
              />
            }
            ref={ref}
            onClick={toggle}
            value={inputValue}
            readOnly
          />
        </div>
        {isOpen && (
          <div
            ref={refs.setFloating}
            style={floatingStyles}
            className={cn('left-0 z-[100] min-h-[40px] w-fit overflow-hidden rounded-md bg-popover shadow-popover outline-none ')}
            onClick={open}
          >
            <div ref={popoverRef}>
              <div className="">
                <DateInput
                  value={value}
                  onChange={(date) => {
                    if (!date) {
                      return;
                    }
                    onChange(date);

                    setInputValue(format(new Date(date), 'MM/dd/yyyy'));
                  }}
                  className="rounded-none py-1"
                />
              </div>

              <div className="">
                <Calendar
                  {...calendarProps}
                  mode="single"
                  selected={value}
                  // month={value}
                  onSelect={handleSelect as any}
                  // disablePast={disablePast}
                  disabled={disableDay}
                />
              </div>

              <div className="-mt-1 px-2 pb-2">
                <Input type="time" value={timer} className="h-7 border border-primary-600" onChange={handleTimeChange} />
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
);

DatePicker.displayName = 'DatePicker';

export { DatePicker };

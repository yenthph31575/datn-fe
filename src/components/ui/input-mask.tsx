import { Input, type InputProps } from '@/components/ui/input';
import type { MaskOptions } from '@react-input/mask';
import { useMask } from '@react-input/mask';
import React from 'react';

export interface InputMaskProps extends InputProps {
  options?: MaskOptions;
  min?: number;
  max?: number;
  decimalPlaces?: number;
}

const InputMask = ({ className, options = undefined, decimalPlaces, min, max, onChange, onBlur, ...props }: InputMaskProps) => {
  const inputRef = useMask(
    options || {
      mask: '##################',
      replacement: { '#': /[\d.]/ },
    }
  );

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = event.target.value;

    if (newValue === '.' || newValue === '') {
      onChange?.(event);
      return;
    }

    if (!/^\d*\.?\d*$/.test(newValue)) {
      return;
    }

    if (decimalPlaces !== undefined) {
      const regex = new RegExp(`^\\d*(\\.\\d{0,${decimalPlaces}})?$`);
      if (!regex.test(newValue)) {
        return;
      }
    }
    onChange?.(event);
  };

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    let newValue = event.target.value;

    if (newValue === '.' || newValue === '') {
      return;
    }

    let numValue = parseFloat(newValue);

    if (!isNaN(numValue)) {
      if (min !== undefined && numValue < min) {
        numValue = min;
      }
      if (max !== undefined && numValue > max) {
        numValue = max;
      }
    }

    const finalValue = isNaN(numValue) ? '' : numValue.toString();

    const newEvent = {
      ...event,
      target: { ...event.target, value: finalValue },
    };

    onChange?.(newEvent);
  };

  return (
    <div>
      <Input {...props} ref={inputRef} className={className} onChange={handleChange} onBlur={handleBlur} />
    </div>
  );
};

export default InputMask;

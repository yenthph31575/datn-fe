'use client';

import { cn } from '@/libs/common';
import React, { useState } from 'react';
import { HStack } from '../utilities';
import InputMask from './input-mask';

type Props = {
  value?: number;
  onChange?: (value: number) => void;
  max?: number;
  min?: number;
};
const QuantityInput = ({ value, onChange, min = 1, max }: Props) => {
  const [valueInput, setValueInput] = useState(value || 1);

  const handleChange = (e: number) => {
    let _value = e;
    if (min && e < min && e !== 0) {
      _value = min;
    }
    if (max && e > max) {
      _value = max;
    }

    setValueInput(_value);
    onChange?.(_value);
  };
  return (
    <HStack noWrap className="overflow-hidden rounded-sm border border-primary-500 bg-primary-200">
      <button
        type="button"
        onClick={() => valueInput > Number(min) && handleChange(valueInput > min ? valueInput - 1 : min)}
        className={cn('px-4 text-2xl hover:text-white disabled:cursor-not-allowed disabled:text-grey-600', {
          'cursor-not-allowed hover:text-grey-600': valueInput <= Number(min),
        })}
        disabled={value === 1}
      >
        -
      </button>
      <InputMask
        onChange={(e) => handleChange(Number(e.target.value))}
        min={min}
        value={valueInput}
        className="w-16 border-none bg-transparent text-center focus-visible:bg-white focus-visible:shadow-none"
      />
      <button
        type="button"
        onClick={() => valueInput < Number(max) && handleChange(valueInput + 1)}
        className={cn('px-4 text-xl hover:text-white', {
          'cursor-not-allowed hover:text-grey-600': valueInput >= Number(max),
        })}
      >
        +
      </button>
    </HStack>
  );
};

export default QuantityInput;

import { useEffect, useState } from 'react';

export const DEFAULT_DELAY = 700;

const useDebouncedValue = (value = '', delay = DEFAULT_DELAY): string | number => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
};

export default useDebouncedValue;

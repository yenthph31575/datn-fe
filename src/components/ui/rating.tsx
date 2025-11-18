import { cn } from '@/libs/common';
import { Star } from 'lucide-react';
import React from 'react';

interface RatingProps {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  readOnly?: boolean;
  onChange?: (value: number) => void;
  className?: string;
  starClassName?: string;
  showValue?: boolean;
  precision?: 'half' | 'full';
}

const Rating = ({
  value,
  max = 5,
  size = 'md',
  readOnly = true,
  onChange,
  className,
  starClassName,
  showValue = false,
  precision = 'full',
}: RatingProps) => {
  const [hoverValue, setHoverValue] = React.useState<number | null>(null);

  const getStarSize = () => {
    switch (size) {
      case 'sm':
        return 'h-3.5 w-3.5';
      case 'lg':
        return 'h-6 w-6';
      case 'md':
      default:
        return 'h-5 w-5';
    }
  };

  const handleStarClick = (starValue: number) => {
    if (readOnly) return;
    onChange?.(starValue);
  };

  const renderStars = () => {
    const stars = [];
    const displayValue = hoverValue !== null ? hoverValue : value;

    for (let i = 1; i <= max; i++) {
      const isFilled = precision === 'full' ? i <= displayValue : i <= Math.floor(displayValue);

      const isHalfFilled = precision === 'half' && Math.ceil(displayValue) === i && displayValue % 1 !== 0;

      stars.push(
        <span
          key={i}
          className={cn('cursor-default', !readOnly && 'cursor-pointer', starClassName)}
          onClick={() => handleStarClick(i)}
          onMouseEnter={() => !readOnly && setHoverValue(i)}
          onMouseLeave={() => !readOnly && setHoverValue(null)}
        >
          <Star
            className={cn(
              getStarSize(),
              isFilled
                ? 'fill-yellow-500 text-yellow-500'
                : isHalfFilled
                  ? 'fill-yellow-500/50 text-yellow-500'
                  : 'fill-transparent text-gray-300'
            )}
          />
        </span>
      );
    }

    return stars;
  };

  return (
    <div className={cn('flex items-center gap-1.5', className)}>
      <div className="flex">{renderStars()}</div>
      {showValue && <span className="ml-1 font-medium text-gray-700 text-sm">{value.toFixed(precision === 'half' ? 1 : 0)}</span>}
    </div>
  );
};

export { Rating };

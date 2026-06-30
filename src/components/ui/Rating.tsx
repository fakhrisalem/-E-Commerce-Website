import { Star } from 'lucide-react';

interface RatingProps {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
  count?: number;
}

const sizeMap = {
  sm: 'w-3 h-3',
  md: 'w-4 h-4',
  lg: 'w-5 h-5',
};

export function Rating({ value, max = 5, size = 'md', showValue = false, count }: RatingProps) {
  const stars = Array.from({ length: max }, (_, i) => {
    const filled = i < Math.floor(value);
    const partial = i === Math.floor(value) && value % 1 !== 0;
    const percentage = partial ? (value % 1) * 100 : 0;

    return (
      <span key={i} className="relative inline-block">
        <Star
          className={`${sizeMap[size]} text-gray-200 dark:text-gray-700`}
          fill="currentColor"
        />
        {(filled || partial) && (
          <Star
            className={`absolute top-0 left-0 ${sizeMap[size]} text-amber-400`}
            fill="currentColor"
            style={{
              clipPath: partial ? `inset(0 ${100 - percentage}% 0 0)` : undefined,
            }}
          />
        )}
      </span>
    );
  });

  return (
    <div className="flex items-center gap-1">
      <div className="flex">{stars}</div>
      {showValue && (
        <span className="text-sm text-gray-600 dark:text-gray-400 ml-1">
          {value.toFixed(1)}
        </span>
      )}
      {count !== undefined && (
        <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">
          ({count})
        </span>
      )}
    </div>
  );
}

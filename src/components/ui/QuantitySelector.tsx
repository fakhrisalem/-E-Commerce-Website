import { Minus, Plus } from 'lucide-react';
import { motion } from 'framer-motion';

interface QuantitySelectorProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  size?: 'sm' | 'md';
}

export function QuantitySelector({
  value,
  onChange,
  min = 1,
  max = 99,
  size = 'md',
}: QuantitySelectorProps) {
  const handleDecrement = () => {
    if (value > min) {
      onChange(value - 1);
    }
  };

  const handleIncrement = () => {
    if (value < max) {
      onChange(value + 1);
    }
  };

  const sizeStyles = {
    sm: {
      button: 'p-1',
      text: 'text-sm w-8',
    },
    md: {
      button: 'p-2',
      text: 'text-base w-10',
    },
  };

  return (
    <div className="flex items-center rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={handleDecrement}
        disabled={value <= min}
        className={`
          ${sizeStyles[size].button}
          rounded-l-full text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200
          disabled:opacity-30 disabled:cursor-not-allowed
          transition-colors
        `}
      >
        <Minus className="w-4 h-4" />
      </motion.button>
      <span
        className={`
          ${sizeStyles[size].text}
          text-center font-medium text-gray-900 dark:text-gray-100
        `}
      >
        {value}
      </span>
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={handleIncrement}
        disabled={value >= max}
        className={`
          ${sizeStyles[size].button}
          rounded-r-full text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200
          disabled:opacity-30 disabled:cursor-not-allowed
          transition-colors
        `}
      >
        <Plus className="w-4 h-4" />
      </motion.button>
    </div>
  );
}

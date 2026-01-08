import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface LetterCardProps {
  letter: string;
  isCompleted?: boolean;
  isActive?: boolean;
  onClick?: () => void;
  size?: 'sm' | 'md' | 'lg';
  colorIndex?: number;
}

const colors = [
  'from-fun-pink/30 to-fun-pink/10 border-fun-pink text-fun-pink',
  'from-fun-orange/30 to-fun-orange/10 border-fun-orange text-fun-orange',
  'from-fun-yellow/30 to-fun-yellow/10 border-fun-yellow text-fun-yellow',
  'from-fun-green/30 to-fun-green/10 border-fun-green text-fun-green',
  'from-primary/30 to-primary/10 border-primary text-primary',
  'from-fun-purple/30 to-fun-purple/10 border-fun-purple text-fun-purple',
];

const sizeStyles = {
  sm: 'w-14 h-14 text-2xl',
  md: 'w-20 h-20 text-4xl',
  lg: 'w-28 h-28 text-6xl',
};

export const LetterCard: React.FC<LetterCardProps> = ({
  letter,
  isCompleted = false,
  isActive = false,
  onClick,
  size = 'md',
  colorIndex = 0,
}) => {
  const colorClass = colors[colorIndex % colors.length];

  return (
    <motion.button
      whileHover={{ scale: 1.1, rotate: [-2, 2, 0] }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={cn(
        'flex items-center justify-center rounded-2xl font-fredoka font-bold transition-all duration-300 border-4 bg-gradient-to-br',
        sizeStyles[size],
        colorClass,
        isActive && 'ring-4 ring-offset-2 ring-primary shadow-float',
        isCompleted && 'opacity-50'
      )}
    >
      {letter}
      {isCompleted && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-2 -right-2 w-6 h-6 bg-success rounded-full flex items-center justify-center text-success-foreground text-xs"
        >
          ✓
        </motion.div>
      )}
    </motion.button>
  );
};

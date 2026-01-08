import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ChildAvatarProps {
  name: string;
  color: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isSelected?: boolean;
  onClick?: () => void;
}

const sizeStyles = {
  sm: 'w-12 h-12 text-lg',
  md: 'w-16 h-16 text-xl',
  lg: 'w-24 h-24 text-3xl',
  xl: 'w-32 h-32 text-4xl',
};

export const ChildAvatar: React.FC<ChildAvatarProps> = ({
  name,
  color,
  size = 'md',
  isSelected = false,
  onClick,
}) => {
  const initial = name.charAt(0).toUpperCase();

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={cn(
        'rounded-full font-fredoka font-bold flex items-center justify-center transition-all duration-300 shadow-card',
        sizeStyles[size],
        isSelected && 'ring-4 ring-offset-2 ring-primary'
      )}
      style={{ backgroundColor: color, color: 'white' }}
    >
      {initial}
    </motion.button>
  );
};

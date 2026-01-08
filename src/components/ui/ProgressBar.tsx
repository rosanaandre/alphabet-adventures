import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ProgressBarProps {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

const sizeStyles = {
  sm: 'h-2',
  md: 'h-4',
  lg: 'h-6',
};

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  size = 'md',
  showLabel = false,
  className,
}) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className={cn('w-full', className)}>
      <div className={cn('w-full rounded-full bg-muted overflow-hidden', sizeStyles[size])}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="h-full rounded-full bg-ocean-gradient"
        />
      </div>
      {showLabel && (
        <p className="text-sm text-muted-foreground mt-1 text-center font-semibold">
          {Math.round(percentage)}%
        </p>
      )}
    </div>
  );
};

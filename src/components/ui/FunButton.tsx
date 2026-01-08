import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface FunButtonProps {
  variant?: 'primary' | 'accent' | 'success' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

const variantStyles = {
  primary: 'bg-primary text-primary-foreground shadow-button hover:shadow-lg',
  accent: 'bg-accent text-accent-foreground shadow-button hover:shadow-lg',
  success: 'bg-success text-success-foreground shadow-button hover:shadow-lg',
  outline: 'border-4 border-primary bg-transparent text-primary hover:bg-primary/10',
  ghost: 'bg-transparent text-foreground hover:bg-muted',
};

const sizeStyles = {
  sm: 'px-4 py-2 text-sm rounded-xl',
  md: 'px-6 py-3 text-base rounded-2xl',
  lg: 'px-8 py-4 text-lg rounded-2xl',
  xl: 'px-10 py-5 text-xl rounded-3xl',
};

export const FunButton: React.FC<FunButtonProps> = ({
  variant = 'primary',
  size = 'md',
  icon,
  children,
  className,
  disabled,
  onClick,
  type = 'button',
}) => {
  return (
    <motion.button
      type={type}
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      className={cn(
        'font-bold transition-all duration-200 flex items-center justify-center gap-2',
        variantStyles[variant],
        sizeStyles[size],
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      disabled={disabled}
      onClick={onClick}
    >
      {icon && <span className="text-current">{icon}</span>}
      {children}
    </motion.button>
  );
};

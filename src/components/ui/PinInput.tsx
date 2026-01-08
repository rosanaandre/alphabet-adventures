import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface PinInputProps {
  length?: number;
  onComplete: (pin: string) => void;
  error?: boolean;
}

export const PinInput: React.FC<PinInputProps> = ({
  length = 4,
  onComplete,
  error = false,
}) => {
  const [pin, setPin] = useState<string[]>(Array(length).fill(''));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newPin = [...pin];
    newPin[index] = value.slice(-1);
    setPin(newPin);

    if (value && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    if (newPin.every(digit => digit !== '')) {
      onComplete(newPin.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !pin[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <div className="flex gap-3 justify-center">
      {pin.map((digit, index) => (
        <motion.input
          key={index}
          ref={(el) => (inputRefs.current[index] = el)}
          type="password"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ 
            scale: 1, 
            opacity: 1,
            borderColor: error ? 'hsl(var(--destructive))' : digit ? 'hsl(var(--primary))' : 'hsl(var(--border))'
          }}
          transition={{ delay: index * 0.1 }}
          className={cn(
            'w-14 h-16 text-center text-2xl font-bold rounded-2xl border-4 bg-card focus:outline-none focus:ring-4 focus:ring-primary/30 transition-all',
            error && 'animate-wiggle border-destructive'
          )}
        />
      ))}
    </div>
  );
};

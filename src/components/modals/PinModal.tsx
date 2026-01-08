import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock } from 'lucide-react';
import { PinInput } from '@/components/ui/PinInput';
import { useAuth } from '@/contexts/AuthContext';

interface PinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const PinModal: React.FC<PinModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { verifyPin } = useAuth();
  const [error, setError] = useState(false);
  const [checking, setChecking] = useState(false);

  const handlePinComplete = async (pin: string) => {
    setChecking(true);
    setError(false);
    
    const isValid = await verifyPin(pin);
    
    if (isValid) {
      onSuccess();
    } else {
      setError(true);
      setTimeout(() => setError(false), 1000);
    }
    
    setChecking(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/50 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-card rounded-3xl p-8 shadow-float max-w-sm w-full"
          >
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                  <Lock className="w-6 h-6 text-primary" />
                </div>
                <h2 className="text-xl font-fredoka font-bold text-foreground">
                  Digite o PIN
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-muted transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-muted-foreground text-center mb-6">
              Área restrita aos responsáveis
            </p>

            <PinInput onComplete={handlePinComplete} error={error} />

            {error && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-destructive text-center mt-4 font-semibold"
              >
                PIN incorreto! Tente novamente.
              </motion.p>
            )}

            {checking && (
              <p className="text-muted-foreground text-center mt-4">
                Verificando...
              </p>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

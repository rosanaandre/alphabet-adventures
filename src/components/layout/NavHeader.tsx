import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Settings, Home } from 'lucide-react';
import { FunButton } from '@/components/ui/FunButton';
import { PinModal } from '@/components/modals/PinModal';

interface NavHeaderProps {
  title?: string;
  showBack?: boolean;
  showSettings?: boolean;
  showHome?: boolean;
}

export const NavHeader: React.FC<NavHeaderProps> = ({
  title,
  showBack = true,
  showSettings = true,
  showHome = false,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showPinModal, setShowPinModal] = useState(false);

  const handleBack = () => {
    navigate(-1);
  };

  const handleSettingsClick = () => {
    setShowPinModal(true);
  };

  const handlePinSuccess = () => {
    setShowPinModal(false);
    navigate('/settings');
  };

  const isHome = location.pathname === '/' || location.pathname === '/select-child';

  return (
    <>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex items-center justify-between p-4 bg-card/80 backdrop-blur-sm border-b border-border/50"
      >
        <div className="flex items-center gap-2">
          {showBack && !isHome && (
            <FunButton
              variant="ghost"
              size="sm"
              onClick={handleBack}
              icon={<ArrowLeft className="w-5 h-5" />}
            >
              Voltar
            </FunButton>
          )}
          {showHome && !isHome && (
            <FunButton
              variant="ghost"
              size="sm"
              onClick={() => navigate('/select-child')}
              icon={<Home className="w-5 h-5" />}
            >
              Início
            </FunButton>
          )}
        </div>

        {title && (
          <h1 className="text-xl font-fredoka font-bold text-foreground">
            {title}
          </h1>
        )}

        <div className="flex items-center gap-2">
          {showSettings && (
            <FunButton
              variant="ghost"
              size="sm"
              onClick={handleSettingsClick}
              icon={<Settings className="w-5 h-5" />}
            >
              Configurações
            </FunButton>
          )}
        </div>
      </motion.header>

      <PinModal
        isOpen={showPinModal}
        onClose={() => setShowPinModal(false)}
        onSuccess={handlePinSuccess}
      />
    </>
  );
};

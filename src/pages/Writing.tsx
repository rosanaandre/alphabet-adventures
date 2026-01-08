import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, RotateCcw, Trophy } from 'lucide-react';
import { NavHeader } from '@/components/layout/NavHeader';
import { FunButton } from '@/components/ui/FunButton';
import { LetterCanvas } from '@/components/LetterCanvas';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export const WritingPage: React.FC = () => {
  const navigate = useNavigate();
  const { selectedChild } = useAuth();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [completedLetters, setCompletedLetters] = useState<Set<string>>(new Set());
  const [showCongrats, setShowCongrats] = useState(false);
  const [startTime, setStartTime] = useState<number>(Date.now());

  const currentLetter = ALPHABET[currentIndex];

  useEffect(() => {
    if (!selectedChild) {
      navigate('/select-child');
      return;
    }

    // Load existing progress
    const loadProgress = async () => {
      const { data } = await supabase
        .from('letter_progress')
        .select('letter')
        .eq('child_id', selectedChild.id)
        .eq('writing_completed', true);

      if (data) {
        setCompletedLetters(new Set(data.map(p => p.letter)));
      }
    };

    loadProgress();
  }, [selectedChild, navigate]);

  useEffect(() => {
    setStartTime(Date.now());
  }, [currentIndex]);

  const handleLetterComplete = async () => {
    const timeSpent = Math.round((Date.now() - startTime) / 1000);
    
    // Save progress
    if (selectedChild) {
      await supabase
        .from('letter_progress')
        .upsert({
          child_id: selectedChild.id,
          letter: currentLetter,
          writing_completed: true,
          total_time_seconds: timeSpent,
          attempts: 1,
          completed_at: new Date().toISOString(),
        }, { onConflict: 'child_id,letter' });
    }

    setCompletedLetters(prev => new Set([...prev, currentLetter]));

    // Auto advance after a short delay
    setTimeout(() => {
      if (currentIndex < ALPHABET.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        setShowCongrats(true);
      }
    }, 1500);
  };

  const goToLetter = (index: number) => {
    if (index >= 0 && index < ALPHABET.length) {
      setCurrentIndex(index);
    }
  };

  const goNext = () => {
    if (currentIndex < ALPHABET.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const goPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  if (showCongrats) {
    return (
      <div className="min-h-screen bg-sky-gradient flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="bg-card rounded-3xl shadow-float p-8 text-center max-w-md"
        >
          <motion.div
            animate={{ 
              y: [0, -20, 0],
              rotate: [0, 10, -10, 0]
            }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="text-8xl mb-6"
          >
            🏆
          </motion.div>
          <h1 className="text-3xl font-fredoka font-bold text-rainbow mb-4">
            Parabéns!
          </h1>
          <p className="text-lg text-muted-foreground mb-6">
            Você aprendeu a escrever todas as letras do alfabeto!
          </p>
          <div className="flex gap-4 justify-center">
            <FunButton
              onClick={() => {
                setShowCongrats(false);
                setCurrentIndex(0);
              }}
              variant="outline"
              icon={<RotateCcw className="w-5 h-5" />}
            >
              Praticar Novamente
            </FunButton>
            <FunButton
              onClick={() => navigate('/menu')}
              icon={<Trophy className="w-5 h-5" />}
            >
              Voltar ao Menu
            </FunButton>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sky-gradient">
      <NavHeader title="Escrever Letras" showBack showHome />

      <div className="container max-w-4xl mx-auto p-6">
        {/* Letter Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap justify-center gap-2 mb-6"
        >
          {ALPHABET.map((letter, index) => (
            <motion.button
              key={letter}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => goToLetter(index)}
              className={`relative w-10 h-10 rounded-xl font-bold text-lg transition-all ${
                index === currentIndex
                  ? 'bg-primary text-primary-foreground shadow-button'
                  : completedLetters.has(letter)
                  ? 'bg-success/20 text-success'
                  : 'bg-card text-foreground hover:bg-muted'
              }`}
            >
              {letter}
              {completedLetters.has(letter) && index !== currentIndex && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-success rounded-full flex items-center justify-center text-xs text-success-foreground">
                  ✓
                </span>
              )}
            </motion.button>
          ))}
        </motion.div>

        {/* Main Canvas Area */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-card rounded-3xl shadow-float p-8"
        >
          <div className="text-center mb-6">
            <AnimatePresence mode="wait">
              <motion.h2
                key={currentLetter}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="text-4xl font-fredoka font-bold text-primary"
              >
                Letra {currentLetter}
              </motion.h2>
            </AnimatePresence>
            <p className="text-muted-foreground mt-2">
              Siga os traços do ponto verde até o vermelho
            </p>
          </div>

          <div className="flex justify-center mb-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentLetter}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
              >
                <LetterCanvas
                  letter={currentLetter}
                  onComplete={handleLetterComplete}
                  size={300}
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Legend */}
          <div className="flex justify-center gap-6 mb-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-success" />
              <span className="text-muted-foreground">Início</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-destructive" />
              <span className="text-muted-foreground">Fim</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-1 bg-primary rounded" />
              <span className="text-muted-foreground">Caminho</span>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-center gap-4">
            <FunButton
              onClick={goPrev}
              disabled={currentIndex === 0}
              variant="outline"
              icon={<ChevronLeft className="w-5 h-5" />}
            >
              Anterior
            </FunButton>
            <FunButton
              onClick={goNext}
              disabled={currentIndex === ALPHABET.length - 1}
              variant="primary"
              icon={<ChevronRight className="w-5 h-5" />}
            >
              Próxima
            </FunButton>
          </div>

          {/* Progress */}
          <div className="mt-8">
            <div className="flex justify-between text-sm text-muted-foreground mb-2">
              <span>Progresso</span>
              <span>{completedLetters.size} de {ALPHABET.length} letras</span>
            </div>
            <ProgressBar value={completedLetters.size} max={ALPHABET.length} />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default WritingPage;

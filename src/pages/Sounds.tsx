import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { NavHeader } from '@/components/layout/NavHeader';
import { FunButton } from '@/components/ui/FunButton';
import { LetterCard } from '@/components/ui/LetterCard';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

// Phonetic sounds for Brazilian Portuguese
const letterSounds: Record<string, string> = {
  A: 'A de Abelha',
  B: 'Bê de Bola',
  C: 'Cê de Casa',
  D: 'Dê de Dado',
  E: 'É de Elefante',
  F: 'Efe de Faca',
  G: 'Gê de Gato',
  H: 'Agá de Helicóptero',
  I: 'I de Igreja',
  J: 'Jota de Jacaré',
  K: 'Cá de Kiwi',
  L: 'Ele de Leão',
  M: 'Eme de Macaco',
  N: 'Ene de Navio',
  O: 'Ó de Ovo',
  P: 'Pê de Pato',
  Q: 'Quê de Queijo',
  R: 'Erre de Rato',
  S: 'Esse de Sapo',
  T: 'Tê de Tartaruga',
  U: 'U de Uva',
  V: 'Vê de Vaca',
  W: 'Dáblio de Waffle',
  X: 'Xis de Xícara',
  Y: 'Ípsilon de Yoga',
  Z: 'Zê de Zebra',
};

export const SoundsPage: React.FC = () => {
  const { selectedChild } = useAuth();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [completedLetters, setCompletedLetters] = useState<Set<string>>(new Set());
  const [isPlaying, setIsPlaying] = useState(false);

  const currentLetter = ALPHABET[currentIndex];

  const playSound = useCallback(() => {
    setIsPlaying(true);
    
    // Using Web Speech API for text-to-speech
    const utterance = new SpeechSynthesisUtterance(letterSounds[currentLetter]);
    utterance.lang = 'pt-BR';
    utterance.rate = 0.8;
    
    utterance.onend = () => {
      setIsPlaying(false);
      if (!completedLetters.has(currentLetter)) {
        setCompletedLetters(prev => new Set([...prev, currentLetter]));
        
        // Save progress
        if (selectedChild) {
          supabase
            .from('letter_progress')
            .upsert({
              child_id: selectedChild.id,
              letter: currentLetter,
              sound_completed: true,
            }, { onConflict: 'child_id,letter' })
            .then(({ error }) => {
              if (error) console.error('Error saving progress:', error);
            });
        }
      }
    };
    
    speechSynthesis.speak(utterance);
  }, [currentLetter, completedLetters, selectedChild]);

  const goToLetter = (index: number) => {
    if (index >= 0 && index < ALPHABET.length) {
      setCurrentIndex(index);
    }
  };

  const goNext = () => {
    if (currentIndex < ALPHABET.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      toast.success('🎉 Parabéns! Você ouviu todas as letras!');
    }
  };

  const goPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <div className="min-h-screen bg-sky-gradient">
      <NavHeader title="Sons das Letras" showBack showHome />

      <div className="container max-w-4xl mx-auto p-6">
        {/* Letter Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap justify-center gap-2 mb-8"
        >
          {ALPHABET.map((letter, index) => (
            <motion.button
              key={letter}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => goToLetter(index)}
              className={`w-10 h-10 rounded-xl font-bold text-lg transition-all ${
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

        {/* Main Display */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-card rounded-3xl shadow-float p-8 text-center"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentLetter}
              initial={{ opacity: 0, scale: 0.8, rotateY: -90 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              exit={{ opacity: 0, scale: 0.8, rotateY: 90 }}
              transition={{ duration: 0.3 }}
              className="mb-8"
            >
              <div className="text-9xl font-fredoka font-bold text-rainbow mb-4">
                {currentLetter}
              </div>
              <p className="text-2xl text-muted-foreground">
                {letterSounds[currentLetter]}
              </p>
            </motion.div>
          </AnimatePresence>

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FunButton
              onClick={playSound}
              disabled={isPlaying}
              size="xl"
              variant="accent"
              icon={<Volume2 className="w-8 h-8" />}
              className={isPlaying ? 'animate-pulse' : ''}
            >
              {isPlaying ? 'Ouvindo...' : 'Ouvir Som'}
            </FunButton>
          </motion.div>

          {/* Navigation */}
          <div className="flex justify-center gap-4 mt-8">
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
              variant="primary"
              icon={<ChevronRight className="w-5 h-5" />}
            >
              {currentIndex === ALPHABET.length - 1 ? 'Finalizar' : 'Próxima'}
            </FunButton>
          </div>

          {/* Progress */}
          <div className="mt-8">
            <p className="text-sm text-muted-foreground">
              Progresso: {completedLetters.size} de {ALPHABET.length} letras
            </p>
            <div className="w-full h-3 bg-muted rounded-full mt-2 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(completedLetters.size / ALPHABET.length) * 100}%` }}
                className="h-full bg-ocean-gradient rounded-full"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SoundsPage;

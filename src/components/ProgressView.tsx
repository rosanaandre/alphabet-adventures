import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Clock, Target, Award, TrendingUp } from 'lucide-react';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { ChildAvatar } from '@/components/ui/ChildAvatar';
import { supabase } from '@/integrations/supabase/client';

interface Child {
  id: string;
  name: string;
  avatar_color: string;
}

interface ProgressData {
  letter: string;
  sound_completed: boolean;
  writing_completed: boolean;
  total_time_seconds: number;
  attempts: number;
}

interface ProgressViewProps {
  child: Child;
}

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export const ProgressView: React.FC<ProgressViewProps> = ({ child }) => {
  const [progress, setProgress] = useState<ProgressData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProgress = async () => {
      setLoading(true);
      const { data } = await supabase
        .from('letter_progress')
        .select('*')
        .eq('child_id', child.id);

      if (data) {
        setProgress(data);
      }
      setLoading(false);
    };

    loadProgress();
  }, [child.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    );
  }

  const soundsCompleted = progress.filter(p => p.sound_completed).length;
  const writingCompleted = progress.filter(p => p.writing_completed).length;
  const totalCompleted = Math.max(soundsCompleted, writingCompleted);
  const percentComplete = Math.round((totalCompleted / ALPHABET.length) * 100);

  const totalTimeSpent = progress.reduce((sum, p) => sum + (p.total_time_seconds || 0), 0);
  const avgTimePerLetter = writingCompleted > 0 ? Math.round(totalTimeSpent / writingCompleted) : 0;

  const hardestLetters = progress
    .filter(p => p.attempts > 1 || p.total_time_seconds > avgTimePerLetter)
    .sort((a, b) => b.attempts - a.attempts)
    .slice(0, 3)
    .map(p => p.letter);

  const getLevel = () => {
    if (percentComplete >= 100) return { level: 5, name: 'Mestre do ABC', emoji: '👑' };
    if (percentComplete >= 80) return { level: 4, name: 'Expert', emoji: '🌟' };
    if (percentComplete >= 60) return { level: 3, name: 'Avançado', emoji: '🚀' };
    if (percentComplete >= 40) return { level: 2, name: 'Intermediário', emoji: '📚' };
    if (percentComplete >= 20) return { level: 1, name: 'Iniciante', emoji: '🌱' };
    return { level: 0, name: 'Começando', emoji: '🎯' };
  };

  const levelInfo = getLevel();

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4"
      >
        <ChildAvatar
          name={child.name}
          color={child.avatar_color}
          size="lg"
        />
        <div>
          <h2 className="text-xl font-fredoka font-bold">
            {child.name}
          </h2>
          <p className="text-muted-foreground flex items-center gap-2">
            <span className="text-xl">{levelInfo.emoji}</span>
            Nível {levelInfo.level}: {levelInfo.name}
          </p>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 gap-3"
      >
        <motion.div
          variants={itemVariants}
          className="bg-muted/50 rounded-2xl p-4"
        >
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-4 h-4 text-primary" />
            <span className="text-xs text-muted-foreground">Progresso</span>
          </div>
          <p className="text-2xl font-bold text-primary">{percentComplete}%</p>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="bg-muted/50 rounded-2xl p-4"
        >
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 className="w-4 h-4 text-success" />
            <span className="text-xs text-muted-foreground">Letras</span>
          </div>
          <p className="text-2xl font-bold text-success">{totalCompleted}/26</p>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="bg-muted/50 rounded-2xl p-4"
        >
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-accent" />
            <span className="text-xs text-muted-foreground">Tempo médio</span>
          </div>
          <p className="text-2xl font-bold text-accent">{avgTimePerLetter}s</p>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="bg-muted/50 rounded-2xl p-4"
        >
          <div className="flex items-center gap-2 mb-2">
            <Award className="w-4 h-4 text-fun-purple" />
            <span className="text-xs text-muted-foreground">Nível</span>
          </div>
          <p className="text-2xl font-bold text-fun-purple">{levelInfo.level}</p>
        </motion.div>
      </motion.div>

      {/* Progress Bars */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="bg-muted/50 rounded-2xl p-4"
      >
        <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-primary" />
          Progresso Detalhado
        </h3>

        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span>Sons das Letras</span>
              <span className="text-muted-foreground">{soundsCompleted}/26</span>
            </div>
            <ProgressBar value={soundsCompleted} max={26} />
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span>Escrita das Letras</span>
              <span className="text-muted-foreground">{writingCompleted}/26</span>
            </div>
            <ProgressBar value={writingCompleted} max={26} />
          </div>
        </div>
      </motion.div>

      {/* Hardest Letters */}
      {hardestLetters.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-muted/50 rounded-2xl p-4"
        >
          <h3 className="text-sm font-bold mb-3">
            Letras para Praticar Mais
          </h3>
          <div className="flex gap-2">
            {hardestLetters.map((letter, index) => (
              <motion.div
                key={letter}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center text-lg font-bold text-accent"
              >
                {letter}
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Letter Grid Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-muted/50 rounded-2xl p-4"
      >
        <h3 className="text-sm font-bold mb-3">
          Todas as Letras
        </h3>
        <div className="flex flex-wrap gap-1.5">
          {ALPHABET.map((letter) => {
            const letterProgress = progress.find(p => p.letter === letter);
            const isComplete = letterProgress?.writing_completed || letterProgress?.sound_completed;
            
            return (
              <motion.div
                key={letter}
                whileHover={{ scale: 1.1 }}
                className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm transition-all ${
                  isComplete
                    ? 'bg-success text-success-foreground'
                    : 'bg-card text-muted-foreground'
                }`}
              >
                {letter}
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};

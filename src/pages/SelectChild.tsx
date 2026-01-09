import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Play, Sparkles } from 'lucide-react';
import { FunButton } from '@/components/ui/FunButton';
import { ChildAvatar } from '@/components/ui/ChildAvatar';
import { NavHeader } from '@/components/layout/NavHeader';
import { useAuth } from '@/contexts/AuthContext';

export const SelectChildPage: React.FC = () => {
  const navigate = useNavigate();
  const { children, selectChild, guardian } = useAuth();

  const handleSelectChild = (child: typeof children[0]) => {
    selectChild(child);
    navigate('/menu');
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-sky-gradient">
      <NavHeader title="AlphaPlay" showBack={false} />

      <div className="container max-w-2xl mx-auto p-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-fredoka font-bold mb-2">
            Olá, {guardian?.name}! 👋
          </h1>
          <p className="text-muted-foreground text-lg">
            Quem vai aprender hoje?
          </p>
        </motion.div>

        {children.length === 0 ? (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-card rounded-3xl shadow-card p-8 text-center"
          >
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-primary/20 flex items-center justify-center">
              <Sparkles className="w-12 h-12 text-primary" />
            </div>
            <h2 className="text-xl font-bold mb-2">
              Nenhuma criança cadastrada
            </h2>
            <p className="text-muted-foreground mb-6">
              Adicione uma criança para começar a diversão!
            </p>
            <FunButton
              onClick={() => navigate('/add-child')}
              icon={<Plus className="w-5 h-5" />}
            >
              Adicionar Criança
            </FunButton>
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid gap-4"
          >
            {children.map((child, index) => (
              <motion.div
                key={child.id}
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                className="bg-card rounded-3xl shadow-card p-6 flex items-center gap-4 cursor-pointer transition-shadow hover:shadow-float"
                onClick={() => handleSelectChild(child)}
              >
                <ChildAvatar
                  name={child.name}
                  color={child.avatar_color}
                  size="lg"
                />
                <div className="flex-1">
                  <h3 className="text-xl font-bold">{child.name}</h3>
                  <p className="text-muted-foreground">
                    Toque para começar
                  </p>
                </div>
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  <Play className="w-8 h-8 text-primary" />
                </motion.div>
              </motion.div>
            ))}

            <motion.button
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              onClick={() => navigate('/add-child')}
              className="bg-card/50 rounded-3xl border-4 border-dashed border-border p-6 flex items-center justify-center gap-3 text-muted-foreground hover:text-foreground hover:border-primary transition-colors"
            >
              <Plus className="w-6 h-6" />
              <span className="font-semibold">Adicionar outra criança</span>
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default SelectChildPage;

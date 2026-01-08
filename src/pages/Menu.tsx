import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Volume2, Pencil, BarChart3, Sparkles } from 'lucide-react';
import { NavHeader } from '@/components/layout/NavHeader';
import { ChildAvatar } from '@/components/ui/ChildAvatar';
import { useAuth } from '@/contexts/AuthContext';

const menuItems = [
  {
    id: 'sounds',
    title: 'Sons das Letras',
    description: 'Ouça o som de cada letra',
    icon: Volume2,
    path: '/sounds',
    gradient: 'from-fun-pink to-fun-orange',
    iconBg: 'bg-fun-pink/20',
  },
  {
    id: 'writing',
    title: 'Escrever Letras',
    description: 'Aprenda a traçar cada letra',
    icon: Pencil,
    path: '/writing',
    gradient: 'from-fun-green to-primary',
    iconBg: 'bg-fun-green/20',
  },
  {
    id: 'progress',
    title: 'Meu Progresso',
    description: 'Veja o que você aprendeu',
    icon: BarChart3,
    path: '/progress',
    gradient: 'from-fun-purple to-primary',
    iconBg: 'bg-fun-purple/20',
  },
];

export const MenuPage: React.FC = () => {
  const navigate = useNavigate();
  const { selectedChild } = useAuth();

  if (!selectedChild) {
    navigate('/select-child');
    return null;
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-sky-gradient">
      <NavHeader showBack showHome />

      <div className="container max-w-2xl mx-auto p-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-8"
        >
          <ChildAvatar
            name={selectedChild.name}
            color={selectedChild.avatar_color}
            size="lg"
          />
          <div>
            <h1 className="text-2xl font-fredoka font-bold">
              Olá, {selectedChild.name}! 🌟
            </h1>
            <p className="text-muted-foreground">
              O que vamos aprender hoje?
            </p>
          </div>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid gap-4"
        >
          {menuItems.map((item) => (
            <motion.button
              key={item.id}
              variants={itemVariants}
              whileHover={{ scale: 1.02, y: -5 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate(item.path)}
              className={`bg-gradient-to-br ${item.gradient} rounded-3xl p-6 text-left shadow-card hover:shadow-float transition-all`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-16 h-16 rounded-2xl ${item.iconBg} flex items-center justify-center`}>
                  <item.icon className="w-8 h-8 text-primary-foreground" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-primary-foreground mb-1">
                    {item.title}
                  </h2>
                  <p className="text-primary-foreground/80 text-sm">
                    {item.description}
                  </p>
                </div>
                <Sparkles className="w-6 h-6 text-primary-foreground/60" />
              </div>
            </motion.button>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default MenuPage;

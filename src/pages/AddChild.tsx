import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, ArrowRight, Calendar } from 'lucide-react';
import { FunButton } from '@/components/ui/FunButton';
import { ChildAvatar } from '@/components/ui/ChildAvatar';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const avatarColors = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', 
  '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F',
  '#BB8FCE', '#85C1E9'
];

export const AddChildPage: React.FC = () => {
  const navigate = useNavigate();
  const { addChild, guardian } = useAuth();
  const [name, setName] = useState('');
  const [selectedColor, setSelectedColor] = useState(avatarColors[0]);
  const [birthDate, setBirthDate] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Digite o nome da criança');
      return;
    }

    setLoading(true);
    try {
      await addChild(name.trim(), selectedColor, birthDate || undefined);
      toast.success(`${name} adicionado(a) com sucesso!`);
      navigate('/select-child');
    } catch (error: any) {
      toast.error(error.message || 'Erro ao adicionar criança');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-sky-gradient flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-card rounded-3xl shadow-float p-8 w-full max-w-md"
      >
        <motion.div
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          className="text-center mb-8"
        >
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center">
            <Plus className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-2xl font-fredoka font-bold mb-2">
            Adicionar Criança
          </h1>
          <p className="text-muted-foreground">
            Olá {guardian?.name}, adicione uma criança para começar
          </p>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold mb-2">
              Nome da criança
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border-2 border-border bg-background focus:border-primary focus:outline-none transition-colors text-lg"
              placeholder="Digite o nome"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">
              Data de nascimento (opcional)
            </label>
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-2xl border-2 border-border bg-background focus:border-primary focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-3">
              Escolha uma cor
            </label>
            <div className="flex flex-wrap gap-3 justify-center">
              {avatarColors.map((color) => (
                <motion.button
                  key={color}
                  type="button"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setSelectedColor(color)}
                  className={`w-10 h-10 rounded-full transition-all ${
                    selectedColor === color
                      ? 'ring-4 ring-offset-2 ring-primary'
                      : ''
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          <div className="flex justify-center py-4">
            <ChildAvatar
              name={name || '?'}
              color={selectedColor}
              size="xl"
            />
          </div>

          <FunButton
            type="submit"
            className="w-full"
            size="lg"
            disabled={loading}
            icon={<ArrowRight className="w-5 h-5" />}
          >
            Adicionar
          </FunButton>
        </form>
      </motion.div>
    </div>
  );
};

export default AddChildPage;

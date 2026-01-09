import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogOut, Users, Key, Trash2, ChevronRight, BarChart3, ChevronDown } from 'lucide-react';
import { NavHeader } from '@/components/layout/NavHeader';
import { FunButton } from '@/components/ui/FunButton';
import { ChildAvatar } from '@/components/ui/ChildAvatar';
import { PinInput } from '@/components/ui/PinInput';
import { ProgressView } from '@/components/ProgressView';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const { guardian, children, signOut, refreshChildren } = useAuth();
  const [showChangePinModal, setShowChangePinModal] = useState(false);
  const [newPin, setNewPin] = useState('');
  const [showProgressSection, setShowProgressSection] = useState(false);
  const [selectedProgressChild, setSelectedProgressChild] = useState<string | null>(null);

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Você saiu da conta');
      navigate('/auth');
    } catch (error) {
      toast.error('Erro ao sair');
    }
  };

  const handleChangePin = async () => {
    if (newPin.length !== 4) {
      toast.error('O PIN deve ter 4 dígitos');
      return;
    }

    try {
      const { error } = await supabase
        .from('guardians')
        .update({ pin_hash: newPin })
        .eq('id', guardian?.id);

      if (error) throw error;
      
      toast.success('PIN alterado com sucesso!');
      setShowChangePinModal(false);
      setNewPin('');
    } catch (error) {
      toast.error('Erro ao alterar PIN');
    }
  };

  const handleDeleteChild = async (childId: string, childName: string) => {
    if (!confirm(`Tem certeza que deseja remover ${childName}? Todo o progresso será perdido.`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('children')
        .delete()
        .eq('id', childId);

      if (error) throw error;
      
      await refreshChildren();
      if (selectedProgressChild === childId) {
        setSelectedProgressChild(null);
      }
      toast.success(`${childName} foi removido(a)`);
    } catch (error) {
      toast.error('Erro ao remover criança');
    }
  };

  const handleToggleProgress = () => {
    setShowProgressSection(!showProgressSection);
    if (!showProgressSection && children.length > 0 && !selectedProgressChild) {
      setSelectedProgressChild(children[0].id);
    }
  };

  const selectedChild = children.find(c => c.id === selectedProgressChild);

  return (
    <div className="min-h-screen bg-sky-gradient">
      <NavHeader title="Configurações" showBack showSettings={false} />

      <div className="container max-w-2xl mx-auto p-6">
        {/* Guardian Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-3xl p-6 shadow-card mb-6"
        >
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            Responsável
          </h2>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-2xl font-bold text-primary">
              {guardian?.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-bold text-lg">{guardian?.name}</p>
              <p className="text-muted-foreground">{guardian?.email}</p>
            </div>
          </div>
        </motion.div>

        {/* Progress Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-card rounded-3xl p-6 shadow-card mb-6"
        >
          <button
            onClick={handleToggleProgress}
            className="w-full flex items-center justify-between"
          >
            <h2 className="text-lg font-bold flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" />
              Progresso das Crianças
            </h2>
            <ChevronDown 
              className={`w-5 h-5 text-muted-foreground transition-transform ${showProgressSection ? 'rotate-180' : ''}`} 
            />
          </button>

          {showProgressSection && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4"
            >
              {children.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  Nenhuma criança cadastrada
                </p>
              ) : (
                <>
                  {/* Child Selector */}
                  {children.length > 1 && (
                    <div className="mb-4">
                      <p className="text-sm text-muted-foreground mb-2">Selecione a criança:</p>
                      <div className="flex flex-wrap gap-2">
                        {children.map((child) => (
                          <button
                            key={child.id}
                            onClick={() => setSelectedProgressChild(child.id)}
                            className={`flex items-center gap-2 px-3 py-2 rounded-full transition-all ${
                              selectedProgressChild === child.id
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted/50 hover:bg-muted'
                            }`}
                          >
                            <ChildAvatar
                              name={child.name}
                              color={child.avatar_color}
                              size="sm"
                            />
                            <span className="text-sm font-medium">{child.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Progress View */}
                  {selectedChild && (
                    <ProgressView child={selectedChild} />
                  )}
                </>
              )}
            </motion.div>
          )}
        </motion.div>

        {/* Children */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-3xl p-6 shadow-card mb-6"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              Crianças ({children.length})
            </h2>
            <FunButton
              onClick={() => navigate('/add-child')}
              size="sm"
              variant="outline"
            >
              Adicionar
            </FunButton>
          </div>

          {children.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              Nenhuma criança cadastrada
            </p>
          ) : (
            <div className="space-y-3">
              {children.map((child) => (
                <div
                  key={child.id}
                  className="flex items-center gap-3 p-3 rounded-2xl bg-muted/50"
                >
                  <ChildAvatar
                    name={child.name}
                    color={child.avatar_color}
                    size="md"
                  />
                  <div className="flex-1">
                    <p className="font-semibold">{child.name}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteChild(child.id, child.name)}
                    className="p-2 rounded-full hover:bg-destructive/20 text-destructive transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Security */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card rounded-3xl p-6 shadow-card mb-6"
        >
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Key className="w-5 h-5 text-primary" />
            Segurança
          </h2>
          
          <button
            onClick={() => setShowChangePinModal(true)}
            className="w-full flex items-center justify-between p-4 rounded-2xl bg-muted/50 hover:bg-muted transition-colors"
          >
            <span>Alterar PIN</span>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>
        </motion.div>

        {/* Sign Out */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <FunButton
            onClick={handleSignOut}
            variant="outline"
            className="w-full border-destructive text-destructive hover:bg-destructive/10"
            icon={<LogOut className="w-5 h-5" />}
          >
            Sair da Conta
          </FunButton>
        </motion.div>
      </div>

      {/* Change PIN Modal */}
      {showChangePinModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/50 backdrop-blur-sm"
          onClick={() => setShowChangePinModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-card rounded-3xl p-8 shadow-float max-w-sm w-full"
          >
            <h2 className="text-xl font-bold text-center mb-6">
              Novo PIN
            </h2>
            <p className="text-muted-foreground text-center mb-6">
              Digite um novo PIN de 4 dígitos
            </p>
            <PinInput onComplete={setNewPin} />
            <div className="flex gap-3 mt-6">
              <FunButton
                onClick={() => setShowChangePinModal(false)}
                variant="outline"
                className="flex-1"
              >
                Cancelar
              </FunButton>
              <FunButton
                onClick={handleChangePin}
                className="flex-1"
                disabled={newPin.length !== 4}
              >
                Salvar
              </FunButton>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default SettingsPage;

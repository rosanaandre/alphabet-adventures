import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, KeyRound, ArrowRight } from 'lucide-react';
import { FunButton } from '@/components/ui/FunButton';
import { PinInput } from '@/components/ui/PinInput';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

type Step = 'form' | 'pin';
type Mode = 'login' | 'register';

export const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<Mode>('login');
  const [step, setStep] = useState<Step>('form');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    pin: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (mode === 'register' && step === 'form') {
      setStep('pin');
      return;
    }

    setLoading(true);

    try {
      if (mode === 'login') {
        await signIn(formData.email, formData.password);
        toast.success('Bem-vindo de volta!');
        navigate('/select-child');
      } else {
        await signUp(formData.email, formData.password, formData.name, formData.pin);
        toast.success('Conta criada com sucesso!');
        navigate('/add-child');
      }
    } catch (error: any) {
      toast.error(error.message || 'Erro ao processar');
    } finally {
      setLoading(false);
    }
  };

  const handlePinComplete = (pin: string) => {
    setFormData({ ...formData, pin });
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
          <h1 className="text-4xl font-fredoka font-bold text-rainbow mb-2">
            ABC Kids
          </h1>
          <p className="text-muted-foreground">
            {mode === 'login' ? 'Acesse sua conta' : 'Crie sua conta'}
          </p>
        </motion.div>

        {step === 'form' ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
              >
                <label className="block text-sm font-semibold mb-2">
                  Seu nome
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full pl-12 pr-4 py-3 rounded-2xl border-2 border-border bg-background focus:border-primary focus:outline-none transition-colors"
                    placeholder="Digite seu nome"
                    required={mode === 'register'}
                  />
                </div>
              </motion.div>
            )}

            <div>
              <label className="block text-sm font-semibold mb-2">
                E-mail
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-12 pr-4 py-3 rounded-2xl border-2 border-border bg-background focus:border-primary focus:outline-none transition-colors"
                  placeholder="seu@email.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-12 pr-4 py-3 rounded-2xl border-2 border-border bg-background focus:border-primary focus:outline-none transition-colors"
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
              </div>
            </div>

            <FunButton
              type="submit"
              className="w-full"
              size="lg"
              disabled={loading}
              icon={<ArrowRight className="w-5 h-5" />}
            >
              {mode === 'login' ? 'Entrar' : 'Continuar'}
            </FunButton>
          </form>
        ) : (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center">
                <KeyRound className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-xl font-bold mb-2">Crie um PIN</h2>
              <p className="text-muted-foreground text-sm">
                Este PIN de 4 dígitos protegerá as configurações
              </p>
            </div>

            <PinInput onComplete={handlePinComplete} />

            <FunButton
              onClick={() => handleSubmit({ preventDefault: () => {} } as React.FormEvent)}
              className="w-full"
              size="lg"
              disabled={loading || formData.pin.length !== 4}
              icon={<ArrowRight className="w-5 h-5" />}
            >
              Criar Conta
            </FunButton>

            <button
              type="button"
              onClick={() => setStep('form')}
              className="w-full text-muted-foreground hover:text-foreground transition-colors"
            >
              Voltar
            </button>
          </motion.div>
        )}

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => {
              setMode(mode === 'login' ? 'register' : 'login');
              setStep('form');
            }}
            className="text-primary font-semibold hover:underline"
          >
            {mode === 'login'
              ? 'Não tem conta? Cadastre-se'
              : 'Já tem conta? Faça login'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthPage;

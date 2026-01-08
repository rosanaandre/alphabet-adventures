import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const navigate = useNavigate();
  const { user, loading, children } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (user) {
        if (children.length > 0) {
          navigate('/select-child');
        } else {
          navigate('/add-child');
        }
      } else {
        navigate('/auth');
      }
    }
  }, [user, loading, children, navigate]);

  return (
    <div className="min-h-screen bg-sky-gradient flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-5xl font-fredoka font-bold text-rainbow mb-4 animate-pulse">
          ABC Kids
        </h1>
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    </div>
  );
};

export default Index;

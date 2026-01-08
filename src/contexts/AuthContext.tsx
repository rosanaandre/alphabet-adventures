import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface Guardian {
  id: string;
  name: string;
  email: string;
}

interface Child {
  id: string;
  name: string;
  avatar_color: string;
  birth_date?: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  guardian: Guardian | null;
  children: Child[];
  selectedChild: Child | null;
  loading: boolean;
  signUp: (email: string, password: string, name: string, pin: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  selectChild: (child: Child) => void;
  verifyPin: (pin: string) => Promise<boolean>;
  addChild: (name: string, avatarColor: string, birthDate?: string) => Promise<void>;
  refreshChildren: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [guardian, setGuardian] = useState<Guardian | null>(null);
  const [childrenList, setChildrenList] = useState<Child[]>([]);
  const [selectedChild, setSelectedChild] = useState<Child | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          setTimeout(() => fetchGuardianData(session.user.id), 0);
        } else {
          setGuardian(null);
          setChildrenList([]);
          setSelectedChild(null);
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchGuardianData(session.user.id);
      } else {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchGuardianData = async (userId: string) => {
    try {
      const { data: guardianData } = await supabase
        .from('guardians')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (guardianData) {
        setGuardian({
          id: guardianData.id,
          name: guardianData.name,
          email: guardianData.email,
        });

        const { data: childrenData } = await supabase
          .from('children')
          .select('*')
          .eq('guardian_id', guardianData.id);

        if (childrenData) {
          setChildrenList(childrenData);
        }
      }
    } catch (error) {
      console.error('Error fetching guardian data:', error);
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name: string, pin: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin,
      },
    });

    if (error) throw error;

    if (data.user) {
      const { error: guardianError } = await supabase
        .from('guardians')
        .insert({
          user_id: data.user.id,
          name,
          email,
          pin_hash: pin, // In production, use proper hashing
        });

      if (guardianError) throw guardianError;
    }
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setGuardian(null);
    setChildrenList([]);
    setSelectedChild(null);
  };

  const selectChild = (child: Child) => {
    setSelectedChild(child);
  };

  const verifyPin = async (pin: string): Promise<boolean> => {
    if (!user) return false;

    const { data } = await supabase
      .from('guardians')
      .select('pin_hash')
      .eq('user_id', user.id)
      .single();

    return data?.pin_hash === pin;
  };

  const addChild = async (name: string, avatarColor: string, birthDate?: string) => {
    if (!guardian) throw new Error('No guardian found');

    const { error } = await supabase
      .from('children')
      .insert({
        guardian_id: guardian.id,
        name,
        avatar_color: avatarColor,
        birth_date: birthDate,
      });

    if (error) throw error;
    await refreshChildren();
  };

  const refreshChildren = async () => {
    if (!guardian) return;

    const { data } = await supabase
      .from('children')
      .select('*')
      .eq('guardian_id', guardian.id);

    if (data) {
      setChildrenList(data);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        guardian,
        children: childrenList,
        selectedChild,
        loading,
        signUp,
        signIn,
        signOut,
        selectChild,
        verifyPin,
        addChild,
        refreshChildren,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

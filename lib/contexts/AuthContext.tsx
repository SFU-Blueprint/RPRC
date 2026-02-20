'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import {
  getCurrentAuthUser,
  signOutClient,
  subscribeToAuthChanges,
} from '@/lib/api/services/auth-service';

type AuthContextType = {
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSession = async () => {
      const user = await getCurrentAuthUser();
      setUser(user);
      setLoading(false);
    };

    getSession();

    const unsubscribe = subscribeToAuthChanges((session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signOut = async () => {
    await signOutClient();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

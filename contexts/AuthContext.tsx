
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged, signOut, type User } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

interface UserProfile {
  id: string;
  role: 'admin' | 'user' | 'super_admin';
  tenantId: string;
  displayName: string;
  email: string;
  professionalEmail?: string;
  avatar_url?: string;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  logout: () => Promise<void>;
  isSessionReady: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSessionReady, setIsSessionReady] = useState(false);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      
      if (currentUser) {
        const profileRef = doc(db, 'users', currentUser.uid);
        
        // Usamos um listener resiliente
        const unsubscribeProfile = onSnapshot(profileRef, (docSnap) => {
          if (docSnap.exists()) {
            setProfile(docSnap.data() as UserProfile);
            setIsSessionReady(true);
            setLoading(false);
          } else {
            // Se o documento ainda não existir (comum durante o registo), 
            // não damos erro imediato, apenas aguardamos o próximo snapshot
            console.debug("Aguardando criação do documento de perfil...");
            setProfile(null);
            
            // Timeout de segurança para não ficar preso se houver erro real de criação
            const timer = setTimeout(() => {
              if (!docSnap.exists()) {
                setIsSessionReady(true);
                setLoading(false);
              }
            }, 5000);
            return () => clearTimeout(timer);
          }
        }, (error) => {
          // Ignoramos erros de permissão se o documento ainda não existir (race condition)
          if (error.code === 'permission-denied') {
            console.warn("Permissão negada temporária no perfil. Provável criação em curso.");
          } else {
            console.error("Erro no perfil:", error);
          }
          setIsSessionReady(true);
          setLoading(false);
        });

        return () => unsubscribeProfile();
      } else {
        setProfile(null);
        setLoading(false);
        setIsSessionReady(true);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  const logout = async () => {
    await signOut(auth);
    setProfile(null);
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, logout, isSessionReady }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

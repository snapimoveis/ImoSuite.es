
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged, signOut, type User } from 'firebase/auth';
import { doc, onSnapshot, getDoc } from 'firebase/firestore';
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
    const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      
      if (currentUser) {
        // Cargar perfil desde Firestore (Fuente única de verdad para el tenantId)
        const profileRef = doc(db, 'users', currentUser.uid);
        
        const unsubscribeProfile = onSnapshot(profileRef, (docSnap) => {
          if (docSnap.exists()) {
            setProfile(docSnap.data() as UserProfile);
          } else {
            // Caso de error: Usuario en Auth pero sin documento en Firestore
            console.error("No se encontró el perfil del usuario en Firestore.");
            setProfile(null);
          }
          setIsSessionReady(true);
          setLoading(false);
        }, (error) => {
          console.error("Error al escuchar perfil:", error);
          if (error.code === 'permission-denied') {
            alert("No tienes permisos para acceder a estos datos.");
          }
          setLoading(false);
          setIsSessionReady(true);
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

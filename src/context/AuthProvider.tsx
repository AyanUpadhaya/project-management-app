/* eslint-disable react-refresh/only-export-components */
// src/AuthProvider.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/superbase/supabaseClient";
import type { User } from "@supabase/supabase-js";

interface AuthContextType {
  user: User;
  loading: boolean;
}

const AuthContext = createContext({});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);


  // Load user on app start
  useEffect(() => {
    const getUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (data?.user) {
        setUser(data?.user);
      }else{
        console.error(error);
      }
      setLoading(false);
    };
    getUser();

    // Listen for auth state changes
    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_, session) => {
        setUser(session?.user || null);
       
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook
export function useAuth(): AuthContextType {
  return useContext(AuthContext) as AuthContextType;
}

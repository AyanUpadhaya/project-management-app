// authService.js
import { supabase } from "@/superbase/supabaseClient";


export const signUp = async (email:string, password:string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  return { data, error };
};

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  return { data, error };
};

export const signOut = async () => {
  
  try {
    await supabase.auth.signOut();
    
  } catch (error) {
    console.error(error);
  }
};

export const getCurrentUser = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
};


import type { LoginCredentials } from "@/types/authSupabase";
import supabase from "@/lib/supabaseClient";


export const signIn = async(credentials: LoginCredentials) => {
         try {        
              const {  error } = await supabase.auth.signInWithPassword({
                email: credentials.email,
                password: credentials.password,
              });
        
              if (error) {
                return { error: error.message };
              }
              
              return { success: 'Logueo exitoso!' };
            } catch (error) {
              return { error: 'Error de conexión' };
            }
      
}
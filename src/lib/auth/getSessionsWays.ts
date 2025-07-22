import type { User } from "@/types/authSupabase";
import supabase from "@/lib/supabaseClient";


export const getCurrentSession = async() => {
     try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        return { user: null, session: null, error: error.message };
      }

      if (session?.user) {
        const { data: userProfile, error: profileError } = await supabase
          .from('usuarios')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (profileError) {
          return { user: null, session, error: 'Error obteniendo perfil' };
        }

        return {
          user: userProfile as User,
          session,
          error: null
        };
      }

      return { user: null, session: null, error: null };
    } catch (error) {
      return { user: null, session: null, error: 'Error de conexión' };
    }
}

export const getCurrentUser = async(): Promise<User | null> => {
     try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      
      if (!authUser) return null;

      const { data: userProfile } = await supabase
        .from('usuarios')
        .select('*')
        .eq('id', authUser.id)
        .single();

      return userProfile as User || null;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
}
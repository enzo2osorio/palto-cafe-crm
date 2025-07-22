import supabase from "@/lib/supabaseClient";


export const signOut = async() => {
     try {
          const { error } = await supabase.auth.signOut();
          return { error: error?.message || null };
        } catch (error) {
          return { error: 'Error cerrando sesión' };
        }
}
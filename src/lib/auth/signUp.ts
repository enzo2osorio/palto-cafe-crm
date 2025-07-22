
import type { RegisterData, User } from "@/types/authSupabase";
import supabase from "@/lib/supabaseClient";
import { getUserByEmail } from "@/utils/auth/getUserByEmail";


export const signUp = async(registerData: RegisterData) => {
        try {
          const isExistingUser = await getUserByEmail(registerData.email)
          console.log("Usuario existente:", isExistingUser);
          if(isExistingUser){
            return {error: "Ya existe un usuario con el email recibido."}
          }

          const {data, error } = await supabase.auth.signUp({
            email: registerData.email,
            password: registerData.password,
          });

          if (error) {
            return { user: null, session: null, error: error.message };
          }
    
          if (data.user) {
            // Crear perfil en la tabla usuarios
            const { data: userProfile, error: profileError } = await supabase
              .from('usuarios')
              .insert([
                {
                  id: data.user.id,
                  email: registerData.email,
                  nombre: registerData.nombre,
                  apellido: registerData.apellido,
                  role: registerData.role || 'empleado',
                  created_at: new Date().toISOString(),
                }
              ])
              .select()
              .single();
    
            if (profileError) {
              return { user: null, session: data.session, error: 'Error creando perfil de usuario' };
            }
    
            return {
              user: userProfile as User,
              session: data.session,
              error: null
            };
          }
    
          return { success: "Usuario registrado correctamente"};
        } catch (error) {
          return { error: 'Error de conexión' };
        }
      
}
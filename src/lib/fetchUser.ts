import type { User } from "@/types/authSupabase";
import supabase from "./supabaseClient";

interface FetchUserProps{
    setUser: (user: User | null) => void;
    setLoading: (loading: boolean) => void;
}

export const fetchingAuthUser = async({ setUser, setLoading }: FetchUserProps) => {
       setLoading(true);
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      console.warn("No auth user found or error:", authError);
      setUser(null);
      return;
    }

    const publicUser = await fetchUser(user.id);

    if (!publicUser) {
      setUser(null);
      return;
    }

    setUser(publicUser);
  } catch (err) {
    console.error("Unexpected error during fetchingAuthUser:", err);
    setUser(null);
  } finally {
    setLoading(false);
  }
}

// export const fetchingPublicUser = async (userId: string, setUser: (user: User | null) => void, setLoading: (loading: boolean) => void) => {
//     setLoading(true);
//     const { data, error } = await supabase.auth.api.getUserById(userId);
//     if (error) {
//         setUser(null);
//     } else {
//         setUser(data);
//     }
//     setLoading(false);
// };

export const fetchUser = async (userId: string) => {
    if (!userId) {
        return null;
    }
    if (!supabase) {
        console.error("Supabase client is not initialized");
        return null;
    }

    try {
        const { data, error } = await supabase.from("usuarios").select("*").eq("id", userId).single();
        if (error) {
            console.error("Error fetching user:", error);
            return null;
        } else {
            return data as User;
        }
    } catch (error) {
        console.error("Unexpected error:", error);
        return null;
    } 
}
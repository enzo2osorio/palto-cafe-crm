import supabase from "@/lib/supabaseClient"

export const getUserByEmail = async (email: string) => {
  const { data, error } = await supabase
    .from("usuarios")
    .select("*")
    .eq("email", email)
    .single();

  if (error) {
    console.error("Error fetching user by email:", error);
    return null;
  }

  return data;
}
import supabase from "@/lib/supabaseClient"

export const getUserByEmail = async (email: string) => {
  const { data, error } = await supabase
    .from("usuarios")
    .select("*")
    .eq("email", email)
    .single();

    console.log("getUserByEmail data:", data);
    console.log("getUserByEmail error:", error);

  console.log("no error")
  return data
}
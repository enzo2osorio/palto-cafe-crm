import { createClient } from '@supabase/supabase-js';

// In the browser we must use the ANON key. The SERVICE ROLE key must only be
// used on a trusted server. Using the anon key ensures the client sends the
// current session JWT and respects RLS policies.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;
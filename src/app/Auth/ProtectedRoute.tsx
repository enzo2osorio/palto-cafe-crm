import { useEffect, useState, type ReactNode } from 'react';
import { Loader2, Coffee } from 'lucide-react';
import { useNavigate } from 'react-router';
import supabase from '@/lib/supabaseClient';
import type { User } from '@supabase/supabase-js';
interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate()

  // Mostrar loading mientras se verifica la autenticación
  useEffect(() =>{
    const fetchUser = async() => {
      const user = await supabase.auth.getUser();
      setUser(user.data.user);
      setLoading(false);
      console.log({user})
    }
    fetchUser()

   }, [])

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login', { replace: true });
    }
  }, [loading, user, navigate]);


  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <div className="w-24 h-24">
              {/* <Frame61 /> */}
            </div>
          </div>
          <div className="space-y-3">
            <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto" />
            <h2 className="font-body text-2xl text-foreground">Verificando acceso...</h2>
            <div className="flex items-center justify-center space-x-2">
              <Coffee className="w-5 h-5 text-primary" />
              <span className="font-ui text-muted-foreground">Surf Ranch CRM</span>
            </div>
          </div>
        </div>
      </div>
    );
  }


  return <>{children}</>;
}


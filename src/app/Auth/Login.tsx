import { useEffect, useState } from 'react';
import { Eye, EyeOff, Coffee, Mail, Lock, AlertCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert } from '@/components/ui/alert';
import { signIn } from '@/lib/auth/signIn';
import { useNavigate } from 'react-router';
import supabase from '@/lib/supabaseClient';

export function LoginPage() {
  // const { signIn, loading } = useAuth();
  // const [user, setUser] = useState<User | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  useEffect( () => {
    const fetchSession = async() => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate('/dashboard');
      }
    }
    fetchSession();

  }, [])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError(''); // Limpiar error al cambiar input
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.email || !formData.password) {
      setError('Por favor completa todos los campos');
      return;
    }

    try {
      const response = await signIn(formData);
      
      if (response.error) {
        setError(response.error);
      } else if (response.success) {
        
        navigate('/dashboard');
      }
    } catch (error) {
      setError('Error de conexión. Inténtalo nuevamente.');
    }
  };

  const handleDemoLogin = () => {
    setFormData({
      email: 'admin@surfranch.cl',
      password: 'admin123'
    });
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      {/* Fondo decorativo */}
      <div className="absolute inset-0 bg-gradient-to-br from-surf-light/10 to-coffee-light/20 pointer-events-none"></div>
      
      <div className="relative w-full max-w-md">
        {/* Logo y título */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24">
              <img src="/images/logo-acantilados.webp" alt="Logo hero" className='rounded-full' />
            </div>
          </div>
          <h1 className="font-display text-4xl text-foreground mb-2">SURF RANCH</h1>
          <p className="font-body text-xl text-muted-foreground">CRM Cafetería</p>
          <div className="flex items-center justify-center space-x-2 mt-3">
            <Coffee className="w-5 h-5 text-primary" />
          </div>
        </div>

        {/* Formulario de login */}
        <Card className="card-warm p-8 border-0 shadow-2xl">
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="font-body text-2xl text-foreground">Iniciar sesión</h2>
              <p className="font-ui text-muted-foreground">Accede a tu cuenta para continuar</p>
            </div>

            {error && (
              <Alert className="bg-destructive/10 border-destructive/20 text-destructive">
                <AlertCircle className="h-4 w-4" />
                <span className="font-ui">{error}</span>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="font-ui font-medium text-foreground">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      type="email"
                      placeholder="admin@surfranch.com"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="pl-10 bg-input-background border-0 rounded-2xl font-ui h-12"
                      // disabled={loading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="font-ui font-medium text-foreground">Contraseña</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Ingresa tu contraseña"
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      className="pl-10 pr-10 bg-input-background border-0 rounded-2xl font-ui h-12"
                      // disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      // disabled={loading}
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </div>

              <Button 
                type="submit" 
                // disabled={loading}
                className="w-full button-surf text-white font-ui font-medium py-3 h-12 rounded-2xl"
              >
                Iniciar sesion
                {/* {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Iniciando sesión...
                  </>
                ) : (
                  'Iniciar sesión'
                )} */}
              </Button>
            </form>

            {/* Demo login */}
            <div className="space-y-4">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground font-ui">Demo</span>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={handleDemoLogin}
                // disabled={loading}
                className="w-full button-outline-surf font-ui font-medium py-3 h-12 rounded-2xl"
              >
                <Coffee className="w-5 h-5 mr-2" />
                Usar cuenta demo
              </Button>
            </div>

            {/* Link a registro */}
            <div className="text-center">
              <p className="font-ui text-sm text-muted-foreground">
                ¿No tienes una cuenta?{' '}
                <a 
                  href="/register" 
                  className="text-primary hover:text-primary/80 font-medium transition-colors"
                >
                  Regístrate aquí
                </a>
              </p>
            </div>
          </div>
        </Card>

        {/* Información adicional */}
        <div className="text-center mt-8 space-y-2">
          <p className="font-ui text-xs text-muted-foreground">
            Usuario demo: admin@surfranch.cl | Contraseña: admin123
          </p>
          <p className="font-ui text-xs text-muted-foreground">
            Sistema seguro con autenticación Supabase
          </p>
        </div>
      </div>

      {/* Elementos decorativos */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-primary/5 rounded-full blur-xl"></div>
      <div className="absolute bottom-10 right-10 w-32 h-32 bg-secondary/5 rounded-full blur-2xl"></div>
      <div className="absolute top-1/2 left-4 w-16 h-16 bg-accent/10 rounded-full blur-lg"></div>
    </div>
  );
}
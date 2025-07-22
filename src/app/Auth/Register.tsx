import { useState } from 'react';
import { Eye, EyeOff, Coffee, Mail, Lock, User, AlertCircle, Loader2, CheckCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert } from '@/components/ui/alert';
import { signUp } from '@/lib/auth/signUp';
import { useNavigate } from 'react-router';

export function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    nombre: '',
    apellido: '',
    role: 'empleado' as 'admin' | 'empleado' | 'supervisor'
  });
  const navigate = useNavigate();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError('');
    if (success) setSuccess('');
  };

  const validateForm = () => {
    if (!formData.email || !formData.password || !formData.nombre || !formData.apellido) {
      setError('Por favor completa todos los campos obligatorios');
      return false;
    }

    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Por favor ingresa un email válido');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateForm()) return;

    try {
    setLoading(true)
      const response = await signUp({
        email: formData.email,
        password: formData.password,
        nombre: formData.nombre,
        apellido: formData.apellido,
        role: formData.role
      });
      
      if (response.error) {
          setError(response.error);
          setLoading(false)
      } else if (response.user) {
        setSuccess('¡Cuenta creada exitosamente! Redirigiendo...');
        setTimeout(() => {
            setLoading(false)
          navigate('/dashboard')
        }, 2000);
      }
    } catch (error) {
      setError('Error de conexión. Inténtalo nuevamente.');
    }
  };

  const roles = [
    { value: 'empleado', label: 'Empleado' },
    { value: 'supervisor', label: 'Supervisor' },
    { value: 'admin', label: 'Administrador' }
  ];

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      {/* Fondo decorativo */}
      <div className="absolute inset-0 bg-gradient-to-br from-surf-light/10 to-coffee-light/20 pointer-events-none"></div>
      
      <div className="relative w-full max-w-lg">
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

        {/* Formulario de registro */}
        <Card className="card-warm p-8 border-0 shadow-2xl">
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="font-body text-2xl text-foreground">Crear cuenta</h2>
              <p className="font-ui text-muted-foreground">Registra una nueva cuenta en el sistema</p>
            </div>

            {error && (
              <Alert className="bg-destructive/10 border-destructive/20 text-destructive">
                <AlertCircle className="h-4 w-4" />
                <span className="font-ui">{error}</span>
              </Alert>
            )}

            {success && (
              <Alert className="bg-success/10 border-success/20 text-success">
                <CheckCircle className="h-4 w-4" />
                <span className="font-ui">{success}</span>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="font-ui font-medium text-foreground">Nombre *</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="Nombre"
                      value={formData.nombre}
                      onChange={(e) => handleInputChange('nombre', e.target.value)}
                      className="pl-10 bg-input-background border-0 rounded-2xl font-ui h-12"
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="font-ui font-medium text-foreground">Apellido *</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="Apellido"
                      value={formData.apellido}
                      onChange={(e) => handleInputChange('apellido', e.target.value)}
                      className="pl-10 bg-input-background border-0 rounded-2xl font-ui h-12"
                      disabled={loading}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="font-ui font-medium text-foreground">Email *</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="usuario@surfranch.cl"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="pl-10 bg-input-background border-0 rounded-2xl font-ui h-12"
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="font-ui font-medium text-foreground">Rol</label>
                <select
                  value={formData.role}
                  onChange={(e) => handleInputChange('role', e.target.value)}
                  className="w-full bg-input-background border-0 rounded-2xl px-4 py-3 font-ui h-12"
                  disabled={loading}
                >
                  {roles.map((role) => (
                    <option key={role.value} value={role.value}>
                      {role.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="font-ui font-medium text-foreground">Contraseña *</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Mínimo 6 caracteres"
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      className="pl-10 pr-10 bg-input-background border-0 rounded-2xl font-ui h-12"
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      disabled={loading}
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="font-ui font-medium text-foreground">Confirmar contraseña *</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Repetir contraseña"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      className="pl-10 pr-10 bg-input-background border-0 rounded-2xl font-ui h-12"
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      disabled={loading}
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </div>

              <Button 
                type="submit" 
                disabled={loading}
                className="w-full button-surf text-white font-ui font-medium py-3 h-12 rounded-2xl"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Creando cuenta...
                  </>
                ) : (
                  'Crear cuenta'
                )}
              </Button>
            </form>

            {/* Link a login */}
            <div className="text-center">
              <p className="font-ui text-sm text-muted-foreground">
                ¿Ya tienes una cuenta?{' '}
                <a 
                  href="/login" 
                  className="text-primary hover:text-primary/80 font-medium transition-colors"
                >
                  Inicia sesión aquí
                </a>
              </p>
            </div>
          </div>
        </Card>

        {/* Información adicional */}
        <div className="text-center mt-8 space-y-2">
          <p className="font-ui text-xs text-muted-foreground">
            Los campos marcados con * son obligatorios
          </p>
          <p className="font-ui text-xs text-muted-foreground">
            Tu cuenta será activada automáticamente tras el registro
          </p>
        </div>
      </div>

      {/* Elementos decorativos */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-primary/5 rounded-full blur-xl"></div>
      <div className="absolute bottom-10 right-10 w-32 h-32 bg-secondary/5 rounded-full blur-2xl"></div>
      <div className="absolute top-1/2 right-4 w-16 h-16 bg-accent/10 rounded-full blur-lg"></div>
    </div>
  );
}
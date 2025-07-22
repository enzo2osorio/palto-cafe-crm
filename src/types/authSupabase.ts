export interface User {
  id: string;
  email: string;
  role: 'admin' | 'empleado' | 'supervisor';
  nombre: string;
  apellido: string;
  avatar_url?: string;
  created_at: string;
  last_sign_in?: string;
}

// Tipos de autenticación
export interface AuthResponse {
  user: User | null;
  session: any;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  nombre: string;
  apellido: string;
  role?: 'admin' | 'empleado' | 'supervisor';
}
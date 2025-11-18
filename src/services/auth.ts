import { API_BASE_URL } from '../config/api';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface User {
  id: number;
  email: string;
  nombre_completo: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

class AuthService {
  private token: string | null = null;
  private user: User | null = null;

  constructor() {
    this.token = sessionStorage.getItem('token');
    const userStr = sessionStorage.getItem('user');
    if (userStr) {
      try {
        this.user = JSON.parse(userStr);
      } catch (e) {
        console.error('Error al parsear usuario:', e);
        this.logout();
      }
    }
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    console.log('🔐 Intentando login:', credentials.email);
    console.log('🌐 URL:', `${API_BASE_URL}/api/auth/login`);

    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(credentials),
    });

    console.log('📥 Response status:', response.status);

    if (!response.ok) {
      const error = await response.json().catch(() => ({ 
        error: 'Error al iniciar sesión' 
      }));
      console.error('❌ Error de login:', error);
      throw new Error(error.error || 'Error al iniciar sesión');
    }

    const data: AuthResponse = await response.json();
    console.log('✅ Login exitoso:', data.user.email);
    
    this.token = data.token;
    this.user = data.user;
    sessionStorage.setItem('token', data.token);
    sessionStorage.setItem('user', JSON.stringify(data.user));
    
    return data;
  }

  async requestPasswordRecovery(email: string): Promise<any> {
    console.log('📧 Solicitando recuperación para:', email);

    const response = await fetch(`${API_BASE_URL}/api/auth/recover-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Error al solicitar recuperación');
    }

    return response.json();
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, newPassword }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Error al resetear contraseña');
    }
  }

  async verifyToken(): Promise<boolean> {
    if (!this.token) {
      console.log('❌ No hay token para verificar');
      return false;
    }
    
    try {
      console.log('🔍 Verificando token...');
      const response = await fetch(`${API_BASE_URL}/api/auth/verify`, {
        headers: { 
          'Authorization': `Bearer ${this.token}`,
          'Accept': 'application/json'
        },
      });
      
      console.log('📥 Verificación:', response.ok ? '✅' : '❌');
      return response.ok;
    } catch (error) {
      console.error('❌ Error al verificar token:', error);
      return false;
    }
  }

  logout(): void {
    console.log('👋 Cerrando sesión');
    this.token = null;
    this.user = null;
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    window.location.href = '/#login';
  }

  isAuthenticated(): boolean {
    return this.token !== null;
  }

  getToken(): string | null {
    return this.token;
  }

  getUser(): User | null {
    return this.user;
  }
}

export const authService = new AuthService();
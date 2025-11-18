import { API_BASE_URL, getAuthHeaders } from '../config/api';

// Clase para manejar errores de la API
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Función auxiliar para manejar respuestas
async function handleResponse<T>(response: Response): Promise<T> {
  const contentType = response.headers.get('content-type');
  const isJson = contentType?.includes('application/json');
  
  let data;
  try {
    data = isJson ? await response.json() : await response.text();
  } catch (e) {
    data = null;
  }

  if (!response.ok) {
    // Si es 401, limpiar sesión y redirigir
    if (response.status === 401) {
      console.warn('🔒 Sesión expirada, redirigiendo al login...');
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('user');
      window.location.href = '/#login';
    }

    const errorMessage = data?.error || data?.message || `Error ${response.status}`;
    throw new ApiError(errorMessage, response.status, data);
  }

  return data;
}

// Servicio de API
export const apiService = {
  // GET
  async get<T = any>(endpoint: string): Promise<T> {
    console.log('📡 GET', `${API_BASE_URL}${endpoint}`);
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    
    console.log('📥 Response:', response.status, response.ok ? '✅' : '❌');
    return handleResponse<T>(response);
  },

  // POST
  async post<T = any>(endpoint: string, data?: any): Promise<T> {
    console.log('📡 POST', `${API_BASE_URL}${endpoint}`);
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    
    console.log('📥 Response:', response.status, response.ok ? '✅' : '❌');
    return handleResponse<T>(response);
  },

  // PUT
  async put<T = any>(endpoint: string, data?: any): Promise<T> {
    console.log('📡 PUT', `${API_BASE_URL}${endpoint}`);
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    
    console.log('📥 Response:', response.status, response.ok ? '✅' : '❌');
    return handleResponse<T>(response);
  },

  // DELETE
  async delete<T = any>(endpoint: string): Promise<T> {
    console.log('📡 DELETE', `${API_BASE_URL}${endpoint}`);
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    
    console.log('📥 Response:', response.status, response.ok ? '✅' : '❌');
    return handleResponse<T>(response);
  },

  // PATCH
  async patch<T = any>(endpoint: string, data?: any): Promise<T> {
    console.log('📡 PATCH', `${API_BASE_URL}${endpoint}`);
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    
    console.log('📥 Response:', response.status, response.ok ? '✅' : '❌');
    return handleResponse<T>(response);
  }
};
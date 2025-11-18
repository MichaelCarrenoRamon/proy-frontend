// Configuración de la URL base de la API
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Helper para construir URLs completas
export const getApiUrl = (endpoint: string): string => {
  // Remover slashes duplicados y normalizar
  const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const baseUrl = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
  
  const fullUrl = `${baseUrl}${normalizedEndpoint}`;
  
  // Log en desarrollo
  if (import.meta.env.DEV) {
    console.log('🔗 API URL:', fullUrl);
  }
  
  return fullUrl;
};

// Configuración de headers comunes
export const getAuthHeaders = (): HeadersInit => {
  const token = localStorage.getItem('token');
  
  if (import.meta.env.DEV) {
    console.log('🔑 Token presente:', !!token);
  }
  
  return {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

// Helper mejorado para hacer peticiones
export const apiRequest = async <T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const url = getApiUrl(endpoint);
  
  const config: RequestInit = {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...options.headers,
    },
  };

  console.log('📡 Request:', {
    method: config.method || 'GET',
    url,
    hasAuth: !!localStorage.getItem('token'),
    body: config.body ? 'presente' : 'ausente'
  });

  try {
    const response = await fetch(url, config);
    
    console.log('📥 Response:', {
      status: response.status,
      statusText: response.statusText,
      url: response.url
    });

    // Si no es 2xx, lanzar error
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ 
        error: response.statusText 
      }));
      
      console.error('❌ Error response:', errorData);
      
      // Si es 401, limpiar token y redirigir al login
      if (response.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/#login';
      }
      
      throw new Error(errorData.error || errorData.message || 'Error en la petición');
    }

    const data = await response.json();
    console.log('✅ Data received:', Array.isArray(data) ? `${data.length} items` : 'object');
    
    return data;
  } catch (error) {
    console.error('❌ Request failed:', error);
    throw error;
  }
};

// Helpers específicos para cada método HTTP
export const api = {
  get: <T = any>(endpoint: string, options?: RequestInit) =>
    apiRequest<T>(endpoint, { ...options, method: 'GET' }),
  
  post: <T = any>(endpoint: string, body?: any, options?: RequestInit) =>
    apiRequest<T>(endpoint, {
      ...options,
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    }),
  
  put: <T = any>(endpoint: string, body?: any, options?: RequestInit) =>
    apiRequest<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    }),
  
  patch: <T = any>(endpoint: string, body?: any, options?: RequestInit) =>
    apiRequest<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    }),
  
  delete: <T = any>(endpoint: string, options?: RequestInit) =>
    apiRequest<T>(endpoint, { ...options, method: 'DELETE' }),
};

// Log de configuración (solo en desarrollo)
if (import.meta.env.DEV) {
  console.log('🔧 API Configuration:', {
    baseUrl: API_BASE_URL,
    mode: import.meta.env.MODE,
    hasToken: !!localStorage.getItem('token')
  });
}

// Verificar conectividad al cargar
if (import.meta.env.DEV) {
  fetch(getApiUrl('/health'))
    .then(res => res.json())
    .then(data => console.log('✅ API Health:', data))
    .catch(err => console.error('❌ API Health failed:', err));
}
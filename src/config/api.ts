// Configuración de la URL base de la API
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Helper para construir URLs completas
export const getApiUrl = (endpoint: string): string => {
  // Asegurarse de que el endpoint comience con /
  const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${API_BASE_URL}${normalizedEndpoint}`;
};

// Configuración de headers comunes
export const getAuthHeaders = (): HeadersInit => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

// Log de configuración (solo en desarrollo)
if (import.meta.env.DEV) {
  console.log('🔧 API Configuration:', {
    baseUrl: API_BASE_URL,
    mode: import.meta.env.MODE
  });
}
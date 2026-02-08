import { getToken, removeToken } from "./auth.service";
import { API_URL as API_BASE_URL } from '../config/api.config.js';

// Función helper para hacer peticiones con token
export const fetchWithAuth = async (url, options = {}) => {
  const token = getToken();

  // No agregar Content-Type si es FormData (el browser lo hace automáticamente con boundary)
  const isFormData = options.body instanceof FormData;

  const headers = {
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${url}`, config);

    // Log detallado para errores 5xx
    if (response.status >= 500) {
      console.error(`❌ Error ${response.status} en ${url}:`, {
        status: response.status,
        statusText: response.statusText,
        url: `${API_BASE_URL}${url}`,
        method: config.method || 'GET'
      });
      
      // Intentar parsear el error del servidor
      try {
        const errorData = await response.clone().json();
        console.error('📝 Detalles del error del servidor:', errorData);
      } catch (e) {
        console.error('⚠️ No se pudo parsear el error del servidor');
      }
    }

    // Si el token es inválido o expiró, cerrar sesión
    if (response.status === 401) {
      removeToken();
      // Redirigir al login
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    return response;
  } catch (error) {
    // Manejo mejorado de errores de red
    console.error("❌ Error de red o CORS en fetchWithAuth:", {
      url: `${API_BASE_URL}${url}`,
      error: error.message,
      type: error.name,
      stack: error.stack
    });
    
    // Si es un error de CORS o red, crear una respuesta falsa para no romper el flujo
    if (error.message === 'Failed to fetch' || error.name === 'TypeError') {
      console.error('🚨 Posible problema de CORS o servidor caído');
      // Retornar un objeto que simula una Response con error
      return {
        ok: false,
        status: 503,
        statusText: 'Service Unavailable',
        json: async () => ({ 
          success: false, 
          message: 'No se pudo conectar con el servidor. Verifica tu conexión o intenta más tarde.',
          error: 'Network Error'
        }),
        text: async () => 'Network Error'
      };
    }
    
    throw error;
  }
};

// Métodos HTTP helper
export const api = {
  get: (url, options = {}) => fetchWithAuth(url, { method: "GET", ...options }),

  post: (url, data, options = {}) => {
    const body = data instanceof FormData ? data : JSON.stringify(data);
    return fetchWithAuth(url, {
      method: "POST",
      body,
      ...options,
    });
  },

  put: (url, data, options = {}) => {
    const body = data instanceof FormData ? data : JSON.stringify(data);
    return fetchWithAuth(url, {
      method: "PUT",
      body,
      ...options,
    });
  },

  delete: (url, options = {}) =>
    fetchWithAuth(url, { method: "DELETE", ...options }),
};

export default api;

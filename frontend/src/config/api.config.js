/**
 * Configuración centralizada de la API
 * 
 * En desarrollo (local): usa VITE_API_URL o http://localhost:3001/api
 * En producción: usa VITE_API_URL o rutas relativas /api
 * 
 * Variables de entorno:
 * - VITE_API_URL: URL completa de la API (ej: http://localhost:3001/api o https://api.ejemplo.com/api)
 * 
 * Si VITE_API_URL está vacía en producción, usará rutas relativas (/api)
 */

const getApiUrl = () => {
  // Si hay una variable de entorno definida, usarla
  if (import.meta.env.VITE_API_URL !== undefined && import.meta.env.VITE_API_URL !== '') {
    return import.meta.env.VITE_API_URL;
  }
  
  // En desarrollo, usar localhost por defecto
  if (import.meta.env.DEV) {
    return 'http://localhost:3001/api';
  }
  
  // En producción, usar rutas relativas
  return '/api';
};

export const API_URL = getApiUrl();

// Base URL sin /api (para uploads de imágenes, etc.)
export const BASE_URL = API_URL.replace('/api', '');

// Para debugging (solo en desarrollo)
if (import.meta.env.DEV) {
  console.log('🔧 API Configuration:', {
    API_URL,
    BASE_URL,
    VITE_API_URL: import.meta.env.VITE_API_URL,
    MODE: import.meta.env.MODE,
    DEV: import.meta.env.DEV,
    PROD: import.meta.env.PROD
  });
}

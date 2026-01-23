import { getToken, removeToken } from "./auth.service";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3001/api";

// Función helper para hacer peticiones con token
export const fetchWithAuth = async (url, options = {}) => {
  const token = getToken();

  const headers = {
    "Content-Type": "application/json",
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
    console.error("Error en fetchWithAuth:", error);
    throw error;
  }
};

// Métodos HTTP helper
export const api = {
  get: (url, options = {}) => fetchWithAuth(url, { method: "GET", ...options }),

  post: (url, data, options = {}) =>
    fetchWithAuth(url, {
      method: "POST",
      body: JSON.stringify(data),
      ...options,
    }),

  put: (url, data, options = {}) =>
    fetchWithAuth(url, {
      method: "PUT",
      body: JSON.stringify(data),
      ...options,
    }),

  delete: (url, options = {}) =>
    fetchWithAuth(url, { method: "DELETE", ...options }),
};

export default api;

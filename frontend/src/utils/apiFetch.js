/**
 * Función utilitaria para hacer llamadas fetch con configuración centralizada
 * Reemplaza axios con fetch nativo del navegador
 */

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

/**
 * Realizar una petición HTTP usando fetch con manejo de autenticación y errores
 * @param {string} endpoint - Endpoint de la API (ej: '/admin/usuarios')
 * @param {Object} options - Opciones de fetch (method, body, headers, etc.)
 * @returns {Promise<any>} - Respuesta JSON parseada
 */
export async function apiFetch(endpoint, options = {}) {
  const token = localStorage.getItem("token");
  const url = endpoint.startsWith("http") ? endpoint : `${API_URL}${endpoint}`;

  const config = {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  };

  // Si hay body y no es FormData, convertir a JSON
  if (config.body && !(config.body instanceof FormData)) {
    config.body = JSON.stringify(config.body);
  }

  try {
    const response = await fetch(url, config);

    // Manejar errores HTTP
    if (!response.ok) {
      // Intentar obtener mensaje de error del servidor
      let errorMessage = `${response.status} ${response.statusText}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch {
        // Si no es JSON, usar el texto de respuesta
        try {
          const errorText = await response.text();
          if (errorText) errorMessage = errorText;
        } catch {
          // Ignorar errores al leer el texto
        }
      }

      // Manejar códigos de estado específicos
      if (response.status === 401) {
        // Token expirado o inválido - limpiar y redirigir
        localStorage.removeItem("token");
        localStorage.removeItem("currentUser");
        window.location.href = "/login";
        throw new Error(
          "Sesión expirada. Por favor, inicia sesión nuevamente.",
        );
      }

      if (response.status === 403) {
        throw new Error("No tienes permisos para realizar esta acción.");
      }

      if (response.status === 404) {
        throw new Error("Recurso no encontrado.");
      }

      if (response.status >= 500) {
        throw new Error("Error del servidor. Por favor, intenta más tarde.");
      }

      throw new Error(errorMessage);
    }

    // Si la respuesta está vacía (204 No Content), retornar null
    if (response.status === 204) {
      return null;
    }

    // Intentar parsear como JSON
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return await response.json();
    }

    // Si no es JSON, retornar el texto
    return await response.text();
  } catch (error) {
    // Manejar errores de red
    if (error.name === "TypeError" && error.message === "Failed to fetch") {
      throw new Error(
        "Error de conexión. Verifica tu conexión a internet o que el servidor esté disponible.",
      );
    }

    // Re-lanzar el error original
    throw error;
  }
}

/**
 * GET request simplificado
 * @param {string} endpoint - Endpoint de la API
 * @param {Object} params - Query parameters opcionales
 * @returns {Promise<any>}
 */
export async function apiGet(endpoint, params = {}) {
  const queryString = new URLSearchParams(params).toString();
  const url = queryString ? `${endpoint}?${queryString}` : endpoint;
  return apiFetch(url, { method: "GET" });
}

/**
 * POST request simplificado
 * @param {string} endpoint - Endpoint de la API
 * @param {Object} body - Datos a enviar
 * @returns {Promise<any>}
 */
export async function apiPost(endpoint, body) {
  return apiFetch(endpoint, {
    method: "POST",
    body,
  });
}

/**
 * PUT request simplificado
 * @param {string} endpoint - Endpoint de la API
 * @param {Object} body - Datos a enviar
 * @returns {Promise<any>}
 */
export async function apiPut(endpoint, body) {
  return apiFetch(endpoint, {
    method: "PUT",
    body,
  });
}

/**
 * DELETE request simplificado
 * @param {string} endpoint - Endpoint de la API
 * @returns {Promise<any>}
 */
export async function apiDelete(endpoint) {
  return apiFetch(endpoint, { method: "DELETE" });
}

/**
 * PATCH request simplificado
 * @param {string} endpoint - Endpoint de la API
 * @param {Object} body - Datos a enviar
 * @returns {Promise<any>}
 */
export async function apiPatch(endpoint, body) {
  return apiFetch(endpoint, {
    method: "PATCH",
    body,
  });
}

export default apiFetch;

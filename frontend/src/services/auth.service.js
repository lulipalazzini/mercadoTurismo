import { API_URL as API_BASE_URL } from '../config/api.config.js';

const API_URL = `${API_BASE_URL}/auth`;

// Guardar token en localStorage
export const setToken = (token) => {
  localStorage.setItem("token", token);
};

// Obtener token de localStorage
export const getToken = () => {
  return localStorage.getItem("token");
};

// Eliminar token de localStorage
export const removeToken = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("currentUser");
};

// Guardar datos de usuario
export const setUser = (user) => {
  localStorage.setItem("currentUser", JSON.stringify(user));
};

// Obtener datos de usuario
export const getUser = () => {
  const user = localStorage.getItem("currentUser");
  return user ? JSON.parse(user) : null;
};

// Verificar si el usuario está autenticado
export const isAuthenticated = () => {
  return !!getToken();
};

// Registrar nuevo usuario
export const register = async (userData) => {
  try {
    console.log("📝 Intentando registrar usuario...", {
      email: userData.email,
    });

    const response = await fetch(`${API_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    console.log("📡 Respuesta recibida:", {
      status: response.status,
      contentType: response.headers.get("content-type"),
    });

    // Verificar si la respuesta es JSON
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      console.error("❌ Respuesta no es JSON:", contentType);
      const text = await response.text();
      console.error("Contenido recibido:", text.substring(0, 200));
      throw new Error("El servidor no devolvió una respuesta JSON válida.");
    }

    // Parsear JSON
    let data;
    try {
      data = await response.json();
    } catch (parseError) {
      console.error("❌ Error al parsear JSON:", parseError);
      throw new Error("Error al procesar la respuesta del servidor.");
    }

    if (!response.ok) {
      console.error("❌ Registro fallido:", data.message);
      throw new Error(data.message || "Error al registrar usuario");
    }

    // Guardar token y usuario si están presentes
    if (data.token) {
      console.log("✅ Registro exitoso, guardando datos...");
      setToken(data.token);
      setUser(data.user);
    }

    console.log("✅ Registro completado");
    return data;
  } catch (error) {
    console.error("❌ Error en register:", error);
    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw new Error(
        "No se pudo conectar con el servidor. Verifica tu conexión a internet.",
      );
    }
    throw error;
  }
};

// Iniciar sesión
export const login = async (email, password) => {
  try {
    console.log("🔑 Intentando login...", { email });

    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    console.log("📡 Respuesta recibida:", {
      status: response.status,
      statusText: response.statusText,
      contentType: response.headers.get("content-type"),
    });

    // Verificar si la respuesta es JSON
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      console.error("❌ Respuesta no es JSON:", contentType);
      // Intentar leer como texto para debug
      const text = await response.text();
      console.error("Contenido recibido:", text.substring(0, 200));
      throw new Error(
        "El servidor no devolvió una respuesta JSON válida. Puede que el servidor esté caído o mal configurado.",
      );
    }

    // Parsear JSON
    let data;
    try {
      data = await response.json();
    } catch (parseError) {
      console.error("❌ Error al parsear JSON:", parseError);
      throw new Error(
        "Error al procesar la respuesta del servidor. El servidor puede estar devolviendo HTML en lugar de JSON.",
      );
    }

    console.log("📦 Data parseada:", {
      success: data.success,
      hasToken: !!data.token,
    });

    // Verificar si hubo error
    if (!response.ok) {
      console.error("❌ Login fallido:", data.message);
      throw new Error(data.message || "Error al iniciar sesión");
    }

    // Verificar que tenemos los datos necesarios
    if (!data.token) {
      console.error("❌ Respuesta sin token");
      throw new Error("Respuesta del servidor inválida: falta token");
    }

    if (!data.user) {
      console.error("❌ Respuesta sin datos de usuario");
      throw new Error(
        "Respuesta del servidor inválida: faltan datos de usuario",
      );
    }

    // Guardar token y usuario
    console.log("✅ Login exitoso, guardando datos...");
    setToken(data.token);
    setUser(data.user);

    console.log("✅ Login completado");
    return data;
  } catch (error) {
    console.error("❌ Error en login:", error);
    // Re-lanzar el error con un mensaje claro
    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw new Error(
        "No se pudo conectar con el servidor. Verifica tu conexión a internet.",
      );
    }
    throw error;
  }
};

// Cerrar sesión
export const logout = () => {
  removeToken();
};

// Obtener perfil del usuario
export const getProfile = async () => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error("No hay token de autenticación");
    }

    const response = await fetch(`${API_URL}/profile`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Error al obtener perfil");
    }

    return data;
  } catch (error) {
    console.error("Error en getProfile:", error);
    throw error;
  }
};

// Actualizar información del usuario
export const updateUser = async (userId, userData) => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error("No hay token de autenticación");
    }

    const response = await fetch(`${API_URL}/update/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Error al actualizar usuario");
    }

    // Actualizar usuario en localStorage si no es cambio de contraseña
    if (userData.nombre || userData.email) {
      const currentUser = getUser();
      const updatedUser = { ...currentUser, ...userData };
      setUser(updatedUser);
    }

    return data;
  } catch (error) {
    console.error("Error en updateUser:", error);
    throw error;
  }
};

// Verificar contraseña de admin
export const verifyAdminPassword = async (password) => {
  try {
    const token = getToken();
    const response = await fetch(`${API_URL}/verify-admin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Error al verificar contraseña");
    }

    return data;
  } catch (error) {
    console.error("Error en verifyAdminPassword:", error);
    throw error;
  }
};

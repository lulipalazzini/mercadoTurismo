const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3001/api";
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
    const response = await fetch(`${API_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Error al registrar usuario");
    }

    // Guardar token y usuario
    if (data.token) {
      setToken(data.token);
      setUser(data.user);
    }

    return data;
  } catch (error) {
    console.error("Error en register:", error);
    throw error;
  }
};

// Iniciar sesión
export const login = async (email, password) => {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Error al iniciar sesión");
    }

    // Guardar token y usuario
    if (data.token) {
      setToken(data.token);
      setUser(data.user);
    }

    return data;
  } catch (error) {
    console.error("Error en login:", error);
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

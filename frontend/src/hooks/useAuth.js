import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

// Roles válidos en el sistema (constante fuera del componente)
const VALID_ROLES = ["admin", "sysadmin", "agencia", "operador", "user"];

// Nombres legibles de roles
const ROLE_NAMES = {
  admin: "Administrador",
  sysadmin: "Super Administrador",
  agencia: "Agencia",
  operador: "Operador",
  user: "Usuario",
};

/**
 * Hook personalizado para gestionar la autenticación y roles de usuario
 * Proporciona validación robusta de roles y manejo de sesiones
 */
export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const handleInvalidAuth = useCallback(() => {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("token");
    sessionStorage.removeItem("adminVerified");
    setUser(null);
    setLoading(false);
    navigate("/login");
  }, [navigate]);

  useEffect(() => {
    // Validar autenticación al montar el componente
    const validateAuth = () => {
      try {
        const token = localStorage.getItem("token");
        const userDataString = localStorage.getItem("currentUser");

        if (!token || !userDataString) {
          setUser(null);
          setLoading(false);
          return;
        }

        const userData = JSON.parse(userDataString);

        // Validar que el usuario tenga las propiedades requeridas
        if (!userData.id || !userData.email || !userData.role) {
          console.error("Datos de usuario incompletos:", userData);
          handleInvalidAuth();
          return;
        }

        // Validar que el rol sea válido
        if (!VALID_ROLES.includes(userData.role)) {
          console.error("Rol de usuario inválido:", userData.role);
          handleInvalidAuth();
          return;
        }

        setUser(userData);
        setLoading(false);
      } catch (error) {
        console.error("Error al validar autenticación:", error);
        handleInvalidAuth();
      }
    };

    validateAuth();
  }, [handleInvalidAuth]);

  const updateUser = (newUserData) => {
    // Validar antes de actualizar
    if (!newUserData.role || !VALID_ROLES.includes(newUserData.role)) {
      console.error(
        "Intento de actualizar con rol inválido:",
        newUserData.role,
      );
      return false;
    }

    const updatedUser = { ...user, ...newUserData };
    localStorage.setItem("currentUser", JSON.stringify(updatedUser));
    setUser(updatedUser);
    return true;
  };

  const logout = () => {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("token");
    sessionStorage.removeItem("adminVerified");
    setUser(null);
    navigate("/login");
  };

  const getRoleName = (role) => {
    return ROLE_NAMES[role] || "Usuario";
  };

  const hasRole = (requiredRoles) => {
    if (!user) return false;
    const roles = Array.isArray(requiredRoles)
      ? requiredRoles
      : [requiredRoles];
    return roles.includes(user.role);
  };

  const isAdmin = () => hasRole(["admin", "sysadmin"]);
  const isOperador = () => hasRole("operador");
  const isAgencia = () => hasRole("agencia");

  const validateAuth = useCallback(() => {
    try {
      const token = localStorage.getItem("token");
      const userDataString = localStorage.getItem("currentUser");

      if (!token || !userDataString) {
        return false;
      }

      const userData = JSON.parse(userDataString);

      // Validar que el usuario tenga las propiedades requeridas
      if (!userData.id || !userData.email || !userData.role) {
        return false;
      }

      // Validar que el rol sea válido
      if (!VALID_ROLES.includes(userData.role)) {
        return false;
      }

      return true;
    } catch {
      return false;
    }
  }, []);

  return {
    user,
    loading,
    isAuthenticated: !!user,
    updateUser,
    logout,
    getRoleName,
    hasRole,
    isAdmin,
    isOperador,
    isAgencia,
    validateAuth,
  };
}

import { useState, useEffect } from "react";
import { isAuthenticated as checkAuth } from "../services/auth.service";

/**
 * Hook que expone el estado de autenticación sincronizado con localStorage.
 * Se actualiza automáticamente cuando el login/logout ocurre en otra pestaña.
 */
export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(checkAuth());

  useEffect(() => {
    // Re-evaluar al volver a enfocar la pestaña (ej.: login en otra pestaña)
    const handleFocus = () => setIsAuthenticated(checkAuth());
    // Re-evaluar ante cambios de storage (ej.: logout en otra pestaña)
    const handleStorage = () => setIsAuthenticated(checkAuth());

    window.addEventListener("focus", handleFocus);
    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  return { isAuthenticated };
}

import { useState, useEffect, useCallback } from "react";

/**
 * Hook personalizado para persistir el estado de formularios en localStorage
 * Guarda automáticamente los cambios y los restaura al reabrir
 *
 * @param {string} formKey - Clave única para identificar el formulario
 * @param {Object} initialState - Estado inicial del formulario
 * @param {number} saveDelay - Delay en ms para guardar (debounce), default 1000ms
 * @returns {Object} - { formData, setFormData, clearFormData, hasSavedData }
 */
export function useFormPersistence(formKey, initialState, saveDelay = 1000) {
  const storageKey = `form_draft_${formKey}`;

  // Estado para saber si hay datos guardados
  const [hasSavedData, setHasSavedData] = useState(false);

  // Inicializar estado con datos guardados o estado inicial
  const [formData, setFormDataInternal] = useState(() => {
    try {
      const savedData = localStorage.getItem(storageKey);
      if (savedData) {
        const parsed = JSON.parse(savedData);
        setHasSavedData(true);
        return { ...initialState, ...parsed };
      }
    } catch (error) {
      console.error("Error al recuperar datos del formulario:", error);
    }
    return initialState;
  });

  // Función para guardar en localStorage con debounce
  useEffect(() => {
    // Crear timer para debounce
    const timer = setTimeout(() => {
      try {
        // Solo guardar si hay datos diferentes al estado inicial
        const hasChanges = Object.keys(formData).some(
          (key) =>
            JSON.stringify(formData[key]) !== JSON.stringify(initialState[key]),
        );

        if (hasChanges) {
          localStorage.setItem(storageKey, JSON.stringify(formData));
          setHasSavedData(true);
        } else {
          // Si no hay cambios, limpiar el storage
          localStorage.removeItem(storageKey);
          setHasSavedData(false);
        }
      } catch (error) {
        console.error("Error al guardar datos del formulario:", error);
      }
    }, saveDelay);

    // Cleanup
    return () => clearTimeout(timer);
  }, [formData, storageKey, initialState, saveDelay]);

  // Wrapper para setFormData que mantiene la funcionalidad
  const setFormData = useCallback((newData) => {
    if (typeof newData === "function") {
      setFormDataInternal((prevData) => {
        const updated = newData(prevData);
        return updated;
      });
    } else {
      setFormDataInternal(newData);
    }
  }, []);

  // Función para limpiar datos guardados
  const clearFormData = useCallback(() => {
    try {
      localStorage.removeItem(storageKey);
      setFormDataInternal(initialState);
      setHasSavedData(false);
    } catch (error) {
      console.error("Error al limpiar datos del formulario:", error);
    }
  }, [storageKey, initialState]);

  // Función para restaurar datos guardados explícitamente
  const restoreFormData = useCallback(() => {
    try {
      const savedData = localStorage.getItem(storageKey);
      if (savedData) {
        const parsed = JSON.parse(savedData);
        setFormDataInternal({ ...initialState, ...parsed });
        return true;
      }
    } catch (error) {
      console.error("Error al restaurar datos del formulario:", error);
    }
    return false;
  }, [storageKey, initialState]);

  return {
    formData,
    setFormData,
    clearFormData,
    restoreFormData,
    hasSavedData,
  };
}

/**
 * Hook simplificado para detectar si el usuario está a punto de salir de la página
 * con cambios sin guardar
 */
export function useUnsavedChangesWarning(hasUnsavedChanges) {
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = "";
        return "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [hasUnsavedChanges]);
}

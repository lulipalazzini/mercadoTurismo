import api from "./api.js";

/**
 * Obtiene todos los paquetes
 */
export const getPaquetes = async () => {
  try {
    const response = await api.get("/paquetes");
    if (!response.ok) throw new Error("Error al obtener paquetes");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

/**
 * Obtiene un paquete por ID
 */
export const getPaqueteById = async (id) => {
  try {
    const response = await api.get(`/paquetes/${id}`);
    if (!response.ok) throw new Error("Error al obtener el paquete");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

/**
 * Crea un nuevo paquete
 */
export const createPaquete = async (paqueteData) => {
  try {
    const response = await api.post("/paquetes", paqueteData);
    if (!response.ok) throw new Error("Error al crear el paquete");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

/**
 * Actualiza un paquete existente
 */
export const updatePaquete = async (id, paqueteData) => {
  try {
    const response = await api.put(`/paquetes/${id}`, paqueteData);
    if (!response.ok) throw new Error("Error al actualizar el paquete");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

/**
 * Elimina un paquete
 */
export const deletePaquete = async (id) => {
  try {
    const response = await api.delete(`/paquetes/${id}`);
    if (!response.ok) throw new Error("Error al eliminar el paquete");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

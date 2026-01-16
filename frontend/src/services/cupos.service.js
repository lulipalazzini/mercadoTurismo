import api from "./api.js";

/**
 * Obtiene todos los cupos del mercado
 */
export const getCupos = async () => {
  try {
    const response = await api.get("/cupos-mercado");
    if (!response.ok) throw new Error("Error al obtener cupos");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

/**
 * Obtiene un cupo del mercado por ID
 */
export const getCupoById = async (id) => {
  try {
    const response = await api.get(`/cupos-mercado/${id}`);
    if (!response.ok) throw new Error("Error al obtener el cupo");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

/**
 * Crea un nuevo cupo en el mercado
 */
export const createCupo = async (cupoData) => {
  try {
    const response = await api.post("/cupos-mercado", cupoData);
    if (!response.ok) throw new Error("Error al crear el cupo");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

/**
 * Actualiza un cupo del mercado existente
 */
export const updateCupo = async (id, cupoData) => {
  try {
    const response = await api.put(`/cupos-mercado/${id}`, cupoData);
    if (!response.ok) throw new Error("Error al actualizar el cupo");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

/**
 * Elimina un cupo del mercado
 */
export const deleteCupo = async (id) => {
  try {
    const response = await api.delete(`/cupos-mercado/${id}`);
    if (!response.ok) throw new Error("Error al eliminar el cupo");
    return true;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

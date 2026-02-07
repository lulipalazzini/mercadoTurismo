import api from "./api.js";

export const getSalidasGrupales = async () => {
  try {
    const response = await api.get("/salidas-grupales");
    if (!response.ok) throw new Error("Error al obtener salidas grupales");
    return await response.json();
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const getSalidaGrupalById = async (id) => {
  try {
    const response = await api.get(`/salidas-grupales/${id}`);
    if (!response.ok) throw new Error("Error al obtener la salida grupal");
    return await response.json();
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const createSalidaGrupal = async (data) => {
  try {
    const response = await api.post("/salidas-grupales", data);
    if (!response.ok) throw new Error("Error al crear la salida grupal");
    return await response.json();
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const updateSalidaGrupal = async (id, data) => {
  try {
    const response = await api.put(`/salidas-grupales/${id}`, data);
    if (!response.ok) throw new Error("Error al actualizar la salida grupal");
    return await response.json();
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const deleteSalidaGrupal = async (id) => {
  try {
    const response = await api.delete(`/salidas-grupales/${id}`);
    if (!response.ok) throw new Error("Error al eliminar la salida grupal");
    return await response.json();
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

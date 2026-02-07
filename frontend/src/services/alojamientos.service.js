import api from "./api.js";

export const getAlojamientos = async () => {
  try {
    const response = await api.get("/alojamientos");
    if (!response.ok) throw new Error("Error al obtener alojamientos");
    return await response.json();
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const getAlojamientoById = async (id) => {
  try {
    const response = await api.get(`/alojamientos/${id}`);
    if (!response.ok) throw new Error("Error al obtener el alojamiento");
    return await response.json();
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const createAlojamiento = async (data) => {
  try {
    const response = await api.post("/alojamientos", data);
    if (!response.ok) throw new Error("Error al crear el alojamiento");
    return await response.json();
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const updateAlojamiento = async (id, data) => {
  try {
    const response = await api.put(`/alojamientos/${id}`, data);
    if (!response.ok) throw new Error("Error al actualizar el alojamiento");
    return await response.json();
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const deleteAlojamiento = async (id) => {
  try {
    const response = await api.delete(`/alojamientos/${id}`);
    if (!response.ok) throw new Error("Error al eliminar el alojamiento");
    return await response.json();
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

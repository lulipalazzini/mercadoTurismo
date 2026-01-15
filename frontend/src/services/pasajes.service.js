import api from "./api.js";

export const getPasajes = async () => {
  try {
    const response = await api.get("/pasajes");
    if (!response.ok) throw new Error("Error al obtener pasajes");
    return await response.json();
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const getPasajeById = async (id) => {
  try {
    const response = await api.get(`/pasajes/${id}`);
    if (!response.ok) throw new Error("Error al obtener el pasaje");
    return await response.json();
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const createPasaje = async (data) => {
  try {
    const response = await api.post("/pasajes", data);
    if (!response.ok) throw new Error("Error al crear el pasaje");
    return await response.json();
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const updatePasaje = async (id, data) => {
  try {
    const response = await api.put(`/pasajes/${id}`, data);
    if (!response.ok) throw new Error("Error al actualizar el pasaje");
    return await response.json();
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const deletePasaje = async (id) => {
  try {
    const response = await api.delete(`/pasajes/${id}`);
    if (!response.ok) throw new Error("Error al eliminar el pasaje");
    return await response.json();
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

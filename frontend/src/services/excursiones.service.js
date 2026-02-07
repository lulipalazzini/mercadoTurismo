import api from "./api.js";

export const getExcursiones = async () => {
  try {
    const response = await api.get("/excursiones");
    if (!response.ok) throw new Error("Error al obtener excursiones");
    return await response.json();
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const getExcursionById = async (id) => {
  try {
    const response = await api.get(`/excursiones/${id}`);
    if (!response.ok) throw new Error("Error al obtener la excursión");
    return await response.json();
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const createExcursion = async (data) => {
  try {
    const response = await api.post("/excursiones", data);
    if (!response.ok) throw new Error("Error al crear la excursión");
    return await response.json();
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const updateExcursion = async (id, data) => {
  try {
    const response = await api.put(`/excursiones/${id}`, data);
    if (!response.ok) throw new Error("Error al actualizar la excursión");
    return await response.json();
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const deleteExcursion = async (id) => {
  try {
    const response = await api.delete(`/excursiones/${id}`);
    if (!response.ok) throw new Error("Error al eliminar la excursión");
    return await response.json();
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

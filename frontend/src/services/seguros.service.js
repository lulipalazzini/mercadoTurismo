import api from "./api.js";

export const getSeguros = async () => {
  try {
    const response = await api.get("/seguros");
    if (!response.ok) throw new Error("Error al obtener seguros");
    return await response.json();
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const getSeguroById = async (id) => {
  try {
    const response = await api.get(`/seguros/${id}`);
    if (!response.ok) throw new Error("Error al obtener el seguro");
    return await response.json();
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const createSeguro = async (data) => {
  try {
    const response = await api.post("/seguros", data);
    if (!response.ok) throw new Error("Error al crear el seguro");
    return await response.json();
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const updateSeguro = async (id, data) => {
  try {
    const response = await api.put(`/seguros/${id}`, data);
    if (!response.ok) throw new Error("Error al actualizar el seguro");
    return await response.json();
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const deleteSeguro = async (id) => {
  try {
    const response = await api.delete(`/seguros/${id}`);
    if (!response.ok) throw new Error("Error al eliminar el seguro");
    return await response.json();
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

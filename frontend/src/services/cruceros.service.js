import api from "./api.js";

export const getCruceros = async () => {
  try {
    const response = await api.get("/cruceros");
    if (!response.ok) throw new Error("Error al obtener cruceros");
    return await response.json();
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const getCruceroById = async (id) => {
  try {
    const response = await api.get(`/cruceros/${id}`);
    if (!response.ok) throw new Error("Error al obtener el crucero");
    return await response.json();
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const createCrucero = async (data) => {
  try {
    const response = await api.post("/cruceros", data);
    if (!response.ok) throw new Error("Error al crear el crucero");
    return await response.json();
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const updateCrucero = async (id, data) => {
  try {
    const response = await api.put(`/cruceros/${id}`, data);
    if (!response.ok) throw new Error("Error al actualizar el crucero");
    return await response.json();
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const deleteCrucero = async (id) => {
  try {
    const response = await api.delete(`/cruceros/${id}`);
    if (!response.ok) throw new Error("Error al eliminar el crucero");
    return await response.json();
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

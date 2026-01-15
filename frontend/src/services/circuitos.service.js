import api from "./api.js";

export const getCircuitos = async () => {
  try {
    const response = await api.get("/circuitos");
    if (!response.ok) throw new Error("Error al obtener circuitos");
    return await response.json();
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const getCircuitoById = async (id) => {
  try {
    const response = await api.get(`/circuitos/${id}`);
    if (!response.ok) throw new Error("Error al obtener el circuito");
    return await response.json();
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const createCircuito = async (data) => {
  try {
    const response = await api.post("/circuitos", data);
    if (!response.ok) throw new Error("Error al crear el circuito");
    return await response.json();
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const updateCircuito = async (id, data) => {
  try {
    const response = await api.put(`/circuitos/${id}`, data);
    if (!response.ok) throw new Error("Error al actualizar el circuito");
    return await response.json();
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const deleteCircuito = async (id) => {
  try {
    const response = await api.delete(`/circuitos/${id}`);
    if (!response.ok) throw new Error("Error al eliminar el circuito");
    return await response.json();
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

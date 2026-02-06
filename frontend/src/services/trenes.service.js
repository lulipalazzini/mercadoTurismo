import api from "./api.js";

export const getTrenes = async () => {
  try {
    const response = await api.get("/trenes");
    if (!response.ok) throw new Error("Error al obtener trenes");
    return await response.json();
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const getTrenById = async (id) => {
  try {
    const response = await api.get(`/trenes/${id}`);
    if (!response.ok) throw new Error("Error al obtener el tren");
    return await response.json();
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const createTren = async (data) => {
  try {
    const response = await api.post("/trenes", data);
    if (!response.ok) throw new Error("Error al crear el tren");
    return await response.json();
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const updateTren = async (id, data) => {
  try {
    const response = await api.put(`/trenes/${id}`, data);
    if (!response.ok) throw new Error("Error al actualizar el tren");
    return await response.json();
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const deleteTren = async (id) => {
  try {
    const response = await api.delete(`/trenes/${id}`);
    if (!response.ok) throw new Error("Error al eliminar el tren");
    return await response.json();
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

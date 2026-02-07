import api from "./api.js";

export const getAutos = async () => {
  try {
    const response = await api.get("/autos");
    if (!response.ok) throw new Error("Error al obtener autos");
    return await response.json();
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const getAutoById = async (id) => {
  try {
    const response = await api.get(`/autos/${id}`);
    if (!response.ok) throw new Error("Error al obtener el auto");
    return await response.json();
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const createAuto = async (data) => {
  try {
    const response = await api.post("/autos", data);
    if (!response.ok) throw new Error("Error al crear el auto");
    return await response.json();
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const updateAuto = async (id, data) => {
  try {
    const response = await api.put(`/autos/${id}`, data);
    if (!response.ok) throw new Error("Error al actualizar el auto");
    return await response.json();
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const deleteAuto = async (id) => {
  try {
    const response = await api.delete(`/autos/${id}`);
    if (!response.ok) throw new Error("Error al eliminar el auto");
    return await response.json();
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

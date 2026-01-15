import api from "./api.js";

export const getTransfers = async () => {
  try {
    const response = await api.get("/transfers");
    if (!response.ok) throw new Error("Error al obtener transfers");
    return await response.json();
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const getTransferById = async (id) => {
  try {
    const response = await api.get(`/transfers/${id}`);
    if (!response.ok) throw new Error("Error al obtener el transfer");
    return await response.json();
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const createTransfer = async (data) => {
  try {
    const response = await api.post("/transfers", data);
    if (!response.ok) throw new Error("Error al crear el transfer");
    return await response.json();
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const updateTransfer = async (id, data) => {
  try {
    const response = await api.put(`/transfers/${id}`, data);
    if (!response.ok) throw new Error("Error al actualizar el transfer");
    return await response.json();
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const deleteTransfer = async (id) => {
  try {
    const response = await api.delete(`/transfers/${id}`);
    if (!response.ok) throw new Error("Error al eliminar el transfer");
    return await response.json();
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

import api from "./api";

const USERS_URL = "/users";

export const getUsers = async () => {
  try {
    const response = await api.get(USERS_URL);
    const data = await response.json();
    console.log("Usuarios obtenidos:", data);
    return data;
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    throw error;
  }
};

export const getUserById = async (id) => {
  const response = await api.get(`${USERS_URL}/${id}`);
  return await response.json();
};

export const createUser = async (userData) => {
  const response = await api.post(USERS_URL, userData);
  return await response.json();
};

export const updateUserById = async (id, userData) => {
  const response = await api.put(`${USERS_URL}/${id}`, userData);
  return await response.json();
};

export const deleteUser = async (id) => {
  const response = await api.delete(`${USERS_URL}/${id}`);
  return await response.json();
};

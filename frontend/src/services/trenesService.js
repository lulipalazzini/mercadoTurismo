import api from "./api";

const trenesService = {
  // Obtener todos los trenes con filtros
  getTrenes: async (filters = {}) => {
    const params = new URLSearchParams();

    if (filters.tipo) params.append("tipo", filters.tipo);
    if (filters.clase) params.append("clase", filters.clase);
    if (filters.origen) params.append("origen", filters.origen);
    if (filters.destino) params.append("destino", filters.destino);
    if (filters.empresa) params.append("empresa", filters.empresa);
    if (filters.moneda) params.append("moneda", filters.moneda);
    if (filters.precioMin) params.append("precioMin", filters.precioMin);
    if (filters.precioMax) params.append("precioMax", filters.precioMax);

    const queryString = params.toString();
    const url = `/trenes${queryString ? `?${queryString}` : ""}`;

    const response = await api.get(url);
    return response.data;
  },

  // Obtener un tren por ID
  getTren: async (id) => {
    const response = await api.get(`/trenes/${id}`);
    return response.data;
  },

  // Crear un nuevo tren
  createTren: async (trenData) => {
    const response = await api.post("/trenes", trenData);
    return response.data;
  },

  // Actualizar un tren
  updateTren: async (id, trenData) => {
    const response = await api.put(`/trenes/${id}`, trenData);
    return response.data;
  },

  // Eliminar un tren
  deleteTren: async (id) => {
    const response = await api.delete(`/trenes/${id}`);
    return response.data;
  },
};

export default trenesService;

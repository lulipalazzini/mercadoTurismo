import api from "./api";

export const getTopServices = async (limit = 5) => {
  try {
    const response = await api.get("/stats");

    // Parsear la respuesta JSON
    const data = await response.json();

    // Validar que la respuesta tenga la estructura esperada
    if (!data || !data.statsByCategory) {
      console.warn("Stats response has unexpected structure:", data);
      return [];
    }

    const { statsByCategory } = data;

    // Recopilar todos los servicios de todas las categorías
    const allServices = [];

    Object.entries(statsByCategory).forEach(([category, services]) => {
      if (Array.isArray(services)) {
        services.forEach((service) => {
          allServices.push({
            ...service,
            category,
          });
        });
      }
    });

    // Ordenar por clicks y tomar los top N
    const topServices = allServices
      .sort((a, b) => b.clicks - a.clicks)
      .slice(0, limit);

    return topServices;
  } catch (error) {
    console.error("Error fetching top services:", error);
    return [];
  }
};

export const getAllStats = async () => {
  try {
    const response = await api.get("/stats");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching stats:", error);
    throw error;
  }
};

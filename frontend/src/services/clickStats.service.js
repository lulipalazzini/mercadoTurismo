import api from "./api.js";

/**
 * Trackea un click en una card específica
 * @param {string} cardType - Tipo de card (alojamiento, auto, paquete, etc.)
 * @param {number} [serviceId] - ID del servicio específico (opcional)
 * @param {string} [serviceName] - Nombre del servicio específico (opcional)
 * @returns {Promise<Object|null>} - Datos de la respuesta o null si falla
 */
export const trackCardClick = async (
  cardType,
  serviceId = null,
  serviceName = null,
) => {
  try {
    const payload = { cardType };

    // Agregar serviceId y serviceName si están disponibles
    if (serviceId) {
      payload.serviceId = serviceId;
    }
    if (serviceName) {
      payload.serviceName = serviceName;
    }

    const response = await api.post("/stats/increment", payload, {
      headers: {
        "x-sec-origin": "mercado-turismo-app",
      },
    });

    if (!response.ok) {
      console.warn(`No se pudo trackear el click en ${cardType}`);
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error tracking click:", error);
    return null;
  }
};

/**
 * Obtiene todas las estadísticas de clicks
 * @returns {Promise<Object|null>} - Estadísticas completas o null si falla
 */
export const getClickStats = async () => {
  try {
    const response = await api.get("/stats");

    if (!response.ok) {
      console.warn("No se pudieron obtener las estadísticas");
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error obteniendo stats:", error);
    return null;
  }
};

/**
 * Obtiene las estadísticas de un tipo específico de card
 * @param {string} cardType - Tipo de card
 * @returns {Promise<Object|null>} - Estadísticas del tipo o null si falla
 */
export const getStatByType = async (cardType) => {
  try {
    const response = await api.get(`/stats/${cardType}`);

    if (!response.ok) {
      console.warn(`No se pudieron obtener las estadísticas de ${cardType}`);
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error obteniendo stats de ${cardType}:`, error);
    return null;
  }
};

// Tipos de cards válidos
export const VALID_CARD_TYPES = [
  "alojamiento",
  "auto",
  "circuito",
  "crucero",
  "excursion",
  "paquete",
  "pasaje",
  "salidaGrupal",
  "seguro",
  "transfer",
];

/**
 * EJEMPLO DE USO DEL SISTEMA DE CONTADOR DE CLICKS
 *
 * Este archivo muestra cómo integrar el tracking de clicks en tus componentes de cards
 */

// 1. Crear el servicio para comunicarse con la API
// Archivo: frontend/src/services/clickStats.service.js

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

export const trackCardClick = async (cardType) => {
  try {
    const response = await fetch(`${API_URL}/stats/increment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-sec-origin": "mercado-turismo-app", // Header de seguridad
      },
      body: JSON.stringify({ cardType }),
    });

    if (!response.ok) {
      console.warn("No se pudo trackear el click");
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error tracking click:", error);
    return null;
  }
};

export const getClickStats = async () => {
  try {
    const response = await fetch(`${API_URL}/stats`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error obteniendo stats:", error);
    return null;
  }
};

// 2. Ejemplo de integración en PaqueteCard.jsx
/*
import { trackCardClick } from "../services/clickStats.service";

export default function PaqueteCard({ item }) {
  const handleCardClick = async () => {
    // Trackear el click (no bloqueante, se ejecuta en segundo plano)
    trackCardClick("paquete").catch(console.error);
    
    // Continuar con la navegación o acción normal
    // Por ejemplo: navigate(`/paquetes/${item.id}`)
  };

  return (
    <div className="service-card" onClick={handleCardClick}>
      // ... resto del componente
    </div>
  );
}
*/

// 3. Tipos de cards válidos:
const VALID_CARD_TYPES = [
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

// 4. Ejemplo de componente para visualizar estadísticas (Dashboard Admin)
/*
import { useEffect, useState } from "react";
import { getClickStats } from "../services/clickStats.service";

export default function ClickStatsPanel() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    const data = await getClickStats();
    setStats(data);
  };

  if (!stats) return <div>Cargando estadísticas...</div>;

  return (
    <div className="stats-panel">
      <h2>Estadísticas de Clicks</h2>
      <p>Total de clicks: {stats.totalClicks}</p>
      
      <ul>
        {stats.stats.map((stat) => (
          <li key={stat.cardType}>
            <strong>{stat.cardType}:</strong> {stat.clicks} clicks
          </li>
        ))}
      </ul>
    </div>
  );
}
*/

// 5. ENDPOINTS DISPONIBLES:

// POST /api/stats/increment
// Body: { "cardType": "paquete" }
// Headers: { "x-sec-origin": "mercado-turismo-app" }
// Protección: Rate limit de 10 clics cada 10 minutos por IP

// GET /api/stats
// Retorna todas las estadísticas ordenadas por cantidad de clicks

// GET /api/stats/:cardType
// Ejemplo: /api/stats/paquete
// Retorna las estadísticas de un tipo específico de card

export default {
  trackCardClick,
  getClickStats,
  VALID_CARD_TYPES,
};

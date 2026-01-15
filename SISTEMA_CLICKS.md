# 📊 Sistema de Contador de Clicks - Mercado Turismo

## ✅ Implementación Completada

Se ha integrado correctamente un sistema de tracking de clicks para analizar qué tipos de cards reciben más interacción de los usuarios.

## 🏗️ Arquitectura Implementada

### Backend

#### 1. **Modelo de Datos** ([ClickStats.model.js](backend/src/models/ClickStats.model.js))
- Tabla `click_stats` con Sequelize
- Campos: `id`, `cardType`, `clicks`, `createdAt`, `updatedAt`
- 10 tipos de cards: alojamiento, auto, circuito, crucero, excursion, paquete, pasaje, salidaGrupal, seguro, transfer

#### 2. **Controlador** ([clickStats.controller.js](backend/src/controllers/clickStats.controller.js))
- `incrementClickCount`: Incrementa contador de un tipo de card
- `getAllStats`: Obtiene todas las estadísticas ordenadas por clicks
- `getStatByType`: Obtiene estadísticas de un tipo específico

#### 3. **Rutas** ([clickStats.routes.js](backend/src/routes/clickStats.routes.js))
- `POST /api/stats/increment` - Incrementar contador (rate limited)
- `GET /api/stats` - Ver todas las estadísticas
- `GET /api/stats/:cardType` - Ver estadísticas por tipo

#### 4. **Seeder** ([clickStats.seeder.js](backend/src/seeders/clickStats.seeder.js))
- Inicializa automáticamente todos los tipos de cards con clicks en 0

## 🔒 Seguridad Implementada

### 1. **Helmet**
- Protección de headers HTTP
- Previene ataques XSS, clickjacking, MIME sniffing

### 2. **Rate Limiting**
- **Global**: 100 peticiones por IP cada 15 minutos
- **Clicks**: 10 clicks por IP cada 10 minutos
- Previene ataques de DDoS y spam

### 3. **Header Personalizado**
- `x-sec-origin: mercado-turismo-app`
- Valida que las peticiones vengan de tu frontend
- Frena bots simples

## 📡 Endpoints API

### POST /api/stats/increment
Incrementa el contador de clicks para un tipo de card.

**Request:**
```json
{
  "cardType": "paquete"
}
```

**Headers requeridos:**
```
Content-Type: application/json
x-sec-origin: mercado-turismo-app
```

**Response exitoso:**
```json
{
  "success": true,
  "cardType": "paquete",
  "count": 42
}
```

**Validaciones:**
- Header `x-sec-origin` debe ser correcto
- `cardType` debe ser válido
- Rate limit: máximo 10 clics cada 10 minutos por IP

---

### GET /api/stats
Obtiene todas las estadísticas ordenadas por cantidad de clicks.

**Response:**
```json
{
  "success": true,
  "totalClicks": 1523,
  "stats": [
    {
      "id": 1,
      "cardType": "paquete",
      "clicks": 450,
      "createdAt": "2026-01-15T10:00:00.000Z",
      "updatedAt": "2026-01-15T15:30:00.000Z"
    },
    {
      "id": 2,
      "cardType": "alojamiento",
      "clicks": 320,
      "createdAt": "2026-01-15T10:00:00.000Z",
      "updatedAt": "2026-01-15T14:20:00.000Z"
    }
    // ... más stats
  ]
}
```

---

### GET /api/stats/:cardType
Obtiene estadísticas de un tipo específico de card.

**Ejemplo:** `GET /api/stats/paquete`

**Response:**
```json
{
  "success": true,
  "cardType": "paquete",
  "count": 450
}
```

## 🎨 Integración Frontend

### 1. Crear el servicio (recomendado)

Crea `frontend/src/services/clickStats.service.js`:

```javascript
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

export const trackCardClick = async (cardType) => {
  try {
    const response = await fetch(`${API_URL}/stats/increment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-sec-origin": "mercado-turismo-app",
      },
      body: JSON.stringify({ cardType }),
    });

    if (!response.ok) {
      console.warn("No se pudo trackear el click");
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("Error tracking click:", error);
    return null;
  }
};

export const getClickStats = async () => {
  try {
    const response = await fetch(`${API_URL}/stats`);
    return await response.json();
  } catch (error) {
    console.error("Error obteniendo stats:", error);
    return null;
  }
};
```

### 2. Integrar en tus Cards

Ejemplo para `PaqueteCard.jsx`:

```jsx
import { trackCardClick } from "../services/clickStats.service";

export default function PaqueteCard({ item }) {
  const handleCardClick = async () => {
    // Trackear el click (no bloquea la UI)
    trackCardClick("paquete").catch(console.error);
    
    // Continuar con tu lógica normal
    // navigate(`/paquetes/${item.id}`);
  };

  return (
    <div className="service-card" onClick={handleCardClick}>
      {/* ... resto del componente */}
    </div>
  );
}
```

### 3. Panel de Estadísticas (Opcional)

Para ver las estadísticas en un dashboard admin:

```jsx
import { useEffect, useState } from "react";
import { getClickStats } from "../services/clickStats.service";

export default function ClickStatsPanel() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    const data = await getClickStats();
    setStats(data);
    setLoading(false);
  };

  if (loading) return <div>Cargando estadísticas...</div>;

  return (
    <div className="stats-panel">
      <h2>📊 Estadísticas de Clicks</h2>
      <p className="total-clicks">
        Total de clicks: <strong>{stats.totalClicks.toLocaleString()}</strong>
      </p>
      
      <div className="stats-list">
        {stats.stats.map((stat) => (
          <div key={stat.cardType} className="stat-item">
            <span className="card-type">{stat.cardType}</span>
            <span className="click-count">{stat.clicks}</span>
            <div 
              className="progress-bar"
              style={{ 
                width: `${(stat.clicks / stats.totalClicks) * 100}%` 
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
```

## 📋 Tipos de Cards Válidos

```javascript
const VALID_CARD_TYPES = [
  "alojamiento",    // AlojamientoCard
  "auto",           // AutoCard
  "circuito",       // CircuitoCard
  "crucero",        // CruceroCard
  "excursion",      // ExcursionCard
  "paquete",        // PaqueteCard
  "pasaje",         // PasajeCard
  "salidaGrupal",   // SalidaGrupalCard
  "seguro",         // SeguroCard
  "transfer"        // TransferCard
];
```

## 🚀 Cómo Usar

### 1. El servidor ya está corriendo con las rutas configuradas

### 2. Inicializar la tabla de estadísticas:
```bash
cd backend
npm run seed
```

### 3. Integrar tracking en tus cards del frontend:
- Crea el servicio `clickStats.service.js`
- Importa y usa `trackCardClick()` en cada componente de card
- El tracking se hace en segundo plano, no afecta la UX

### 4. (Opcional) Crear panel de admin para visualizar stats
- Usa `getClickStats()` para obtener los datos
- Muestra en un dashboard con gráficos

## 🎯 Ventajas de esta Implementación

✅ **No usa SQLite adicional** - Integrado con tu base de datos Sequelize existente  
✅ **Seguro** - Headers personalizados + Rate limiting + Helmet  
✅ **Modular** - Sigue tu estructura de proyecto (MVC)  
✅ **No invasivo** - El tracking no bloquea la experiencia del usuario  
✅ **Escalable** - Fácil de extender para más tipos de cards  
✅ **Analytics real** - Datos persistentes en tu base de datos  

## 🔍 Monitoreo

Para ver las estadísticas actuales desde el backend:

```bash
# Consultar la base de datos directamente
sqlite3 backend/database.sqlite "SELECT * FROM click_stats ORDER BY clicks DESC;"
```

O usar la API:
```bash
curl http://localhost:3001/api/stats
```

## 📝 Notas Importantes

1. **Header de seguridad**: Asegúrate de incluir `x-sec-origin: mercado-turismo-app` en todas las peticiones POST
2. **Rate limiting**: Los usuarios están limitados a 10 clicks cada 10 minutos
3. **No bloqueante**: El tracking se ejecuta de forma asíncrona para no afectar la UX
4. **Tipos válidos**: Solo los 10 tipos predefinidos son aceptados

---

**Implementado por:** GitHub Copilot  
**Fecha:** 15 de Enero, 2026  
**Estado:** ✅ Completo y funcionando

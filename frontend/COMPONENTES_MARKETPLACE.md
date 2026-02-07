# Componentes Marketplace - Mercado Turismo

Esta documentación describe los nuevos componentes creados para **Mercado Turismo**, enfocados en transmitir claramente que es un **comparador de agencias** y no una venta directa.

## 🎯 Objetivo

Que el usuario entienda en **3 segundos** que Mercado Turismo es un marketplace que conecta pasajeros con múltiples agencias de viaje.

---

## 📦 Componentes Principales

### 1. HeroMarketplace.jsx

**Ubicación:** `/src/components/HeroMarketplace.jsx`

Hero principal optimizado para transmitir el valor de marketplace.

#### Características:

- ✅ **Título claro** con énfasis en "Agencias de Viajes"
- ✅ **Subtítulo** que refuerza el concepto: "Un solo lugar, múltiples agencias. Vos elegís."
- ✅ **Disclaimer badge** visible above the fold: "Mercado Turismo no vende viajes, conecta pasajeros con agencias"
- ✅ **Buscador profesional** con:
  - Campo de Origen (select)
  - Campo de Destino (select)
  - Presupuesto Máximo con selector de moneda (ARS/USD)
  - CTA prominente: "Comparar Agencias"
- ✅ **Stats visuales** (50+ Agencias, 200+ Destinos, etc.)
- ✅ **Responsive** y optimizado para móviles

#### Uso:

```jsx
import HeroMarketplace from "./components/HeroMarketplace";

function App() {
  return <HeroMarketplace />;
}
```

---

### 2. FeaturedCarousel.jsx

**Ubicación:** `/src/components/FeaturedCarousel.jsx`

Carrusel de ofertas destacadas con rotación automática.

#### Características:

- ✅ **4 cards visibles simultáneamente** en desktop
- ✅ **8 ofertas totales** que rotan progresivamente
- ✅ **Rotación automática cada 2 segundos** (se pausa al hacer hover)
- ✅ **Diseño de card premium**:
  - Imagen de fondo del destino
  - Logo de la agencia prominente en esquina superior
  - Precio destacado en badge
  - Información del destino
  - Overlay con CTA al hacer hover
- ✅ **Indicadores de progreso** con dots
- ✅ **Controles manuales** (flechas)
- ✅ **CTA final** "Ver todas las ofertas"
- ✅ **Responsive**: 1 card en móvil, 2 en tablet, 4 en desktop

#### Uso:

```jsx
import FeaturedCarousel from "./components/FeaturedCarousel";

function App() {
  return <FeaturedCarousel />;
}
```

#### Customización de datos:

Los datos actualmente usan un mock (`MOCK_FEATURED_SERVICES`). Para conectar con el API real:

1. Importar el servicio de stats:
```jsx
import { getTopServices } from "../services/stats.service";
```

2. Reemplazar el mock con datos reales en el useEffect
3. Adaptar el formato de datos según necesidad

---

### 3. DynamicSearchBox.jsx

**Ubicación:** `/src/components/DynamicSearchBox.jsx`

Buscador inteligente que cambia sus campos según el tipo de servicio seleccionado.

#### Características:

- ✅ **6 tipos de servicio**: Paquetes, Alojamiento, Vuelos, Autos, Transfers, Excursiones
- ✅ **Campos dinámicos** según el servicio:
  - **Paquetes**: Origen, Destino, Presupuesto
  - **Alojamiento**: Destino, Check-in, Check-out, Huéspedes
  - **Autos**: Lugar de retiro, Fecha retiro, Fecha devolución
  - **Vuelos**: Origen, Destino, Fecha ida, Pasajeros
- ✅ **Iconos personalizados** por tipo de servicio
- ✅ **Navegación a páginas de resultados** con parámetros

#### Uso:

```jsx
import DynamicSearchBox from "./components/DynamicSearchBox";

function SearchPage() {
  return (
    <div>
      <h2>Buscá tu próximo viaje</h2>
      <DynamicSearchBox />
    </div>
  );
}
```

---

### 4. HomeMarketplace.jsx

**Ubicación:** `/src/components/HomeMarketplace.jsx`

Página home completa que integra Hero y Carrusel.

#### Estructura:

```jsx
<main>
  <HeroMarketplace />      {/* Above the fold */}
  <FeaturedCarousel />     {/* Visible sin scroll */}
  {/* Espacio para más secciones */}
</main>
```

---

## 🎨 Estilos y Tailwind

### Configuración de Tailwind

**Archivo:** `/tailwind.config.js`

Se agregó Tailwind CSS con la paleta de colores corporativa de Mercado Turismo:

```js
colors: {
  primary: {
    DEFAULT: '#2464eb',
    dark: '#1a4bb8',
    light: '#4885f5',
  },
  'blue-light': '#dbeafe',
  green: {
    DEFAULT: '#069669',
    light: '#d5e9e2',
  },
  // ... más colores
}
```

### Animaciones personalizadas:

- `animate-fade-in`: Transición suave de opacidad
- `animate-slide-left`: Entrada desde la derecha

---

## 🚀 Implementación

### Archivos modificados:

1. ✅ `/src/App.jsx` - Agregado `HomeMarketplace` como ruta principal
2. ✅ `/src/index.css` - Agregadas directivas de Tailwind
3. ✅ `/tailwind.config.js` - Configuración creada
4. ✅ `/postcss.config.js` - Configuración creada

### Pasos para activar:

Los componentes ya están integrados en la aplicación. La ruta raíz (`/`) ahora usa `HomeMarketplace`.

Si deseas volver al hero anterior temporalmente:
- Ve a `/home-old` (se mantiene el componente antiguo como backup)

---

## 📱 Responsive

Todos los componentes son completamente responsive:

- **Móvil** (< 640px): 1 columna, buscador vertical
- **Tablet** (640px - 1024px): 2 columnas en carrusel
- **Desktop** (> 1024px): 4 columnas en carrusel, diseño completo

---

## 🎯 Mejores Prácticas

### Hero:
- El disclaimer debe ser siempre visible above the fold
- Mantener énfasis visual en "Agencias"
- CTA debe decir "Comparar Agencias" (no "Buscar" o "Reservar")

### Carrusel:
- Logo de agencia debe ser prominente y legible
- No usar nombre de agencia en texto (solo logo)
- Precio debe estar siempre visible
- Rotación automática mejora engagement (pero pausar al hover)

### Buscador:
- Para marketplace, el CTA debe ser "Comparar" no "Buscar"
- Presupuesto máximo es opcional pero recomendado
- Selector de moneda es crítico para Argentina (ARS/USD)

---

## 🔧 Próximos Pasos (Opcionales)

1. **Conectar con API real**: Reemplazar mock data en FeaturedCarousel
2. **Agregar filtros avanzados**: Fechas, categorías, etc.
3. **Métricas**: Integrar analytics para trackear conversiones
4. **A/B Testing**: Probar diferentes copys del disclaimer
5. **Lazy loading**: Optimizar imágenes del carrusel

---

## 📞 Soporte

Para dudas sobre estos componentes, revisar:
- Código fuente con comentarios detallados
- Tailwind docs: https://tailwindcss.com/docs
- React Router: https://reactrouter.com/

---

## 🎨 Paleta de Colores

```
Primary Blue:    #2464eb
Primary Dark:    #1a4bb8
Primary Light:   #4885f5
Green:           #069669
Orange:          #ea580b
```

---

**Creado por:** Senior Frontend Developer  
**Fecha:** Febrero 2026  
**Framework:** React 19 + Tailwind CSS + Vite

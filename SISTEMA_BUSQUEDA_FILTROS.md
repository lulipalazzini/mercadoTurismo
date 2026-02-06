# Sistema Unificado de Búsqueda y Filtros - Mercado Turismo

## 📋 Resumen

Sistema completo de búsqueda y filtrado para la plataforma Mercado Turismo que unifica la experiencia del usuario desde el Hero (página principal) hasta cada módulo específico (Paquetes, Alojamientos, Cruceros, Autos, Excursiones).

---

## 🎯 Objetivos Logrados

✅ **Búsqueda dinámica en Hero** - El usuario puede elegir qué tipo de servicio buscar y el formulario se adapta automáticamente  
✅ **Filtros específicos por módulo** - Cada módulo tiene filtros basados en sus datos reales de base de datos  
✅ **Navegación fluida con estado** - Los filtros se pasan via URL params entre Hero y módulos  
✅ **Sincronización bidireccional** - Los filtros funcionan desde el Hero o desde dentro del módulo  
✅ **UX consistente** - Diseño unificado con feedback visual claro

---

## 🔄 Flujo del Sistema

### 1️⃣ Búsqueda desde Hero (Página Principal)

```
Usuario en Home (/)
    ↓
Selecciona tipo de servicio (Paquetes, Alojamientos, etc.)
    ↓
Formulario se adapta dinámicamente
    ↓
Usuario llena los campos relevantes
    ↓
Click en "Buscar [Servicio]"
    ↓
Navegación a módulo con query params: /paquetes?destino=Paris&duracion=7&precioMax=5000
    ↓
Módulo recibe filtros y aplica automáticamente
```

### 2️⃣ Filtros Locales en Módulo

```
Usuario en módulo específico (/paquetes, /cruceros, etc.)
    ↓
Click en botón "Filtros"
    ↓
Panel de filtros se expande
    ↓
Usuario ajusta filtros (destino, fechas, precio, etc.)
    ↓
Filtros se aplican en tiempo real
    ↓
URL se actualiza con nuevos params
    ↓
Resultados filtrados se muestran instantáneamente
```

---

## 🏗️ Arquitectura de Componentes

### **UnifiedHeroSearch** (`frontend/src/components/UnifiedHeroSearch.jsx`)

**Propósito**: Buscador principal en el Hero con selección de tipo de servicio

**Características**:

- Selector de tipo de servicio (Paquetes, Alojamientos, Cruceros, Autos, Excursiones)
- Formulario dinámico que cambia según el tipo seleccionado
- Validación de campos según módulo
- Redirección automática al módulo correcto con filtros

**Campos por módulo**:

**Paquetes**:

- Destino (text)
- Fecha de inicio (date)
- Duración en días (number)
- Precio máximo (number)

**Cruceros**:

- Puerto de salida (text)
- Fecha de salida (date)
- Duración en noches (number)
- Precio máximo (number)

**Alojamientos**:

- Ubicación (text)
- Check-in (date)
- Check-out (date)
- Tipo (select: hotel, hostel, apartamento, resort, cabaña)

**Autos**:

- Ubicación de retiro (text)
- Fecha de retiro (date)
- Fecha de devolución (date)
- Categoría (select: económico, compacto, sedan, SUV, lujo, van)

**Excursiones**:

- Destino (text)
- Tipo (select: cultural, aventura, naturaleza, gastronómica, deportiva)
- Duración en horas (number)
- Precio máximo (number)

---

### **ModuleFilters** (`frontend/src/components/ModuleFilters.jsx`)

**Propósito**: Componente reutilizable de filtros para cada módulo

**Características**:

- Se adapta automáticamente según el prop `module` (`"paquetes"`, `"cruceros"`, etc.)
- Lee filtros desde URL params al cargar
- Actualiza URL al cambiar filtros
- Panel colapsable/expandible
- Contador de filtros activos
- Botón para limpiar todos los filtros

**Props**:

```javascript
<ModuleFilters
  module="paquetes" // Tipo de módulo
  onFiltersChange={handleFiltersChange} // Callback con filtros actualizados
/>
```

**Configuración por módulo**:

Cada módulo tiene su configuración de campos definida en la función `getModuleFields()`:

```javascript
// Ejemplo para Paquetes
{
  key: "destino",
  label: "Destino",
  type: "text",
  placeholder: "Ej: París, Roma..."
}
```

**Tipos de campos soportados**:

- `text`: Input de texto
- `number`: Input numérico con min/max
- `date`: Selector de fecha
- `select`: Dropdown con opciones predefinidas

---

## 🗄️ Mapeo con Base de Datos

### Modelo: Paquete

| Campo BD      | Filtro | Tipo    | Validación                        |
| ------------- | ------ | ------- | --------------------------------- |
| `destino`     | ✅     | TEXT    | Búsqueda parcial case-insensitive |
| `fechaInicio` | ✅     | DATE    | Mayor o igual a filtro            |
| `duracion`    | ✅     | INTEGER | Mayor o igual a filtro            |
| `precio`      | ✅     | DECIMAL | Entre precioMin y precioMax       |

### Modelo: Crucero

| Campo BD       | Filtro | Tipo    | Validación                  |
| -------------- | ------ | ------- | --------------------------- |
| `puertoSalida` | ✅     | TEXT    | Búsqueda parcial            |
| `fechaSalida`  | ✅     | DATE    | Coincidencia exacta o rango |
| `duracion`     | ✅     | INTEGER | Comparación numérica        |
| `precioDesde`  | ✅     | DECIMAL | Menor o igual a precioMax   |

### Modelo: Alojamiento

| Campo BD      | Filtro | Tipo    | Validación             |
| ------------- | ------ | ------- | ---------------------- |
| `ubicacion`   | ✅     | TEXT    | Búsqueda parcial       |
| `tipo`        | ✅     | ENUM    | Coincidencia exacta    |
| `estrellas`   | ✅     | INTEGER | Coincidencia exacta    |
| `precioNoche` | ✅     | DECIMAL | Menor o igual a filtro |

### Modelo: Auto

| Campo BD             | Filtro | Tipo    | Validación             |
| -------------------- | ------ | ------- | ---------------------- |
| `ubicacion`          | ✅     | TEXT    | Búsqueda parcial       |
| `categoria`          | ✅     | ENUM    | Coincidencia exacta    |
| `capacidadPasajeros` | ✅     | INTEGER | Mayor o igual a filtro |
| `transmision`        | ✅     | ENUM    | Coincidencia exacta    |
| `precioDia`          | ✅     | DECIMAL | Menor o igual a filtro |

### Modelo: Excursion

| Campo BD   | Filtro | Tipo    | Validación             |
| ---------- | ------ | ------- | ---------------------- |
| `destino`  | ✅     | TEXT    | Búsqueda parcial       |
| `tipo`     | ✅     | ENUM    | Coincidencia exacta    |
| `duracion` | ✅     | INTEGER | Comparación numérica   |
| `precio`   | ✅     | DECIMAL | Menor o igual a filtro |

---

## 💻 Implementación en Páginas

### Ejemplo: Paquetes.jsx

```javascript
import ModuleFilters from "../components/ModuleFilters";

export default function Paquetes() {
  const [paquetes, setPaquetes] = useState([]);
  const [allPaquetes, setAllPaquetes] = useState([]);

  // Función que recibe los filtros actualizados
  const handleFiltersChange = (filters) => {
    if (Object.keys(filters).length === 0) {
      setPaquetes(allPaquetes); // Sin filtros = mostrar todos
      return;
    }

    // Aplicar cada filtro
    const filtered = allPaquetes.filter((paquete) => {
      let matches = true;

      if (filters.destino) {
        matches =
          matches &&
          paquete.destino
            ?.toLowerCase()
            .includes(filters.destino.toLowerCase());
      }

      if (filters.duracion) {
        matches = matches && paquete.duracion >= parseInt(filters.duracion);
      }

      if (filters.precioMax) {
        matches =
          matches &&
          parseFloat(paquete.precio) <= parseFloat(filters.precioMax);
      }

      return matches;
    });

    setPaquetes(filtered);
  };

  return (
    <div>
      <h1>Paquetes Turísticos</h1>

      {/* Componente de filtros */}
      <ModuleFilters module="paquetes" onFiltersChange={handleFiltersChange} />

      {/* Resultados */}
      <div>
        {paquetes.map((p) => (
          <PaqueteCard key={p.id} item={p} />
        ))}
      </div>
    </div>
  );
}
```

---

## 🔗 Sincronización URL ↔ Filtros

### Formato de URL Params

```
/paquetes?destino=Paris&fechaInicio=2026-06-01&duracion=7&precioMax=5000
```

### Lectura de Params (Automática)

`ModuleFilters` lee automáticamente los query params al montarse usando `useSearchParams()`:

```javascript
const [searchParams, setSearchParams] = useSearchParams();

useEffect(() => {
  const initialFilters = {};
  for (const [key, value] of searchParams.entries()) {
    initialFilters[key] = value;
  }
  setFilters(initialFilters);
}, [searchParams]);
```

### Escritura de Params (Automática)

Al cambiar un filtro, la URL se actualiza automáticamente:

```javascript
const handleFilterChange = (key, value) => {
  const newFilters = { ...filters, [key]: value };
  setSearchParams(newFilters); // Actualiza URL
  onFiltersChange(newFilters); // Notifica al padre
};
```

---

## 🎨 Estilos

### `unifiedSearch.css`

Estilos para el buscador del Hero:

- Selector de tipo de servicio con botones tipo "pill"
- Formulario adaptable con grid responsive
- Animaciones suaves de entrada
- Estados hover/active profesionales

### `moduleFilters.css`

Estilos para filtros de módulos:

- Panel colapsable con animación slideDown
- Grid adaptable de campos de filtro
- Banner de filtros activos
- Botones de acción (limpiar, ver filtros)
- Diseño responsive para móvil

---

## 📱 Responsive Design

### Desktop (> 968px)

- Buscador Hero: Campos en grid de 4 columnas
- Filtros módulo: Grid de 3-4 columnas según espacio

### Tablet (640px - 968px)

- Buscador Hero: Campos en 2 columnas
- Filtros módulo: 2 columnas

### Mobile (< 640px)

- Buscador Hero: 1 columna, scroll horizontal para tipos
- Filtros módulo: 1 columna, botones full-width

---

## ✅ Validaciones

### Frontend

- Campos required según contexto
- Validación de tipos (number, date)
- Rangos min/max en campos numéricos
- Opciones predefinidas en selects (evita valores inválidos)

### Backend (Próxima fase)

- Sanitización de query params
- Validación de tipos en controllers
- Protección contra SQL injection
- Límites de resultados para performance

---

## 🚀 Próximos Pasos

### Backend

1. Actualizar controllers para soportar filtros dinámicos
2. Implementar query builders con Sequelize
3. Añadir paginación de resultados
4. Optimizar consultas con índices

### Frontend

5. Añadir debounce en filtros de texto
6. Implementar ordenamiento de resultados
7. Agregar vista de lista/grid
8. Guardar filtros favoritos del usuario

### UX

9. Añadir sugerencias de destinos populares
10. Implementar historial de búsquedas
11. Mostrar número de resultados encontrados
12. Añadir filtros rápidos preconfigurados

---

## 📝 Ejemplos de Uso

### Usuario busca paquete desde Home

1. Entra a la página principal (`/`)
2. Ve el Hero con el buscador unificado
3. Selecciona "Paquetes" en el selector de tipo
4. Llena: Destino = "París", Duración = 7 días, Precio máx = $5000
5. Click en "Buscar Paquetes"
6. Es redirigido a `/paquetes?destino=Paris&duracion=7&precioMax=5000`
7. Ve los resultados filtrados automáticamente
8. Puede ajustar filtros adicionales en el panel del módulo

### Usuario refina búsqueda en módulo

1. Está en `/paquetes`
2. Click en botón "Filtros"
3. Panel se expande mostrando todos los filtros
4. Agrega: Fecha de inicio = 2026-06-01
5. URL se actualiza a `/paquetes?destino=Paris&duracion=7&precioMax=5000&fechaInicio=2026-06-01`
6. Resultados se refiltran en tiempo real
7. Puede limpiar todos los filtros con un click

---

## 🐛 Troubleshooting

### Los filtros no se aplican

- ✅ Verificar que `onFiltersChange` esté conectado en el módulo
- ✅ Revisar que los nombres de campos coincidan con la BD
- ✅ Comprobar logs de consola para errores

### URL no se actualiza

- ✅ Verificar que estás usando `useSearchParams` de react-router-dom
- ✅ Asegurar que el componente está dentro de un `<Router>`

### Filtros desaparecen al recargar

- ✅ Los filtros se mantienen en la URL (query params)
- ✅ `ModuleFilters` lee automáticamente los params al montar
- ✅ Si se pierden, revisar la función `useEffect` de inicialización

---

## 📚 Referencias

### Archivos Clave

**Frontend**:

- `frontend/src/components/UnifiedHeroSearch.jsx` - Búsqueda Hero
- `frontend/src/components/ModuleFilters.jsx` - Filtros de módulo
- `frontend/src/pages/Paquetes.jsx` - Ejemplo de implementación
- `frontend/src/styles/unifiedSearch.css` - Estilos Hero
- `frontend/src/styles/moduleFilters.css` - Estilos filtros

**Backend**:

- `backend/src/models/Paquete.model.js` - Modelo Paquetes
- `backend/src/models/Crucero.model.js` - Modelo Cruceros
- `backend/src/models/Alojamiento.model.js` - Modelo Alojamientos
- `backend/src/models/Auto.model.js` - Modelo Autos
- `backend/src/models/Excursion.model.js` - Modelo Excursiones

### Dependencias

- `react-router-dom` v6+ - Navegación y query params
- React 18+ - Componentes funcionales con hooks

---

## 👥 Soporte

Para dudas o problemas con el sistema de búsqueda y filtros, consultar esta documentación primero. Si el problema persiste, contactar al equipo de desarrollo.

---

**Última actualización**: Febrero 2026  
**Versión**: 1.0.0

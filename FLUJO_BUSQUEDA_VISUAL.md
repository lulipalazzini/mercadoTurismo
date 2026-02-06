# Flujo Visual del Sistema de Búsqueda

## 🎯 Diagrama de Flujo Completo

```
┌─────────────────────────────────────────────────────────────┐
│                    PÁGINA PRINCIPAL (/)                      │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐  │
│  │           UnifiedHeroSearch Component                 │  │
│  │                                                        │  │
│  │  [🎒 Paquetes] [🏨 Alojamientos] [🚢 Cruceros]      │  │
│  │  [🚗 Autos] [🎭 Excursiones]                         │  │
│  │                      ↓                                 │  │
│  │  ┌──────────────────────────────────────────────┐    │  │
│  │  │  FORMULARIO DINÁMICO                         │    │  │
│  │  │  (Se adapta según tipo seleccionado)         │    │  │
│  │  │                                               │    │  │
│  │  │  • Destino / Ubicación                       │    │  │
│  │  │  • Fechas (inicio/fin/salida)               │    │  │
│  │  │  • Duración                                  │    │  │
│  │  │  • Precio máximo                             │    │  │
│  │  │  • Filtros específicos (tipo, categoría...)  │    │  │
│  │  └──────────────────────────────────────────────┘    │  │
│  │                      ↓                                 │  │
│  │            [Buscar Paquetes] 🔍                       │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                           ↓
                    navigate() con
                    query params
                           ↓
┌─────────────────────────────────────────────────────────────┐
│               MÓDULO ESPECÍFICO (/paquetes)                 │
│                                                               │
│  URL: /paquetes?destino=Paris&duracion=7&precioMax=5000     │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐  │
│  │            ModuleFilters Component                    │  │
│  │                                                        │  │
│  │  [Filtros (3)] 🔽                [Limpiar filtros]   │  │
│  │                                                        │  │
│  │  ┌────────────────────────────────────────────────┐  │  │
│  │  │  PANEL DE FILTROS (colapsable)                 │  │  │
│  │  │                                                 │  │  │
│  │  │  Destino: [Paris____________]                  │  │  │
│  │  │  Fecha inicio: [2026-06-01]                    │  │  │
│  │  │  Duración: [7] días                            │  │  │
│  │  │  Precio mín: [____]                            │  │  │
│  │  │  Precio máx: [5000]                            │  │  │
│  │  │                                                 │  │  │
│  │  │  ✅ Filtros se aplican en tiempo real          │  │  │
│  │  │  ✅ URL se sincroniza automáticamente          │  │  │
│  │  └────────────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────┘  │
│                           ↓                                 │
│              onFiltersChange(filters)                       │
│                           ↓                                 │
│  ┌──────────────────────────────────────────────────────┐  │
│  │         LÓGICA DE FILTRADO (en página)               │  │
│  │                                                        │  │
│  │  allPaquetes.filter(paquete => {                     │  │
│  │    if (filters.destino)                              │  │
│  │      matches && paquete.destino.includes(...)        │  │
│  │    if (filters.duracion)                             │  │
│  │      matches && paquete.duracion >= ...              │  │
│  │    if (filters.precioMax)                            │  │
│  │      matches && paquete.precio <= ...                │  │
│  │    return matches;                                   │  │
│  │  })                                                   │  │
│  └──────────────────────────────────────────────────────┘  │
│                           ↓                                 │
│  ┌──────────────────────────────────────────────────────┐  │
│  │           RESULTADOS FILTRADOS                        │  │
│  │                                                        │  │
│  │  ┌────────┐ ┌────────┐ ┌────────┐                   │  │
│  │  │Paquete │ │Paquete │ │Paquete │                   │  │
│  │  │  #1    │ │  #2    │ │  #3    │  ...              │  │
│  │  └────────┘ └────────┘ └────────┘                   │  │
│  │                                                        │  │
│  │  Se muestran: 15 paquetes encontrados                │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔄 Sincronización de Estado

```
┌──────────────┐
│  Hero Search │
│  (Origen)    │
└──────┬───────┘
       │
       │ navigate("/paquetes?destino=X&precio=Y")
       ↓
┌──────────────────────────────────────┐
│  useSearchParams() Hook               │
│  (React Router)                       │
│                                       │
│  URL → JavaScript Object              │
│  /paquetes?destino=X&precio=Y         │
│      ↓                                │
│  { destino: "X", precio: "Y" }       │
└──────┬────────────────────────────────┘
       │
       ↓
┌──────────────────────────────────────┐
│  ModuleFilters Component              │
│                                       │
│  useEffect(() => {                    │
│    const filters = {};                │
│    for ([key, value] of params) {    │
│      filters[key] = value;           │
│    }                                  │
│    setFilters(filters);              │
│  }, [searchParams]);                 │
└──────┬────────────────────────────────┘
       │
       │ onFiltersChange(filters)
       ↓
┌──────────────────────────────────────┐
│  Paquetes.jsx                        │
│  (Parent Component)                   │
│                                       │
│  const handleFiltersChange = (f) => { │
│    const filtered = allData.filter(...);│
│    setData(filtered);                │
│  }                                    │
└───────────────────────────────────────┘
```

---

## 📊 Mapeo de Campos por Módulo

### Paquetes

```
Hero → Módulo
─────────────────────────────────
destino       → destino
fechaInicio   → fechaInicio
duracion      → duracion
precioMax     → precioMax

BD (Paquete model)
─────────────────────────────────
destino       : STRING
fechaInicio   : DATE
duracion      : INTEGER (días)
precio        : DECIMAL
```

### Cruceros

```
Hero → Módulo
─────────────────────────────────
puertoSalida  → puertoSalida
fechaInicio   → fechaSalida
duracion      → duracion (noches)
precioMax     → precioMax

BD (Crucero model)
─────────────────────────────────
puertoSalida  : STRING
fechaSalida   : DATE
duracion      : INTEGER (noches)
precioDesde   : DECIMAL
```

### Alojamientos

```
Hero → Módulo
─────────────────────────────────
ubicacion     → ubicacion
fechaInicio   → fechaInicio (check-in)
fechaFin      → fechaFin (check-out)
tipo          → tipo

BD (Alojamiento model)
─────────────────────────────────
ubicacion     : STRING
tipo          : ENUM(hotel, hostel, apartamento, resort, cabaña)
precioNoche   : DECIMAL
estrellas     : INTEGER (1-5)
```

### Autos

```
Hero → Módulo
─────────────────────────────────
ubicacion     → ubicacion
fechaInicio   → fechaInicio (retiro)
fechaFin      → fechaFin (devolución)
categoria     → categoria

BD (Auto model)
─────────────────────────────────
ubicacion         : STRING
categoria         : ENUM(economico, compacto, sedan, suv, lujo, van)
capacidadPasajeros: INTEGER
transmision       : ENUM(manual, automatico)
precioDia         : DECIMAL
```

### Excursiones

```
Hero → Módulo
─────────────────────────────────
destino       → destino
tipoExcursion → tipo
duracion      → duracion (horas)
precioMax     → precioMax

BD (Excursion model)
─────────────────────────────────
destino       : STRING
tipo          : ENUM(cultural, aventura, naturaleza, gastronomica, deportiva)
duracion      : INTEGER (horas)
precio        : DECIMAL
```

---

## 🎬 Ejemplo de Interacción Completa

### Paso 1: Usuario en Home

```
URL actual: https://mercadoturismo.com/
```

### Paso 2: Selecciona Paquetes y llena formulario

```
Tipo: Paquetes
Destino: "París"
Fecha inicio: 2026-06-01
Duración: 7 días
Precio máx: 5000
```

### Paso 3: Click en "Buscar Paquetes"

```
navigate("/paquetes", {
  search: "?destino=París&fechaInicio=2026-06-01&duracion=7&precioMax=5000"
})
```

### Paso 4: URL actualizada

```
URL: https://mercadoturismo.com/paquetes?destino=París&fechaInicio=2026-06-01&duracion=7&precioMax=5000
```

### Paso 5: Módulo recibe params

```javascript
// ModuleFilters.jsx
const [searchParams] = useSearchParams();
// searchParams = {
//   destino: "París",
//   fechaInicio: "2026-06-01",
//   duracion: "7",
//   precioMax: "5000"
// }
```

### Paso 6: Filtros se aplican

```javascript
// Paquetes.jsx
const filtered = allPaquetes.filter(
  (p) =>
    p.destino.toLowerCase().includes("parís") &&
    new Date(p.fechaInicio) >= new Date("2026-06-01") &&
    p.duracion >= 7 &&
    p.precio <= 5000,
);
// Resultado: 15 paquetes
```

### Paso 7: Usuario agrega filtro adicional

```
Panel de filtros:
Precio mín: 2000 (nuevo filtro)
```

### Paso 8: URL se actualiza automáticamente

```
URL: https://mercadoturismo.com/paquetes?destino=París&fechaInicio=2026-06-01&duracion=7&precioMin=2000&precioMax=5000
```

### Paso 9: Resultados refinados

```
Resultado: 8 paquetes (filtrados adicionalmente)
```

---

## ✅ Checklist de Implementación

Para agregar búsqueda/filtros a un nuevo módulo:

- [ ] 1. Definir campos de filtro en `ModuleFilters` (`getModuleFields()`)
- [ ] 2. Mapear con campos reales de la BD
- [ ] 3. Agregar tipo de servicio en `UnifiedHeroSearch` (searchTypes array)
- [ ] 4. Agregar caso en el switch de `UnifiedHeroSearch` con campos específicos
- [ ] 5. Importar `ModuleFilters` en la página del módulo
- [ ] 6. Crear función `handleFiltersChange` con lógica de filtrado
- [ ] 7. Renderizar `<ModuleFilters module="xxx" onFiltersChange={...} />`
- [ ] 8. Probar flujo completo: Hero → Módulo → Filtros locales
- [ ] 9. Verificar sincronización de URL
- [ ] 10. Probar responsive en mobile

---

**Flujo simplificado:**  
`Hero (selección) → Hero (filtros) → navigate() → Módulo (recibe) → ModuleFilters (lee URL) → handleFiltersChange (aplica) → Resultados actualizados`

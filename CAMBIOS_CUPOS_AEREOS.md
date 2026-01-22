# Modificaciones: Cupos Solo Aéreos y Eliminación de Pasajes

## Fecha: 21 de Enero de 2026

## Resumen de Cambios

Este documento detalla las modificaciones realizadas para:
1. **Limitar los cupos del mercado a solo productos aéreos**
2. **Eliminar completamente el módulo de Pasajes del sistema**

---

## 1. Modificaciones en el Modelo de Cupos Mercado

### Archivo: `backend/src/models/CupoMercado.model.js`

**Cambio realizado:**
- Campo `tipoProducto` modificado de `STRING(100)` a `ENUM("aereo")`
- Valor por defecto: `"aereo"`
- Ahora solo acepta cupos de tipo aéreo

```javascript
tipoProducto: {
  type: DataTypes.ENUM("aereo"),
  allowNull: false,
  defaultValue: "aereo",
  comment: "Tipo de producto - Solo cupos aéreos",
}
```

---

## 2. Actualización del Seeder de Cupos

### Archivo: `backend/src/seeders/cuposMercado.seeder.js`

**Cambio realizado:**
- Reemplazados todos los tipos de cupos (paquetes, hoteles, excursiones, etc.)
- Ahora contiene solo 8 cupos de tipo `"aereo"` con diferentes destinos:
  - Buenos Aires - Miami
  - Buenos Aires - Madrid
  - Buenos Aires - Cancún
  - Buenos Aires - Roma
  - Buenos Aires - Nueva York
  - Buenos Aires - Punta Cana
  - Buenos Aires - Barcelona
  - Buenos Aires - Los Ángeles

Cada cupo incluye:
- Descripción del vuelo con fecha de salida
- Cantidad de cupos disponibles
- Precios mayorista y minorista
- Fecha de vencimiento
- Observaciones (aerolínea, equipaje, servicios incluidos)

---

## 3. Eliminación Completa del Módulo de Pasajes

### Backend - Archivos Eliminados:

1. **Modelo:** `backend/src/models/Pasaje.model.js` ❌
2. **Controlador:** `backend/src/controllers/pasajes.controller.js` ❌
3. **Rutas:** `backend/src/routes/pasajes.routes.js` ❌
4. **Seeder:** `backend/src/seeders/pasajes.seeder.js` ❌

### Backend - Archivos Modificados:

**`backend/src/index.js`:**
- ❌ Eliminada importación: `import pasajesRoutes from "./routes/pasajes.routes.js"`
- ❌ Eliminada ruta: `app.use("/api/pasajes", pasajesRoutes)`

---

### Frontend - Archivos Eliminados:

1. **Página pública:** `frontend/src/pages/Pasajes.jsx` ❌
2. **Card de pasaje:** `frontend/src/components/PasajeCard.jsx` ❌
3. **Dashboard - Componente:** `frontend/src/components/dashboard/Pasajes.jsx` ❌
4. **Dashboard - Modal crear:** `frontend/src/components/dashboard/PasajeFormModal.jsx` ❌
5. **Dashboard - Modal editar:** `frontend/src/components/dashboard/PasajeEditModal.jsx` ❌

### Frontend - Archivos Modificados:

**`frontend/src/App.jsx`:**
- ❌ Eliminada importación: `import Pasajes from "./pages/Pasajes"`
- ❌ Eliminada ruta: `<Route path="/pasajes" element={<Pasajes />} />`

**`frontend/src/components/Navbar.jsx`:**
- ❌ Eliminado del array `isDropdownActive`: `/pasajes`
- ❌ Eliminado link del menú dropdown "Traslados"

**`frontend/src/components/Dashboard.jsx`:**
- ❌ Eliminada importación: `import Pasajes from "./dashboard/Pasajes"`
- ❌ Eliminado del objeto `titles`: `pasajes: "Pasajes"`
- ❌ Eliminado case del switch: `case "pasajes": return <Pasajes />`
- ❌ Eliminado botón de navegación con icono `<FaPlane />`

---

## 4. Scripts de Migración Creados

### `backend/src/migrate-cupos-aereos.js`

Script para migrar la base de datos existente:
- Elimina cupos que no sean aéreos
- Actualiza "Pasaje Aéreo" a "aereo"
- Recrea la tabla con el nuevo esquema ENUM

**Uso:**
```bash
cd backend
node src/migrate-cupos-aereos.js
```

### `backend/src/reset-cupos-mercado.js` (Actualizado)

Script para resetear completamente los cupos:
- Elimina todos los cupos existentes
- Carga los nuevos seeders con solo cupos aéreos
- Verifica el resultado

**Uso:**
```bash
cd backend
node src/reset-cupos-mercado.js
```

---

## 5. Impacto en la Aplicación

### ✅ Funcionalidades que PERMANECEN:
- Mercado de Cupos (ahora solo aéreos)
- Paquetes
- Alojamientos
- Autos
- Circuitos
- Cruceros
- Excursiones
- Salidas Grupales
- Transfers
- Seguros

### ❌ Funcionalidades ELIMINADAS:
- Módulo completo de Pasajes (backend y frontend)
- Gestión CRUD de pasajes
- Vista pública de pasajes
- Dashboard de pasajes para operadores

### 🔄 Cambios en el Menú:
- **Navbar público:** Dropdown "Traslados" ahora solo contiene "Autos" y "Transfer"
- **Dashboard:** Sidebar ya no muestra la opción "Pasajes"

---

## 6. Verificación Post-Migración

### Comandos ejecutados con éxito:

1. **Migración de cupos:**
   ```bash
   node src/migrate-cupos-aereos.js
   ```
   ✅ Resultado: 1 cupo aéreo migrado correctamente

2. **Reset y recarga de seeders:**
   ```bash
   node src/reset-cupos-mercado.js
   ```
   ✅ Resultado: Tabla recreada y 8 cupos aéreos cargados

### Base de datos actualizada:
- **Tabla:** `cupos_mercado`
- **Campo:** `tipoProducto ENUM('aereo')`
- **Registros:** 8 cupos aéreos con diferentes destinos internacionales

---

## 7. Próximos Pasos Recomendados

1. **Reiniciar el servidor backend:**
   ```bash
   cd backend
   npm start
   ```

2. **Reiniciar el frontend:**
   ```bash
   cd frontend
   npm run dev
   ```

3. **Limpiar caché del navegador** si es necesario

4. **Verificar funcionalidad:**
   - Login como operador/agencia
   - Acceder a "Mercado de Cupos"
   - Verificar que solo aparezcan cupos aéreos
   - Confirmar que "Pasajes" no aparece en ningún menú

---

## Notas Importantes

- ⚠️ **Los cambios son irreversibles** después de ejecutar las migraciones
- 💾 Se recomienda hacer backup de la base de datos antes de ejecutar en producción
- 🔄 El modelo anterior de Pasajes ha sido completamente eliminado
- ✈️ Ahora el sistema se enfoca exclusivamente en cupos aéreos para el mercado B2B

---

## Archivos de Referencia

- Modelo actualizado: [CupoMercado.model.js](backend/src/models/CupoMercado.model.js)
- Seeder actualizado: [cuposMercado.seeder.js](backend/src/seeders/cuposMercado.seeder.js)
- Script de migración: [migrate-cupos-aereos.js](backend/src/migrate-cupos-aereos.js)
- Script de reset: [reset-cupos-mercado.js](backend/src/reset-cupos-mercado.js)

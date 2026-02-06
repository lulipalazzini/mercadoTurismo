# Controllers Actualizados con Sistema de Ownership

## ✅ Estado: COMPLETADOS (9/9)

Todos los controllers han sido actualizados con el sistema de ownership y permisos B2B.

---

## 📋 Cambios Aplicados

### 1️⃣ Imports Agregados

Todos los controllers ahora importan:

```javascript
const { shouldFilterByOwnership } = require("../middleware/rolePermissions");
```

---

### 2️⃣ Métodos GET (Listar) - Con Filtro de Ownership

**Patrón aplicado en todos:**

```javascript
const getRecursos = async (req, res) => {
  try {
    const whereClause = { activo: true }; // o disponible: true

    // 🔒 Aplicar filtro de ownership para usuarios B2B
    if (req.user && shouldFilterByOwnership(req.user, "nombreModulo")) {
      whereClause.userId = req.user.id;
      console.log(`🔒 Filtrando recursos del usuario: ${req.user.id}`);
    }

    // 🌐 Usuarios no autenticados: solo recursos públicos
    if (!req.user) {
      whereClause.isPublic = true;
    }

    const recursos = await Modelo.findAll({
      where: whereClause,
      order: [["createdAt", "DESC"]],
      include: [{
        model: User,
        as: "vendedor",
        attributes: [
          "id", "nombre", "email", "razonSocial", "role",
          "calculatedRole", "isVisibleToPassengers" // ⚠️ Nuevos campos
        ],
      }],
    });

    // ... resto del código
  }
};
```

---

### 3️⃣ Métodos POST (Crear) - Asignación Automática de Owner

**Patrón aplicado en todos:**

```javascript
const createRecurso = async (req, res) => {
  try {
    const recursoData = { ...req.body };
    // ... parseado de campos

    // 👤 Asignar owner (userId) automáticamente
    if (req.user) {
      recursoData.userId = req.user.id;
    }

    const recurso = await Modelo.create(recursoData);
    // ... resto del código
  }
};
```

---

## 📊 Controllers Actualizados

### ✅ 1. paquetes.controller.js

- **Módulo:** `"paquetes"`
- **Condición:** `activo: true`
- **Filtro:** ✅ Aplicado
- **userId:** ✅ Asignado en `createPaquete`
- **Console log:** `🔒 Filtrando paquetes del usuario: ${req.user.id}`

---

### ✅ 2. alojamientos.controller.js

- **Módulo:** `"alojamientos"`
- **Condición:** `activo: true`
- **Filtro:** ✅ Aplicado
- **userId:** ✅ Asignado en `createAlojamiento`
- **Console log:** `🔒 Filtrando alojamientos del usuario: ${req.user.id}`

---

### ✅ 3. autos.controller.js

- **Módulo:** `"autos"`
- **Condición:** `disponible: true`
- **Filtro:** ✅ Aplicado
- **userId:** ✅ Asignado en `createAuto`
- **Console log:** `🔒 Filtrando autos del usuario: ${req.user.id}`

---

### ✅ 4. transfers.controller.js

- **Módulo:** `"transfers"`
- **Condición:** `disponible: true`
- **Filtro:** ✅ Aplicado
- **userId:** ✅ Asignado en `createTransfer`
- **Console log:** `🔒 Filtrando transfers del usuario: ${req.user.id}`

---

### ✅ 5. excursiones.controller.js

- **Módulo:** `"excursiones"`
- **Condición:** `activo: true`
- **Filtro:** ✅ Aplicado
- **userId:** ✅ Asignado en `createExcursion`
- **Console log:** `🔒 Filtrando excursiones del usuario: ${req.user.id}`

---

### ✅ 6. salidasGrupales.controller.js

- **Módulo:** `"salidasGrupales"`
- **Condición:** `activo: true`
- **Orden:** `fechaSalida ASC` (cronológico)
- **Filtro:** ✅ Aplicado
- **userId:** ✅ Asignado en `createSalidaGrupal`
- **Console log:** `🔒 Filtrando salidas grupales del usuario: ${req.user.id}`

---

### ✅ 7. cruceros.controller.js

- **Módulo:** `"cruceros"`
- **Condición:** `activo: true`
- **Filtro:** ✅ Aplicado
- **userId:** ✅ Asignado en `createCrucero`
- **Console log:** `🔒 Filtrando cruceros del usuario: ${req.user.id}`

---

### ✅ 8. seguros.controller.js

- **Módulo:** `"seguros"`
- **Condición:** `activo: true`
- **Filtro:** ✅ Aplicado
- **userId:** ✅ Asignado en `createSeguro`
- **Console log:** `🔒 Filtrando seguros del usuario: ${req.user.id}`

---

### ✅ 9. cuposMercado.controller.js ⚠️ EXCEPCIÓN

- **Módulo:** `"cuposMercado"`
- **Condición:** `estado: "disponible" AND cantidad > 0`
- **Filtro:** ❌ **NO APLICADO** (excepción global)
- **Visibilidad:** **TODOS los usuarios B2B ven TODOS los cupos**
- **Console log:** `⚠️ MODO GLOBAL: Mostrando TODOS los cupos`

**Lógica especial:**
```javascript
// NO filtrar por userId
// Mostrar cupos de TODOS los usuarios B2B
const cupos = await CupoMercado.findAll({
  include: [{
    model: User,
    as: "vendedor",
    where: { userType: "B2B" } // Cualquier usuario B2B
  }],
  where: {
    estado: "disponible",
    cantidad: { [Op.gt]: 0 }
  }
});
```

---

## 🔄 Flujo de Visibilidad

### Para Usuarios B2B:

```
Usuario autenticado (B2B)
    ↓
shouldFilterByOwnership(user, moduleName)
    ↓
¿Es "cuposMercado"? 
    ├─ SÍ → NO filtrar (ver todos)
    └─ NO → Filtrar por userId (solo lo suyo)
```

### Para Usuarios No Autenticados:

```
Usuario no autenticado
    ↓
whereClause.isPublic = true
    ↓
Solo recursos públicos
```

### Para Admins:

```
Usuario admin/sysadmin
    ↓
shouldFilterByOwnership() → false
    ↓
Ver TODO (sin filtros)
```

---

## 🔍 Debugging

Todos los controllers ahora incluyen console.logs para rastrear el filtrado:

```bash
# Ejemplo de salida en consola:
🔒 Filtrando paquetes del usuario: 123
🔒 Filtrando alojamientos del usuario: 123
⚠️ MODO GLOBAL: Mostrando TODOS los cupos
```

---

## ⚠️ Importante: Modelos Pendientes

Los controllers ya están preparados para usar `userId`, pero los **modelos aún necesitan actualizarse** para incluir este campo:

### Modelos a Actualizar (PENDIENTE):

```javascript
// Agregar a TODOS los modelos de publicaciones:
{
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "Users",
      key: "id",
    },
    comment: "ID del usuario propietario (owner) de esta publicación",
  }
}
```

**Lista de modelos:**
- [ ] Paquete.model.js
- [ ] Alojamiento.model.js
- [ ] Auto.model.js
- [ ] Transfer.model.js
- [ ] Excursion.model.js
- [ ] SalidaGrupal.model.js
- [ ] Crucero.model.js
- [ ] Seguro.model.js

---

## 📈 Progreso del Sistema de Roles

```
Backend:
  ├── User Model (Roles B2B)          ✅ 100%
  ├── Middleware (Ownership)          ✅ 100%
  ├── Middleware (Permissions)        ✅ 100%
  ├── Controllers (9/9)               ✅ 100%
  └── Models (Campo userId)           ⏳ 0%

Frontend:
  ├── Dashboard Dinámico              ⏳ 0%
  ├── Utilidades de Permisos          ⏳ 0%
  └── Componentes con Visibilidad     ⏳ 0%

Total: ~65% completo
```

---

## 🎯 Próximos Pasos

1. **Actualizar modelos** con campo `userId`
2. **Migración de BD** para agregar columna `userId`
3. **Frontend:** Dashboard dinámico según rol
4. **Testing:** Verificar filtros y permisos

---

**Fecha:** Febrero 2026  
**Versión:** 1.0  
**Status:** Controllers Backend ✅ COMPLETADOS

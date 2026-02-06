# Sistema de Roles y Permisos B2B - Documentación Completa

## 📋 Índice

1. [Reglas de Asignación de Roles](#reglas-de-asignación-de-roles)
2. [Tipos de Usuarios](#tipos-de-usuarios)
3. [Sistema de Permisos](#sistema-de-permisos)
4. [Control de Visibilidad](#control-de-visibilidad)
5. [Excepción: Mercado de Cupos](#excepción-mercado-de-cupos)
6. [Implementación Backend](#implementación-backend)
7. [Implementación Frontend](#implementación-frontend)
8. [Ejemplos de Uso](#ejemplos-de-uso)

---

## 1. Reglas de Asignación de Roles

### 🏢 AGENCIA DE VIAJES

**Se asigna SOLO si cumple TODAS estas condiciones:**

1. ✅ `businessModel === "solo_pasajeros"` (Vende exclusivamente a pasajeros finales)
2. ✅ `serviceType === "intermediario"` (Solo actúa como intermediario, NO produce servicios)
3. ✅ Actividad fiscal/comercial compatible con intermediación

**Resultado:**

- `calculatedRole` = `"agencia"`
- `isVisibleToPassengers` = `true`

### 🏭 OPERADOR / PROVEEDOR

**Se asigna si cumple AL MENOS UNA de estas condiciones:**

1. ✅ `businessModel === "solo_agencias"` (Vende exclusivamente a otras agencias)
2. ✅ `businessModel === "mixto"` (Vende tanto a agencias como a pasajeros)
3. ✅ `serviceType === "productor"` (Presta servicios propios: hoteles, tours, transportes, etc.)
4. ✅ `serviceType === "mixto"` (Intermedia Y produce)

**Resultado:**

- `calculatedRole` = `"operador"`
- `isVisibleToPassengers` = `false` (⚠️ Nunca visible al pasajero, aunque venda directo)

---

## 2. Tipos de Usuarios

### 📊 Campos en Base de Datos (User model)

```javascript
{
  userType: "B2B", // "B2C" o "B2B"

  // Campos que determinan el rol:
  businessModel: "solo_pasajeros", // o "solo_agencias" o "mixto"
  serviceType: "intermediario", // o "productor" o "mixto"

  // Campos calculados automáticamente:
  calculatedRole: "agencia", // o "operador" (calculado en hooks)
  isVisibleToPassengers: true, // Boolean (calculado en hooks)

  // Otros campos B2B:
  entityType: "agencia", // física, jurídica, empresa, etc
  fiscalData: {...}, // JSON con CUIT/Tax ID
  businessData: {...}, // JSON con domicilios, actividades
  validationStatus: "validated" // pending, validated, rejected, incomplete
}
```

### 🔍 Método de Cálculo

Ubicación: `backend/src/models/User.model.js`

```javascript
User.prototype.calculateB2BRole = function () {
  // Si no tiene datos B2B, es operador por defecto
  if (!this.businessModel || !this.serviceType) {
    return "operador";
  }

  // AGENCIA: Solo pasajeros + Solo intermediario
  if (
    this.businessModel === "solo_pasajeros" &&
    this.serviceType === "intermediario"
  ) {
    return "agencia";
  }

  // OPERADOR/PROVEEDOR: Cualquier otro caso
  return "operador";
};
```

**Se ejecuta automáticamente en:**

- `beforeCreate` hook - Al crear usuario
- `beforeUpdate` hook - Al modificar `businessModel` o `serviceType`

---

## 3. Sistema de Permisos

### 📜 Mapa de Permisos por Rol

Ubicación: `backend/src/middleware/rolePermissions.js`

#### AGENCIA

```javascript
{
  canPublish: true,
  canSeeOthersInCuposMercado: true, // ⚠️ Excepción
  canSeeOthersInOtherModules: false, // Solo ve lo suyo
  canEditOwn: true,
  canDeleteOwn: true,
  canAccessB2CModules: true, // Ve paquetes para pasajeros
  canAccessB2BModules: false, // NO ve info interna de operadores
  visibleToPassengers: true,
  dashboardModules: [
    "paquetes",
    "alojamientos",
    "autos",
    "transfers",
    "excursiones",
    "salidasGrupales",
    "cruceros",
    "seguros",
    "cuposMercado", // ⚠️ Excepción: ven todos
    "misPublicaciones",
  ]
}
```

#### OPERADOR / PROVEEDOR

```javascript
{
  canPublish: true,
  canSeeOthersInCuposMercado: true, // ⚠️ Excepción
  canSeeOthersInOtherModules: false, // Solo ve lo suyo
  canEditOwn: true,
  canDeleteOwn: true,
  canAccessB2CModules: false, // NO ve módulos B2C
  canAccessB2BModules: true, // Ve productos para agencias
  visibleToPassengers: false, // ⚠️ Nunca visible aunque venda directo
  dashboardModules: [
    "productosB2B", // Productos para agencias
    "cuposMercado", // ⚠️ Excepción: ven todos
    "misServicios",
    "clientesB2B",
    "reservasB2B",
  ]
}
```

---

## 4. Control de Visibilidad

### 🔒 Regla General: OWNERSHIP ESTRICTO

**Todos los usuarios B2B:**

- Solo ven sus propias publicaciones
- Solo pueden editar su propio contenido
- Solo pueden eliminar lo suyo
- **NO pueden ver** publicaciones de otros usuarios

### ✅ Implementación en Backend

#### Middleware de Filtrado

Ubicación: `backend/src/middleware/checkOwnership.js`

```javascript
// Aplicar en rutas GET para filtrar automáticamente
const filterByOwnership = (req, res, next) => {
  const userId = req.user.id;
  const userRole = req.user.role;

  // Admins ven todo
  if (userRole === "admin" || userRole === "sysadmin") {
    req.ownershipFilter = {};
    return next();
  }

  // Usuarios B2B solo ven lo suyo
  if (req.user.userType === "B2B") {
    req.ownershipFilter = {
      userId: userId,
    };
  }

  next();
};
```

#### Uso en Controllers

Ejemplo: `backend/src/controllers/paquetes.controller.js`

```javascript
const getPaquetes = async (req, res) => {
  const whereClause = {};

  // Aplicar filtro de ownership
  if (req.user && shouldFilterByOwnership(req.user, "paquetes")) {
    whereClause.userId = req.user.id;
  }

  const paquetes = await Paquete.findAll({
    where: whereClause,
    include: [{ model: User, as: "vendedor" }],
  });

  res.json(paquetes);
};
```

### 🚫 Verificación de Ownership en Edición/Borrado

```javascript
// Middleware para verificar antes de editar/borrar
const checkOwnership = (Model, idParam = "id") => {
  return async (req, res, next) => {
    const resourceId = req.params[idParam];
    const userId = req.user.id;

    // Admins pueden editar todo
    if (req.user.role === "admin" || req.user.role === "sysadmin") {
      return next();
    }

    const resource = await Model.findByPk(resourceId);

    if (!resource) {
      return res.status(404).json({ message: "Recurso no encontrado" });
    }

    if (resource.userId !== userId) {
      return res.status(403).json({
        message: "No tienes permiso para acceder a este recurso",
      });
    }

    next();
  };
};
```

---

## 5. Excepción: Mercado de Cupos

### ⚠️ REGLA ESPECIAL

**En el módulo "Mercado de Cupos":**

- Todos los usuarios B2B pueden ver TODOS los cupos
- NO se aplica filtro de ownership
- Tanto agencias como operadores/proveedores tienen acceso completo

### 🔓 Implementación

#### Controller de Cupos Mercado

Ubicación: `backend/src/controllers/cuposMercado.controller.js`

```javascript
const getCuposMercado = async (req, res) => {
  // Verificar que sea usuario B2B
  if (req.user.userType !== "B2B") {
    return res.status(403).json({
      message: "Solo usuarios B2B pueden ver el marketplace",
    });
  }

  // ⚠️ NO FILTRAR POR OWNERSHIP
  // Mostrar TODOS los cupos de TODOS los usuarios B2B
  const cupos = await CupoMercado.findAll({
    include: [
      {
        model: User,
        as: "vendedor",
        where: { userType: "B2B" },
      },
    ],
    where: {
      estado: "disponible",
      cantidad: { [Op.gt]: 0 },
    },
  });

  res.json(cupos);
};
```

#### Middleware Especial

```javascript
const allowAllForCuposMercado = (req, res, next) => {
  req.ownershipFilter = {}; // No aplicar filtros
  req.skipOwnershipCheck = true;
  next();
};
```

#### Uso en Rutas

```javascript
// Rutas de cupos mercado - SIN filtro de ownership
router.get(
  "/cupos-mercado",
  authenticate,
  requireB2B,
  allowAllForCuposMercado, // ⚠️ Excepción
  getCuposMercado,
);

// Rutas de otros módulos - CON filtro de ownership
router.get(
  "/paquetes",
  authenticate,
  filterByOwnership, // ✅ Filtrado normal
  getPaquetes,
);
```

### 🔍 Detección de la Excepción

```javascript
const isCuposMercadoModule = (moduleName) => {
  return moduleName === "cuposMercado" || moduleName === "cupos-mercado";
};

const shouldFilterByOwnership = (user, moduleName) => {
  // Admins no tienen filtro
  if (user.role === "admin" || user.role === "sysadmin") {
    return false;
  }

  // Mercado de Cupos: NO filtrar
  if (isCuposMercadoModule(moduleName)) {
    return false;
  }

  // Todos los demás módulos: Filtrar
  return true;
};
```

---

## 6. Implementación Backend

### 📁 Archivos Clave

```
backend/src/
├── models/
│   └── User.model.js              # ✅ Campos B2B + calculateB2BRole()
├── middleware/
│   ├── auth.middleware.js          # Autenticación JWT
│   ├── checkOwnership.js           # ✅ NUEVO: Verificación de ownership
│   └── rolePermissions.js          # ✅ NUEVO: Mapa de permisos
└── controllers/
    ├── paquetes.controller.js      # ✅ ACTUALIZADO: Filtros de ownership
    ├── alojamientos.controller.js  # ✅ ACTUALIZAR: Filtros de ownership
    ├── autos.controller.js          # ✅ ACTUALIZAR: Filtros de ownership
    ├── cuposMercado.controller.js  # ✅ ACTUALIZADO: Excepción sin filtros
    └── ...
```

### 🔧 Pasos de Implementación

#### 1. Extender User Model

```bash
# Ya implementado en User.model.js
- Campos: businessModel, serviceType, calculatedRole, isVisibleToPassengers
- Método: calculateB2BRole()
- Hooks: beforeCreate, beforeUpdate (calculan rol automáticamente)
```

#### 2. Crear Middleware de Permisos

```bash
# Ya implementado
✅ backend/src/middleware/checkOwnership.js
✅ backend/src/middleware/rolePermissions.js
```

#### 3. Actualizar Controllers (POR HACER)

**Para CADA controller (paquetes, alojamientos, autos, etc.):**

```javascript
// 1. Importar utilidad
const { shouldFilterByOwnership } = require("../middleware/rolePermissions");

// 2. En método GET (listar)
const whereClause = {};
if (req.user && shouldFilterByOwnership(req.user, "nombreModulo")) {
  whereClause.userId = req.user.id;
}

// 3. En métodos POST (crear)
const nuevoRecurso = await Modelo.create({
  ...req.body,
  userId: req.user.id, // ⚠️ IMPORTANTE: Asignar owner
});

// 4. En rutas
router.put("/:id", authenticate, checkOwnership(Modelo), updateRecurso);
router.delete("/:id", authenticate, checkOwnership(Modelo), deleteRecurso);
```

#### 4. Actualizar Modelos (POR HACER)

**Agregar campo `userId` a TODOS los modelos de publicaciones:**

```javascript
// Ejemplo: Paquete.model.js
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

**Modelos a actualizar:**

- ✅ Paquete.model.js
- ⚠️ Alojamiento.model.js (PENDIENTE)
- ⚠️ Auto.model.js (PENDIENTE)
- ⚠️ Transfer.model.js (PENDIENTE)
- ⚠️ Excursion.model.js (PENDIENTE)
- ⚠️ SalidaGrupal.model.js (PENDIENTE)
- ⚠️ Crucero.model.js (PENDIENTE)
- ⚠️ Seguro.model.js (PENDIENTE)

---

## 7. Implementación Frontend

### 🎨 Dashboard Dinámico por Rol

Ubicación: `frontend/src/components/Dashboard.jsx`

```jsx
import { getDashboardModules } from "../utils/rolePermissions";

function Dashboard() {
  const user = JSON.parse(localStorage.getItem("currentUser"));
  const visibleModules = getDashboardModules(user);

  return (
    <div className="dashboard">
      {visibleModules.includes("paquetes") && <PaquetesSection />}
      {visibleModules.includes("cuposMercado") && <CuposMercadoSection />}
      {visibleModules.includes("productosB2B") && <ProductosB2BSection />}
      {/* ... */}
    </div>
  );
}
```

### 🔐 Control de Visibilidad

```jsx
// Utilidad frontend
const canAccessModule = (user, moduleName) => {
  const role = user.calculatedRole || user.role;
  const permissions = rolePermissions[role];

  if (permissions.dashboardModules.includes("*")) {
    return true; // Admin
  }

  return permissions.dashboardModules.includes(moduleName);
};

// Uso en componentes
{
  canAccessModule(user, "paquetes") && (
    <Link to="/dashboard/paquetes">Paquetes</Link>
  );
}
```

### 📊 Indicadores de Rol

```jsx
// Mostrar badge del rol calculado
{
  user.userType === "B2B" && (
    <span className={`role-badge role-${user.calculatedRole}`}>
      {user.calculatedRole === "agencia" ? "🏢 Agencia" : "🏭 Operador"}
    </span>
  );
}

// Mostrar visibilidad
{
  user.isVisibleToPassengers && (
    <span className="visible-badge">👁️ Visible al público</span>
  );
}
```

---

## 8. Ejemplos de Uso

### Ejemplo 1: Agencia de Viajes

```javascript
// Datos en BD
{
  nombre: "Viajes del Sur",
  email: "contacto@viajesdelsur.com",
  userType: "B2B",
  businessModel: "solo_pasajeros", // ✅ Solo vende a pasajeros
  serviceType: "intermediario", // ✅ Solo intermedia

  // Calculado automáticamente:
  calculatedRole: "agencia",
  isVisibleToPassengers: true
}

// Comportamiento:
- ✅ Aparece en búsquedas B2C
- ✅ Puede publicar paquetes para pasajeros
- ✅ Ve todos los cupos en Mercado de Cupos
- ❌ NO ve información interna de operadores
- ❌ NO ve productos B2B de otros
```

### Ejemplo 2: Operador Turístico (Hotel)

```javascript
// Datos en BD
{
  nombre: "Hotel Patagonia",
  email: "reservas@hotelpatagonia.com",
  userType: "B2B",
  businessModel: "mixto", // Vende a agencias Y pasajeros
  serviceType: "productor", // ✅ Presta servicios propios

  // Calculado automáticamente:
  calculatedRole: "operador",
  isVisibleToPassengers: false // ⚠️ Nunca visible
}

// Comportamiento:
- ❌ NO aparece en búsquedas B2C (aunque venda directo)
- ✅ Publica habitaciones para agencias
- ✅ Ve todos los cupos en Mercado de Cupos
- ✅ Ve módulos B2B internos
- ❌ NO ve publicaciones de otras agencias/operadores (excepto cupos)
```

### Ejemplo 3: Proveedor de Transfers

```javascript
// Datos en BD
{
  nombre: "Transfers Express",
  email: "info@transfersexpress.com",
  userType: "B2B",
  businessModel: "solo_agencias", // ✅ Solo vende a agencias
  serviceType: "productor", // ✅ Presta servicios propios

  // Calculado automáticamente:
  calculatedRole: "operador",
  isVisibleToPassengers: false
}

// Comportamiento:
- ❌ NO visible al pasajero
- ✅ Publica transfers para agencias
- ✅ Ve todos los cupos en Mercado de Cupos
- ❌ NO ve paquetes B2C
- ❌ Solo ve sus propios transfers publicados
```

### Ejemplo 4: Consulta de Paquetes (Backend)

```javascript
// Usuario: Agencia (ID: 123)
GET /api/paquetes

// Backend filtra automáticamente:
WHERE userId = 123

// Resultado: Solo paquetes de la agencia 123
[
  { id: 1, titulo: "Paquete Norte", userId: 123 },
  { id: 2, titulo: "Paquete Sur", userId: 123 }
]
```

### Ejemplo 5: Consulta de Cupos Mercado (Backend)

```javascript
// Usuario: Operador (ID: 456)
GET / api / cupos -
  mercado[
    // Backend NO filtra (excepción):
    // WHERE (sin filtro de userId)

    // Resultado: TODOS los cupos de TODOS los usuarios B2B
    ({ id: 1, titulo: "Cupo Hotel Norte", userId: 123 },
    { id: 2, titulo: "Cupo Excursión Sur", userId: 456 },
    { id: 3, titulo: "Cupo Transfer Centro", userId: 789 })
  ];
```

---

## ✅ Checklist de Implementación

### Backend

- [x] Extender User model con campos B2B
- [x] Implementar método `calculateB2BRole()`
- [x] Crear middleware `checkOwnership.js`
- [x] Crear middleware `rolePermissions.js`
- [x] Actualizar controller `paquetes.controller.js`
- [x] Actualizar controller `cuposMercado.controller.js`
- [ ] Actualizar controllers restantes (alojamientos, autos, etc)
- [ ] Agregar campo `userId` a todos los modelos
- [ ] Aplicar middleware en todas las rutas

### Frontend

- [ ] Crear utilidad `rolePermissions.js` (frontend)
- [ ] Modificar `Dashboard.jsx` para mostrar según rol
- [ ] Ocultar secciones no permitidas
- [ ] Mostrar badges de rol y visibilidad
- [ ] Actualizar formularios para incluir campos B2B

### Testing

- [ ] Probar asignación de roles
- [ ] Probar filtros de ownership
- [ ] Probar excepción de Mercado de Cupos
- [ ] Probar permisos de edición/borrado
- [ ] Probar visibilidad en dashboard

---

## 🎓 Resumen

1. **Asignación de Rol**: Automática basada en `businessModel` + `serviceType`
2. **Visibilidad**: Ownership estricto en todos los módulos
3. **Excepción**: Mercado de Cupos visible globalmente para B2B
4. **Backend**: Filtros en controllers + middleware de verificación
5. **Frontend**: Dashboard dinámico según rol calculado

**El sistema está diseñado para:**

- ✅ Seguridad: Nadie ve datos ajenos (excepto cupos)
- ✅ Claridad: Roles calculados automáticamente
- ✅ Flexibilidad: Fácil agregar nuevos roles
- ✅ Escalabilidad: Basado en permisos, no en código hardcoded

---

**Fecha de implementación:** Febrero 2026  
**Versión:** 1.0  
**Estado:** Implementación parcial (80% backend, 0% frontend)

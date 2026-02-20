/**
 * Sistema de Permisos y Roles B2B - Frontend
 * Replica la lógica del backend para consistencia
 */

// Mapa de permisos por rol
export const rolePermissions = {
  // Administrador: acceso completo sin restricciones
  admin: {
    canPublish: true,
    canSeeOthersInCuposMercado: true,
    canSeeOthersInOtherModules: true, // Admins ven todo
    canEditOwn: true,
    canDeleteOwn: true,
    canEditOthers: true, // Solo admins
    canDeleteOthers: true, // Solo admins
    canAccessB2CModules: true,
    canAccessB2BModules: true,
    visibleToPassengers: true,
    dashboardModules: ["*"], // Asterisco = todos los módulos
  },

  // Super administrador: igual que admin
  sysadmin: {
    canPublish: true,
    canSeeOthersInCuposMercado: true,
    canSeeOthersInOtherModules: true,
    canEditOwn: true,
    canDeleteOwn: true,
    canEditOthers: true,
    canDeleteOthers: true,
    canAccessB2CModules: true,
    canAccessB2BModules: true,
    visibleToPassengers: true,
    dashboardModules: ["*"],
  },

  // AGENCIA: Vende a pasajeros finales como intermediario
  agencia: {
    canPublish: true,
    canSeeOthersInCuposMercado: true, // ⚠️ Excepción
    canSeeOthersInOtherModules: false, // Solo ve lo suyo
    canEditOwn: true,
    canDeleteOwn: true,
    canEditOthers: false,
    canDeleteOthers: false,
    canAccessB2CModules: true, // Ve paquetes para pasajeros
    canAccessB2BModules: false, // NO ve info interna de operadores
    visibleToPassengers: true, // Aparece en búsquedas B2C
    dashboardModules: [
      "reservas-anotador",
      "facturacion-anotador",
      "paquetes",
      "alojamientos",
      "autos",
      "circuitos",
      "cruceros",
      "excursiones",
      "salidas-grupales",
      "transfers",
      "trenes",
      "seguros",
      "mercado-cupos",
      "reportes",
      "ajustes",
    ],
  },

  // OPERADOR/PROVEEDOR: Vende a agencias y/o produce servicios
  operador: {
    canPublish: true,
    canSeeOthersInCuposMercado: true, // ⚠️ Excepción
    canSeeOthersInOtherModules: false, // Solo ve lo suyo
    canEditOwn: true,
    canDeleteOwn: true,
    canEditOthers: false,
    canDeleteOthers: false,
    canAccessB2CModules: false, // NO ve módulos B2C
    canAccessB2BModules: true, // Ve productos para agencias
    visibleToPassengers: false, // ⚠️ Nunca visible aunque venda directo
    dashboardModules: [
      "reservas-anotador",
      "facturacion-anotador",
      "paquetes",
      "alojamientos",
      "autos",
      "circuitos",
      "cruceros",
      "excursiones",
      "salidas-grupales",
      "transfers",
      "trenes",
      "seguros",
      "mercado-cupos",
      "reportes",
      "ajustes",
    ],
  },

  // Usuario B2C regular (pasajero)
  user: {
    canPublish: false,
    canSeeOthersInCuposMercado: true, // Pueden ver el mercado de cupos
    canSeeOthersInOtherModules: false,
    canEditOwn: true, // Solo sus reservas
    canDeleteOwn: false,
    canEditOthers: false,
    canDeleteOthers: false,
    canAccessB2CModules: true, // Ve servicios B2C
    canAccessB2BModules: false,
    visibleToPassengers: false,
    dashboardModules: [
      "misReservas",
      "misViajes",
      "perfil",
      "ajustes",
      "mercado-cupos",
    ],
  },

  // Cliente: usuario final registrado (B2C con cuenta)
  cliente: {
    canPublish: false,
    canSeeOthersInCuposMercado: true,
    canSeeOthersInOtherModules: false,
    canEditOwn: true,
    canDeleteOwn: false,
    canEditOthers: false,
    canDeleteOthers: false,
    canAccessB2CModules: true,
    canAccessB2BModules: false,
    visibleToPassengers: false,
    dashboardModules: [],
  },
};

/**
 * Obtiene el rol calculado del usuario
 * Prioriza calculatedRole (nuevo sistema) sobre role (legacy)
 */
export const getUserRole = (user) => {
  if (!user) return "user";

  // Admins y sysadmins mantienen su rol
  if (user.role === "admin" || user.role === "sysadmin") {
    return user.role;
  }

  // Cliente: usuario final registrado con cuenta B2C
  if (user.role === "cliente") {
    return "cliente";
  }

  // Para usuarios B2B, usar calculatedRole (automático basado en businessModel + serviceType)
  if (user.userType === "B2B" && user.calculatedRole) {
    return user.calculatedRole; // "agencia" o "operador"
  }

  // Fallback a rol legacy
  return user.role || "user";
};

/**
 * Obtiene los permisos del usuario según su rol
 */
export const getUserPermissions = (user) => {
  const role = getUserRole(user);
  return rolePermissions[role] || rolePermissions.user;
};

/**
 * Verifica si el usuario tiene un permiso específico
 */
export const hasPermission = (user, permission) => {
  const permissions = getUserPermissions(user);
  return permissions[permission] === true;
};

/**
 * Verifica si el usuario puede acceder a un módulo específico
 */
export const canAccessModule = (user, moduleName) => {
  const permissions = getUserPermissions(user);

  // Admins tienen acceso a todo
  if (permissions.dashboardModules.includes("*")) {
    return true;
  }

  return permissions.dashboardModules.includes(moduleName);
};

/**
 * Obtiene la lista de módulos visibles en el dashboard según el rol
 */
export const getDashboardModules = (user) => {
  const permissions = getUserPermissions(user);
  return permissions.dashboardModules;
};

/**
 * Verifica si el módulo es "Mercado de Cupos" (excepción global)
 */
export const isCuposMercadoModule = (moduleName) => {
  return (
    moduleName === "cuposMercado" ||
    moduleName === "mercado-cupos" ||
    moduleName === "cupos-mercado"
  );
};

/**
 * Determina si se debe filtrar por ownership en un módulo
 * Retorna false para admins y para Mercado de Cupos
 */
export const shouldFilterByOwnership = (user, moduleName) => {
  const role = getUserRole(user);

  // Admins y sysadmins ven todo
  if (role === "admin" || role === "sysadmin") {
    return false;
  }

  // Mercado de Cupos: NO filtrar (excepción global)
  if (isCuposMercadoModule(moduleName)) {
    return false;
  }

  // Todos los demás módulos: filtrar por ownership
  return true;
};

/**
 * Obtiene el nombre de visualización del rol
 */
export const getRoleDisplayName = (user) => {
  const role = getUserRole(user);

  const displayNames = {
    admin: "Administrador",
    sysadmin: "Super Administrador",
    agencia: "Agencia de Viajes",
    operador: "Operador / Proveedor",
    cliente: "Cliente",
    user: "Usuario",
  };

  return displayNames[role] || "Usuario";
};

/**
 * Obtiene el badge/emoji del rol
 */
export const getRoleBadge = (user) => {
  const role = getUserRole(user);

  const badges = {
    admin: "👑",
    sysadmin: "⚡",
    agencia: "🏢",
    operador: "🏭",
    cliente: "🙋",
    user: "👤",
  };

  return badges[role] || "👤";
};

/**
 * Verifica si el usuario es B2B (agencia u operador)
 */
export const isB2BUser = (user) => {
  if (!user) return false;
  return (
    user.userType === "B2B" ||
    ["agencia", "operador"].includes(getUserRole(user))
  );
};

/**
 * Verifica si el usuario es cliente (B2C con cuenta)
 */
export const isClienteUser = (user) => {
  if (!user) return false;
  const role = getUserRole(user);
  return role === "cliente" || role === "user";
};

/**
 * Verifica si el usuario es visible a los pasajeros
 */
export const isVisibleToPassengers = (user) => {
  if (!user) return false;

  // Usar el campo calculado si existe
  if (typeof user.isVisibleToPassengers === "boolean") {
    return user.isVisibleToPassengers;
  }

  // Fallback: solo agencias son visibles
  const role = getUserRole(user);
  return role === "agencia";
};

/**
 * Configuración de módulos del dashboard con metadata
 */
export const dashboardModulesConfig = {
  // Módulos de productos (catálogo minorista)
  paquetes: {
    id: "paquetes",
    title: "Paquetes",
    icon: "FaBullseye",
    section: "productos",
    roles: ["admin", "sysadmin", "agencia", "operador"],
  },
  alojamientos: {
    id: "alojamientos",
    title: "Alojamientos",
    icon: "FaHotel",
    section: "productos",
    roles: ["admin", "sysadmin", "agencia", "operador"],
  },
  autos: {
    id: "autos",
    title: "Autos",
    icon: "FaCar",
    section: "productos",
    roles: ["admin", "sysadmin", "agencia", "operador"],
  },
  circuitos: {
    id: "circuitos",
    title: "Circuitos",
    icon: "FaRoute",
    section: "productos",
    roles: ["admin", "sysadmin", "agencia", "operador"],
  },
  cruceros: {
    id: "cruceros",
    title: "Cruceros",
    icon: "FaShip",
    section: "productos",
    roles: ["admin", "sysadmin", "agencia", "operador"],
  },
  excursiones: {
    id: "excursiones",
    title: "Excursiones",
    icon: "FaHiking",
    section: "productos",
    roles: ["admin", "sysadmin", "agencia", "operador"],
  },
  "salidas-grupales": {
    id: "salidas-grupales",
    title: "Salidas Grupales",
    icon: "FaMapMarkedAlt",
    section: "productos",
    roles: ["admin", "sysadmin", "agencia", "operador"],
  },
  transfers: {
    id: "transfers",
    title: "Transfers",
    icon: "FaBus",
    section: "productos",
    roles: ["admin", "sysadmin", "agencia", "operador"],
  },
  trenes: {
    id: "trenes",
    title: "Trenes",
    icon: "FaTrain",
    section: "productos",
    roles: ["admin", "sysadmin", "agencia", "operador"],
  },
  seguros: {
    id: "seguros",
    title: "Seguros",
    icon: "FaShieldAlt",
    section: "productos",
    roles: ["admin", "sysadmin", "agencia", "operador"],
  },

  // Módulo especial: Mercado de Cupos (todos los usuarios)
  "mercado-cupos": {
    id: "mercado-cupos",
    title: "Comprar",
    icon: "FaStore",
    section: "mercado",
    roles: ["admin", "sysadmin", "agencia", "operador"],
  },

  // Anotadores internos (gestión simple de registros)
  "reservas-anotador": {
    id: "reservas-anotador",
    title: "Reservas (Anotador)",
    icon: "FaBook",
    section: "anotadores",
    roles: ["admin", "sysadmin", "agencia", "operador"],
  },
  "facturacion-anotador": {
    id: "facturacion-anotador",
    title: "Facturación (Anotador)",
    icon: "FaFileInvoice",
    section: "anotadores",
    roles: ["admin", "sysadmin", "agencia", "operador"],
  },

  // Módulos comunes
  reportes: {
    id: "reportes",
    title: "Reportes",
    icon: "FaChartBar",
    section: "gestion",
    roles: ["admin", "sysadmin", "agencia", "operador"],
  },
  "publicaciones-destacadas": {
    id: "publicaciones-destacadas",
    title: "Publicaciones Destacadas",
    icon: "FaStar",
    section: "gestion",
    roles: ["admin", "sysadmin"],
  },
  usuarios: {
    id: "usuarios",
    title: "Usuarios",
    icon: "FaUsers",
    section: "configuracion",
    roles: ["admin", "sysadmin"],
  },
  ajustes: {
    id: "ajustes",
    title: "Ajustes",
    icon: "FaCog",
    section: "configuracion",
    roles: ["admin", "sysadmin", "agencia", "operador", "user"],
  },
};

/**
 * Obtiene los módulos visibles para el usuario actual
 */
export const getVisibleModules = (user) => {
  const userRole = getUserRole(user);
  const modules = [];

  Object.values(dashboardModulesConfig).forEach((module) => {
    if (module.roles.includes(userRole) || module.roles.includes("*")) {
      modules.push(module);
    }
  });

  return modules;
};

/**
 * Agrupa módulos por sección
 */
export const getModulesBySection = (user) => {
  const visibleModules = getVisibleModules(user);
  const sections = {};

  visibleModules.forEach((module) => {
    if (!sections[module.section]) {
      sections[module.section] = [];
    }
    sections[module.section].push(module);
  });

  return sections;
};

export default {
  rolePermissions,
  getUserRole,
  getUserPermissions,
  hasPermission,
  canAccessModule,
  getDashboardModules,
  isCuposMercadoModule,
  shouldFilterByOwnership,
  getRoleDisplayName,
  getRoleBadge,
  isB2BUser,
  isClienteUser,
  isVisibleToPassengers,
  dashboardModulesConfig,
  getVisibleModules,
  getModulesBySection,
};

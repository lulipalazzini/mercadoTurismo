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
      "reservas",
      "paquetes",
      "alojamientos",
      "autos",
      "circuitos",
      "cruceros",
      "excursiones",
      "salidas-grupales",
      "transfers",
      "cuposMercado", // ⚠️ Excepción: ven todos los cupos
      "clientes",
      "facturacion",
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
      "reservasB2B", // Solo reservas de agencias
      "cuposMercado", // ⚠️ Excepción: ven todos los cupos
      "serviciosB2B", // Sus servicios para agencias
      "clientesB2B", // Solo clientes B2B (agencias)
      "facturacion",
      "reportes",
      "ajustes",
    ],
  },

  // Usuario B2C regular (pasajero)
  user: {
    canPublish: false,
    canSeeOthersInCuposMercado: false,
    canSeeOthersInOtherModules: false,
    canEditOwn: true, // Solo sus reservas
    canDeleteOwn: false,
    canEditOthers: false,
    canDeleteOthers: false,
    canAccessB2CModules: true, // Ve ofertas B2C
    canAccessB2BModules: false,
    visibleToPassengers: false,
    dashboardModules: ["misReservas", "misViajes", "perfil", "ajustes"],
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
    user: "👤",
  };

  return badges[role] || "👤";
};

/**
 * Verifica si el usuario es B2B (agencia u operador)
 */
export const isB2BUser = (user) => {
  if (!user) return false;
  return user.userType === "B2B" || ["agencia", "operador"].includes(getUserRole(user));
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
  // Módulos B2C (para agencias)
  reservas: {
    id: "reservas",
    title: "Reservas",
    icon: "FaClipboardList",
    section: "principal",
    roles: ["admin", "sysadmin", "agencia"],
  },
  paquetes: {
    id: "paquetes",
    title: "Paquetes",
    icon: "FaBullseye",
    section: "principal",
    roles: ["admin", "sysadmin", "agencia"],
  },
  clientes: {
    id: "clientes",
    title: "Clientes",
    icon: "FaUsers",
    section: "principal",
    roles: ["admin", "sysadmin", "agencia"],
  },
  alojamientos: {
    id: "alojamientos",
    title: "Alojamientos",
    icon: "FaHotel",
    section: "productos",
    roles: ["admin", "sysadmin", "agencia"],
  },
  autos: {
    id: "autos",
    title: "Autos",
    icon: "FaCar",
    section: "productos",
    roles: ["admin", "sysadmin", "agencia"],
  },
  circuitos: {
    id: "circuitos",
    title: "Circuitos",
    icon: "FaRoute",
    section: "productos",
    roles: ["admin", "sysadmin", "agencia"],
  },
  cruceros: {
    id: "cruceros",
    title: "Cruceros",
    icon: "FaShip",
    section: "productos",
    roles: ["admin", "sysadmin", "agencia"],
  },
  excursiones: {
    id: "excursiones",
    title: "Excursiones",
    icon: "FaHiking",
    section: "productos",
    roles: ["admin", "sysadmin", "agencia"],
  },
  "salidas-grupales": {
    id: "salidas-grupales",
    title: "Salidas Grupales",
    icon: "FaMapMarkedAlt",
    section: "productos",
    roles: ["admin", "sysadmin", "agencia"],
  },
  transfers: {
    id: "transfers",
    title: "Transfers",
    icon: "FaBus",
    section: "productos",
    roles: ["admin", "sysadmin", "agencia"],
  },

  // Módulo especial: Mercado de Cupos (todos los B2B)
  "mercado-cupos": {
    id: "mercado-cupos",
    title: "Mercado de Cupos",
    icon: "FaStore",
    section: "mercado",
    roles: ["admin", "sysadmin", "agencia", "operador"],
  },

  // Módulos B2B (para operadores)
  reservasB2B: {
    id: "reservasB2B",
    title: "Reservas B2B",
    icon: "FaClipboardList",
    section: "principal",
    roles: ["admin", "sysadmin", "operador"],
  },
  serviciosB2B: {
    id: "serviciosB2B",
    title: "Mis Servicios",
    icon: "FaCog",
    section: "principal",
    roles: ["admin", "sysadmin", "operador"],
  },
  clientesB2B: {
    id: "clientesB2B",
    title: "Clientes B2B",
    icon: "FaUsers",
    section: "principal",
    roles: ["admin", "sysadmin", "operador"],
  },

  // Módulos comunes
  facturacion: {
    id: "facturacion",
    title: "Facturación",
    icon: "FaDollarSign",
    section: "gestion",
    roles: ["admin", "sysadmin", "agencia", "operador"],
  },
  reportes: {
    id: "reportes",
    title: "Reportes",
    icon: "FaChartBar",
    section: "gestion",
    roles: ["admin", "sysadmin", "agencia", "operador"],
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
  isVisibleToPassengers,
  dashboardModulesConfig,
  getVisibleModules,
  getModulesBySection,
};

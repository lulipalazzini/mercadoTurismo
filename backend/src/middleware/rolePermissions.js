/**
 * Mapa de permisos por rol
 * Define qué puede hacer cada tipo de usuario B2B
 */

const rolePermissions = {
  // AGENCIA DE VIAJES
  // - Vende solo a pasajeros
  // - Solo intermediario
  // - Visible al pasajero
  agencia: {
    canPublish: true,
    canSeeOthersInCuposMercado: true, // Excepción
    canSeeOthersInOtherModules: false,
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
      "circuitos",
      "cruceros",
      "seguros",
      "cuposMercado", // Excepción: pueden ver todos
      "reservas",
      "clientes",
      "facturacion",
      "reportes",
      "ajustes",
    ],
  },

  // OPERADOR / PROVEEDOR
  // - Vende a agencias (o mixto)
  // - Produce servicios propios
  // - Nunca visible al pasajero
  operador: {
    canPublish: true,
    canSeeOthersInCuposMercado: true, // Excepción
    canSeeOthersInOtherModules: false,
    canEditOwn: true,
    canDeleteOwn: true,
    canAccessB2CModules: false, // NO ve módulos B2C
    canAccessB2BModules: true, // Ve productos para agencias
    visibleToPassengers: false, // Nunca visible aunque venda directo
    dashboardModules: [
      "paquetes",
      "alojamientos",
      "autos",
      "transfers",
      "excursiones",
      "salidasGrupales",
      "circuitos",
      "cruceros",
      "seguros",
      "cuposMercado", // Excepción: pueden ver todos
      "reservas",
      "clientes",
      "facturacion",
      "reportes",
      "ajustes",
    ],
  },

  // ADMIN (control total)
  admin: {
    canPublish: true,
    canSeeOthersInCuposMercado: true,
    canSeeOthersInOtherModules: true,
    canEditOwn: true,
    canEditOthers: true,
    canDeleteOwn: true,
    canDeleteOthers: true,
    canAccessB2CModules: true,
    canAccessB2BModules: true,
    visibleToPassengers: false,
    dashboardModules: ["*"], // Acceso total
  },

  // SYSADMIN (control total + configuración)
  sysadmin: {
    canPublish: true,
    canSeeOthersInCuposMercado: true,
    canSeeOthersInOtherModules: true,
    canEditOwn: true,
    canEditOthers: true,
    canDeleteOwn: true,
    canDeleteOthers: true,
    canAccessB2CModules: true,
    canAccessB2BModules: true,
    canManageUsers: true,
    canManageRoles: true,
    visibleToPassengers: false,
    dashboardModules: ["*"], // Acceso total
  },
};

/**
 * Obtiene los permisos de un usuario basado en su rol calculado
 */
const getUserPermissions = (user) => {
  // Usuarios B2B usan el calculatedRole
  let role = user.role;

  if (user.userType === "B2B" && user.calculatedRole) {
    role = user.calculatedRole;
  }

  return rolePermissions[role] || rolePermissions.operador;
};

/**
 * Verifica si un usuario tiene un permiso específico
 */
const hasPermission = (user, permission) => {
  const permissions = getUserPermissions(user);
  return permissions[permission] === true;
};

/**
 * Verifica si un usuario puede acceder a un módulo específico
 */
const canAccessModule = (user, moduleName) => {
  const permissions = getUserPermissions(user);

  // Admins tienen acceso a todo
  if (permissions.dashboardModules.includes("*")) {
    return true;
  }

  return permissions.dashboardModules.includes(moduleName);
};

/**
 * Verifica si el módulo actual es Mercado de Cupos
 * (donde la excepción de visibilidad global aplica)
 */
const isCuposMercadoModule = (moduleName) => {
  return moduleName === "cuposMercado" || moduleName === "cupos-mercado";
};

/**
 * Determina si se debe aplicar filtro de ownership
 * basado en el módulo y el rol del usuario
 */
const shouldFilterByOwnership = (user, moduleName) => {
  // Admins no tienen filtro
  if (user.role === "admin" || user.role === "sysadmin") {
    return false;
  }

  // Mercado de Cupos: no filtrar (todos ven todos)
  if (isCuposMercadoModule(moduleName)) {
    return false;
  }

  // En todos los demás módulos: filtrar por ownership
  return true;
};

/**
 * Obtiene los módulos visibles para un usuario en el dashboard
 */
const getDashboardModules = (user) => {
  const permissions = getUserPermissions(user);
  return permissions.dashboardModules;
};

module.exports = {
  rolePermissions,
  getUserPermissions,
  hasPermission,
  canAccessModule,
  isCuposMercadoModule,
  shouldFilterByOwnership,
  getDashboardModules,
};

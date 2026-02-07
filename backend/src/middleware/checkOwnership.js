/**
 * Middleware para verificar ownership (propiedad) de recursos
 * Asegura que los usuarios B2B solo puedan acceder a sus propias publicaciones
 */

const User = require("../models/User.model");

/**
 * Verifica que el usuario autenticado sea el propietario del recurso
 * O que tenga permisos de admin
 */
const checkOwnership = (Model, idParam = "id") => {
  return async (req, res, next) => {
    try {
      const resourceId = req.params[idParam];
      const userId = req.user.id;

      // Admins y sysadmins pueden acceder a todo
      if (req.user.role === "admin" || req.user.role === "sysadmin") {
        return next();
      }

      // Buscar el recurso
      const resource = await Model.findByPk(resourceId);

      if (!resource) {
        return res.status(404).json({
          success: false,
          message: "Recurso no encontrado",
        });
      }

      // Verificar ownership (userId u ownerId según el modelo)
      const resourceOwnerId = resource.userId || resource.ownerId;

      if (!resourceOwnerId) {
        // Si el recurso no tiene owner, permitir (datos legacy)
        console.warn(
          `[OWNERSHIP] Recurso ${Model.name}#${resourceId} sin owner`,
        );
        return next();
      }

      if (resourceOwnerId !== userId) {
        return res.status(403).json({
          success: false,
          message: "No tienes permiso para acceder a este recurso",
          error: "FORBIDDEN",
        });
      }

      next();
    } catch (error) {
      console.error("[OWNERSHIP] Error:", error);
      res.status(500).json({
        success: false,
        message: "Error al verificar permisos",
        error: error.message,
      });
    }
  };
};

/**
 * Filtra automáticamente queries para que solo devuelvan
 * recursos del usuario autenticado
 *
 * USO: Aplicar en rutas GET /recursos
 */
const filterByOwnership = (req, res, next) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;

    // Admins y sysadmins ven todo
    if (userRole === "admin" || userRole === "sysadmin") {
      req.ownershipFilter = {};
      return next();
    }

    // Usuarios B2B solo ven lo suyo
    if (req.user.userType === "B2B") {
      req.ownershipFilter = {
        userId: userId, // o ownerId según el modelo
      };
    } else {
      // Usuarios B2C no deberían acceder a endpoints B2B
      req.ownershipFilter = {};
    }

    next();
  } catch (error) {
    console.error("[OWNERSHIP] Error al filtrar:", error);
    res.status(500).json({
      success: false,
      message: "Error al aplicar filtros de acceso",
      error: error.message,
    });
  }
};

/**
 * Middleware especial para Mercado de Cupos
 * NO aplica filtros de ownership, todos los usuarios B2B pueden ver todos los cupos
 */
const allowAllForCuposMercado = (req, res, next) => {
  // No aplicar ningún filtro de ownership
  req.ownershipFilter = {};
  req.skipOwnershipCheck = true;
  next();
};

/**
 * Verifica que el usuario tenga un rol específico
 */
const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "No autenticado",
      });
    }

    const userRole = req.user.calculatedRole || req.user.role;

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: `Acceso denegado. Se requiere rol: ${allowedRoles.join(" o ")}`,
        userRole: userRole,
      });
    }

    next();
  };
};

/**
 * Verifica que el usuario sea B2B
 */
const requireB2B = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "No autenticado",
    });
  }

  if (req.user.userType !== "B2B") {
    return res.status(403).json({
      success: false,
      message: "Acceso restringido a usuarios B2B",
    });
  }

  next();
};

module.exports = {
  checkOwnership,
  filterByOwnership,
  allowAllForCuposMercado,
  requireRole,
  requireB2B,
};

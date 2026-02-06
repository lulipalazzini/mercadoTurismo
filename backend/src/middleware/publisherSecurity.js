/**
 * MIDDLEWARE DE SEGURIDAD: Control estricto por publicador
 * 
 * Este middleware implementa seguridad real a nivel de backend:
 * - Filtra automáticamente registros por published_by_user_id
 * - Verifica ownership antes de permitir edición/eliminación
 * - Admin puede ver/editar todo
 * - Agencia/Operador solo ve/edita lo suyo
 * 
 * ⚠️ CRÍTICO: Esta es la capa de seguridad real del sistema.
 * No se puede confiar solo en el frontend.
 */

/**
 * Determina si el usuario es administrador
 */
const isAdmin = (user) => {
  return user && (user.role === "admin" || user.role === "sysadmin");
};

/**
 * Middleware: Agrega filtro automático de published_by_user_id
 * 
 * Uso:
 * router.get('/api/paquetes', authenticateToken, filterByPublisher, getPaquetes);
 * 
 * Excepción: Mercado de Cupos (todos ven todo)
 */
const filterByPublisher = (req, res, next) => {
  // Si no hay usuario autenticado, bloquear acceso
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Autenticación requerida",
    });
  }

  // Admin ve todo
  if (isAdmin(req.user)) {
    req.showAllRecords = true;
    return next();
  }

  // Para agencias/operadores: filtrar por su ID
  req.showAllRecords = false;
  req.publisherFilter = {
    published_by_user_id: req.user.id,
  };

  next();
};

/**
 * Middleware especial para Mercado de Cupos
 * Todos pueden VER todo, pero solo el dueño o admin puede EDITAR
 */
const filterByPublisherCuposMercado = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Autenticación requerida",
    });
  }

  // En Mercado de Cupos, todos pueden ver todo
  req.showAllRecords = true;
  req.cuposMercadoMode = true; // Flag especial para validación de edición

  next();
};

/**
 * Verifica que el usuario tenga permiso para acceder a un recurso específico
 * 
 * Uso en controladores antes de UPDATE/DELETE:
 * 
 * const canAccess = await verifyResourceOwnership(
 *   Paquete, 
 *   paqueteId, 
 *   req.user
 * );
 * 
 * if (!canAccess) {
 *   return res.status(403).json({ message: "No autorizado" });
 * }
 */
const verifyResourceOwnership = async (Model, resourceId, user) => {
  // Admin puede acceder a todo
  if (isAdmin(user)) {
    return true;
  }

  try {
    // Buscar el recurso
    const resource = await Model.findByPk(resourceId);

    if (!resource) {
      return false; // Recurso no existe
    }

    // Verificar ownership
    return resource.published_by_user_id === user.id;
  } catch (error) {
    console.error("Error verificando ownership:", error);
    return false;
  }
};

/**
 * Middleware: Verifica ownership antes de permitir modificación
 * 
 * Uso:
 * router.put('/api/paquetes/:id', 
 *   authenticateToken, 
 *   checkOwnership(Paquete), 
 *   updatePaquete
 * );
 */
const checkOwnership = (Model) => {
  return async (req, res, next) => {
    const resourceId = req.params.id;

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Autenticación requerida",
      });
    }

    // Admin puede editar todo
    if (isAdmin(req.user)) {
      return next();
    }

    // Verificar ownership
    const hasAccess = await verifyResourceOwnership(Model, resourceId, req.user);

    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: "No tienes permiso para modificar este recurso",
      });
    }

    next();
  };
};

/**
 * Middleware especial para Cupos Mercado: todos ven, solo dueño edita
 */
const checkOwnershipCuposMercado = (Model) => {
  return async (req, res, next) => {
    const resourceId = req.params.id;

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Autenticación requerida",
      });
    }

    // Admin puede editar todo
    if (isAdmin(req.user)) {
      return next();
    }

    // En Mercado de Cupos: verificar ownership solo para edición
    const hasAccess = await verifyResourceOwnership(Model, resourceId, req.user);

    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: "Solo puedes editar tus propios cupos. Este cupo pertenece a otro usuario.",
      });
    }

    next();
  };
};

/**
 * Helper: Construye cláusula WHERE con filtro de publicador
 * 
 * Uso en controladores:
 * const whereClause = buildWhereClause(req, { activo: true });
 */
const buildWhereClause = (req, additionalFilters = {}) => {
  const whereClause = { ...additionalFilters };

  // Si no debe mostrar todos los registros, aplicar filtro
  if (!req.showAllRecords && req.publisherFilter) {
    Object.assign(whereClause, req.publisherFilter);
  }

  return whereClause;
};

/**
 * Intercepta creación para asignar automáticamente published_by_user_id
 * 
 * Uso:
 * router.post('/api/paquetes', 
 *   authenticateToken, 
 *   autoAssignPublisher, 
 *   createPaquete
 * );
 */
const autoAssignPublisher = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Autenticación requerida",
    });
  }

  // Asignar automáticamente el ID del usuario logueado
  // ⚠️ NUNCA confiar en el frontend para este valor
  req.body.published_by_user_id = req.user.id;

  // Remover otros campos de usuario que puedan venir del frontend
  delete req.body.userId;
  delete req.body.vendedorId;
  delete req.body.createdBy;

  next();
};

/**
 * Logging de acceso a recursos (opcional, para auditoría)
 */
const logResourceAccess = (resourceType) => {
  return (req, res, next) => {
    const userId = req.user ? req.user.id : "anónimo";
    const userRole = req.user ? req.user.role : "guest";
    const resourceId = req.params.id || "listado";

    console.log(`🔍 [${resourceType}] Usuario ${userId} (${userRole}) accediendo a recurso ${resourceId}`);

    next();
  };
};

module.exports = {
  // Funciones de utilidad
  isAdmin,
  verifyResourceOwnership,
  buildWhereClause,

  // Middlewares principales
  filterByPublisher,
  filterByPublisherCuposMercado,
  checkOwnership,
  checkOwnershipCuposMercado,
  autoAssignPublisher,

  // Logging (opcional)
  logResourceAccess,
};

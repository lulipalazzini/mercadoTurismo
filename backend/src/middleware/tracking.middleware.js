const ClickTracking = require("../models/ClickTracking.model");
const ActivityLog = require("../models/ActivityLog.model");

/**
 * Middleware para registrar clicks en publicaciones
 * Debe ser llamado manualmente desde los endpoints que necesiten tracking
 */
const trackClick = async (req, res, next) => {
  try {
    const {
      modulo,
      publicacionId,
      publicacionTitulo,
      propietarioId,
      propietarioEmpresa,
      accion = "view",
      contexto = "dashboard",
    } = req.body.trackingData || {};

    if (!modulo || !publicacionId) {
      console.warn("⚠️ [TRACKING] Datos insuficientes para registrar click");
      return next();
    }

    const clickData = {
      userId: req.user?.id || null,
      empresaId: req.user?.empresaId || null,
      modulo,
      publicacionId,
      publicacionTitulo,
      propietarioId,
      propietarioEmpresa,
      accion,
      contexto,
      ipAddress: req.ip || req.connection.remoteAddress,
      userAgent: req.headers["user-agent"],
      metadata: req.body.metadata || null,
    };

    await ClickTracking.create(clickData);
    console.log(`✅ [TRACKING] Click registrado: ${modulo}/${publicacionId}`);

    next();
  } catch (error) {
    console.error("❌ [TRACKING] Error al registrar click:", error);
    // No fallar la request original si falla el tracking
    next();
  }
};

/**
 * Función helper para registrar clicks desde cualquier parte del código
 */
const logClick = async (data) => {
  try {
    await ClickTracking.create(data);
    console.log(`✅ [TRACKING] Click registrado: ${data.modulo}/${data.publicacionId}`);
  } catch (error) {
    console.error("❌ [TRACKING] Error al registrar click:", error);
  }
};

/**
 * Middleware para registrar actividad (create, update, delete)
 * Intercepta automáticamente las acciones según el método HTTP y ruta
 */
const trackActivity = (modulo) => {
  return async (req, res, next) => {
    // Guardar el método original de json para interceptar la respuesta
    const originalJson = res.json;

    res.json = function (data) {
      // Determinar la acción según el método HTTP
      let accion = null;
      if (req.method === "POST") accion = "create";
      else if (req.method === "PUT" || req.method === "PATCH") accion = "update";
      else if (req.method === "DELETE") accion = "delete";

      // Solo registrar si es una acción relevante y fue exitosa
      if (accion && res.statusCode >= 200 && res.statusCode < 300) {
        const activityData = {
          userId: req.user?.id,
          userName: req.user?.nombre || req.user?.email,
          empresaId: req.user?.empresaId || null,
          empresaNombre: req.user?.razonSocial || null,
          modulo,
          accion,
          entidadId: data?.id || req.params.id || null,
          entidadTitulo:
            data?.titulo ||
            data?.nombre ||
            data?.destino ||
            data?.ciudad ||
            data?.origen ||
            null,
          descripcion: `${accion} en ${modulo}`,
          cambios: accion === "update" ? req.body : null,
          ipAddress: req.ip || req.connection.remoteAddress,
          userAgent: req.headers["user-agent"],
          metadata: {
            method: req.method,
            path: req.path,
            statusCode: res.statusCode,
          },
        };

        // Registrar actividad de forma asíncrona sin bloquear la respuesta
        ActivityLog.create(activityData)
          .then(() => {
            console.log(
              `✅ [ACTIVITY] Registrado: ${accion} en ${modulo} por usuario ${req.user?.id}`,
            );
          })
          .catch((error) => {
            console.error("❌ [ACTIVITY] Error al registrar actividad:", error);
          });
      }

      // Llamar al método json original
      return originalJson.call(this, data);
    };

    next();
  };
};

/**
 * Función helper para registrar actividad desde cualquier parte del código
 */
const logActivity = async (data) => {
  try {
    await ActivityLog.create(data);
    console.log(
      `✅ [ACTIVITY] Registrado: ${data.accion} en ${data.modulo} por usuario ${data.userId}`,
    );
  } catch (error) {
    console.error("❌ [ACTIVITY] Error al registrar actividad:", error);
  }
};

/**
 * Registrar login de usuario
 */
const logLogin = async (user, req) => {
  try {
    await ActivityLog.create({
      userId: user.id,
      userName: user.nombre || user.email,
      empresaId: user.empresaId || null,
      empresaNombre: user.razonSocial || null,
      modulo: "auth",
      accion: "login",
      descripcion: "Inicio de sesión exitoso",
      ipAddress: req.ip || req.connection.remoteAddress,
      userAgent: req.headers["user-agent"],
    });
    console.log(`✅ [ACTIVITY] Login registrado para usuario ${user.id}`);
  } catch (error) {
    console.error("❌ [ACTIVITY] Error al registrar login:", error);
  }
};

/**
 * Registrar logout de usuario
 */
const logLogout = async (user, req) => {
  try {
    await ActivityLog.create({
      userId: user.id,
      userName: user.nombre || user.email,
      empresaId: user.empresaId || null,
      empresaNombre: user.razonSocial || null,
      modulo: "auth",
      accion: "logout",
      descripcion: "Cierre de sesión",
      ipAddress: req.ip || req.connection.remoteAddress,
      userAgent: req.headers["user-agent"],
    });
    console.log(`✅ [ACTIVITY] Logout registrado para usuario ${user.id}`);
  } catch (error) {
    console.error("❌ [ACTIVITY] Error al registrar logout:", error);
  }
};

module.exports = {
  trackClick,
  logClick,
  trackActivity,
  logActivity,
  logLogin,
  logLogout,
};

const User = require("../models/User.model");
const Cliente = require("../models/Cliente.model");
const ClickTracking = require("../models/ClickTracking.model");
const ActivityLog = require("../models/ActivityLog.model");
const Paquete = require("../models/Paquete.model");
const Alojamiento = require("../models/Alojamiento.model");
const Auto = require("../models/Auto.model");
const Transfer = require("../models/Transfer.model");
const Crucero = require("../models/Crucero.model");
const Excursion = require("../models/Excursion.model");
const SalidaGrupal = require("../models/SalidaGrupal.model");
const Circuito = require("../models/Circuito.model");
const CupoMercado = require("../models/CupoMercado.model");
const { Op } = require("sequelize");
const { sequelize } = require("../config/database");

/**
 * 👥 GESTIÓN DE USUARIOS - ADMIN ONLY
 */

// Obtener listado completo de usuarios con estadísticas
const getAllUsersWithStats = async (req, res) => {
  try {
    console.log("\n👥 [ADMIN] Obteniendo usuarios con estadísticas...");

    const users = await User.findAll({
      attributes: {
        exclude: ["password", "passwordAdmin"],
        include: [
          // Contar publicaciones por módulo usando subconsultas
          [
            sequelize.literal(`(
              SELECT COUNT(*)
              FROM Paquetes
              WHERE Paquetes.userId = User.id
            )`),
            "totalPaquetes",
          ],
          [
            sequelize.literal(`(
              SELECT COUNT(*)
              FROM alojamientos
              WHERE alojamientos.userId = User.id
            )`),
            "totalAlojamientos",
          ],
          [
            sequelize.literal(`(
              SELECT COUNT(*)
              FROM autos
              WHERE autos.userId = User.id
            )`),
            "totalAutos",
          ],
          [
            sequelize.literal(`(
              SELECT COUNT(*)
              FROM transfers
              WHERE transfers.userId = User.id
            )`),
            "totalTransfers",
          ],
          [
            sequelize.literal(`(
              SELECT COUNT(*)
              FROM cruceros
              WHERE cruceros.userId = User.id
            )`),
            "totalCruceros",
          ],
          [
            sequelize.literal(`(
              SELECT COUNT(*)
              FROM excursiones
              WHERE excursiones.userId = User.id
            )`),
            "totalExcursiones",
          ],
          [
            sequelize.literal(`(
              SELECT COUNT(*)
              FROM salidas_grupales
              WHERE salidas_grupales.userId = User.id
            )`),
            "totalSalidasGrupales",
          ],
          [
            sequelize.literal(`(
              SELECT COUNT(*)
              FROM circuitos
              WHERE circuitos.userId = User.id
            )`),
            "totalCircuitos",
          ],
          [
            sequelize.literal(`(
              SELECT COUNT(*)
              FROM cupos_mercado
              WHERE cupos_mercado.usuarioVendedorId = User.id
            )`),
            "totalCuposMercado",
          ],
          // Total de publicaciones
          [
            sequelize.literal(`(
              (SELECT COUNT(*) FROM Paquetes WHERE Paquetes.userId = User.id) +
              (SELECT COUNT(*) FROM alojamientos WHERE alojamientos.userId = User.id) +
              (SELECT COUNT(*) FROM autos WHERE autos.userId = User.id) +
              (SELECT COUNT(*) FROM transfers WHERE transfers.userId = User.id) +
              (SELECT COUNT(*) FROM cruceros WHERE cruceros.userId = User.id) +
              (SELECT COUNT(*) FROM excursiones WHERE excursiones.userId = User.id) +
              (SELECT COUNT(*) FROM salidas_grupales WHERE salidas_grupales.userId = User.id) +
              (SELECT COUNT(*) FROM circuitos WHERE circuitos.userId = User.id) +
              (SELECT COUNT(*) FROM cupos_mercado WHERE cupos_mercado.usuarioVendedorId = User.id)
            )`),
            "totalPublicaciones",
          ],
          // Total de clientes
          [
            sequelize.literal(`(
              SELECT COUNT(*)
              FROM Clientes
              WHERE Clientes.userId = User.id
            )`),
            "totalClientes",
          ],
          // Total de clicks recibidos en sus publicaciones
          [
            sequelize.literal(`(
              SELECT COUNT(*)
              FROM click_tracking
              WHERE click_tracking.propietarioId = User.id
            )`),
            "totalClicksRecibidos",
          ],
          // Última actividad
          [
            sequelize.literal(`(
              SELECT MAX(createdAt)
              FROM activity_log
              WHERE activity_log.userId = User.id
            )`),
            "ultimaActividad",
          ],
        ],
      },
      order: [["createdAt", "DESC"]],
    });

    console.log(`✅ Encontrados ${users.length} usuarios`);
    res.json(users);
  } catch (error) {
    console.error("❌ Error al obtener usuarios:", error);
    res.status(500).json({
      message: "Error al obtener usuarios",
      error: error.message,
    });
  }
};

// Obtener detalle completo de un usuario específico
const getUserDetail = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`\n👤 [ADMIN] Obteniendo detalle del usuario ${id}...`);

    // Obtener usuario con datos básicos
    const user = await User.findByPk(id, {
      attributes: { exclude: ["password", "passwordAdmin"] },
    });

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Obtener publicaciones por módulo
    const [
      paquetes,
      alojamientos,
      autos,
      transfers,
      cruceros,
      excursiones,
      salidasGrupales,
      circuitos,
      cuposMercado,
    ] = await Promise.all([
      Paquete.count({ where: { userId: id } }),
      Alojamiento.count({ where: { userId: id } }),
      Auto.count({ where: { userId: id } }),
      Transfer.count({ where: { userId: id } }),
      Crucero.count({ where: { userId: id } }),
      Excursion.count({ where: { userId: id } }),
      SalidaGrupal.count({ where: { userId: id } }),
      Circuito.count({ where: { userId: id } }),
      CupoMercado.count({ where: { usuarioVendedorId: id } }),
    ]);

    const publicaciones = {
      paquetes,
      alojamientos,
      autos,
      transfers,
      cruceros,
      excursiones,
      salidasGrupales,
      circuitos,
      cuposMercado,
      total:
        paquetes +
        alojamientos +
        autos +
        transfers +
        cruceros +
        excursiones +
        salidasGrupales +
        circuitos +
        cuposMercado,
    };

    // Obtener clientes del usuario
    const totalClientes = await Cliente.count({ where: { userId: id } });

    // Obtener clicks totales recibidos en sus publicaciones
    const clicksRecibidos = await ClickTracking.count({
      where: { propietarioId: id },
    });

    // Obtener clicks por módulo
    const clicksPorModulo = await ClickTracking.findAll({
      attributes: [
        "modulo",
        [sequelize.fn("COUNT", sequelize.col("id")), "total"],
      ],
      where: { propietarioId: id },
      group: ["modulo"],
      raw: true,
    });

    // Obtener clicks por publicación (top 10)
    const clicksPorPublicacion = await ClickTracking.findAll({
      attributes: [
        "modulo",
        "publicacionId",
        "publicacionTitulo",
        [sequelize.fn("COUNT", sequelize.col("id")), "clicks"],
      ],
      where: { propietarioId: id },
      group: ["modulo", "publicacionId", "publicacionTitulo"],
      order: [[sequelize.literal("clicks"), "DESC"]],
      limit: 10,
      raw: true,
    });

    // Obtener actividad reciente (últimos 20 registros)
    const actividadReciente = await ActivityLog.findAll({
      where: { userId: id },
      order: [["createdAt", "DESC"]],
      limit: 20,
    });

    // Obtener estadísticas de actividad
    const actividadStats = await ActivityLog.findAll({
      attributes: [
        "accion",
        "modulo",
        [sequelize.fn("COUNT", sequelize.col("id")), "total"],
      ],
      where: { userId: id },
      group: ["accion", "modulo"],
      raw: true,
    });

    const detalle = {
      usuario: user,
      publicaciones,
      clientes: totalClientes,
      clicks: {
        total: clicksRecibidos,
        porModulo: clicksPorModulo,
        porPublicacion: clicksPorPublicacion,
      },
      actividad: {
        reciente: actividadReciente,
        estadisticas: actividadStats,
      },
    };

    console.log("✅ Detalle del usuario obtenido");
    res.json(detalle);
  } catch (error) {
    console.error("❌ Error al obtener detalle del usuario:", error);
    res.status(500).json({
      message: "Error al obtener detalle del usuario",
      error: error.message,
    });
  }
};

/**
 * 🔍 BUSCADOR AVANZADO DE USUARIOS
 */
const searchUsers = async (req, res) => {
  try {
    const { q } = req.query;
    console.log(`\n🔍 [ADMIN] Buscando usuarios: "${q}"`);

    if (!q || q.trim().length === 0) {
      return res.status(400).json({ message: "Query de búsqueda requerido" });
    }

    const searchTerm = `%${q.trim()}%`;

    const users = await User.findAll({
      attributes: { exclude: ["password", "passwordAdmin"] },
      where: {
        [Op.or]: [
          { nombre: { [Op.like]: searchTerm } },
          { email: { [Op.like]: searchTerm } },
          { razonSocial: { [Op.like]: searchTerm } },
          { telefono: { [Op.like]: searchTerm } },
        ],
      },
      order: [["nombre", "ASC"]],
    });

    console.log(`✅ Encontrados ${users.length} usuarios`);
    res.json(users);
  } catch (error) {
    console.error("❌ Error en búsqueda de usuarios:", error);
    res.status(500).json({
      message: "Error al buscar usuarios",
      error: error.message,
    });
  }
};

/**
 * 📊 REPORTES - ADMIN
 */

// Reporte general de usuarios
const getUsuariosReport = async (req, res) => {
  try {
    const { fechaInicio, fechaFin, userId, empresaId } = req.query;
    console.log("\n📊 [ADMIN] Generando reporte de usuarios...");

    const whereClause = {};
    const activityWhere = {};

    // Filtros opcionales
    if (fechaInicio) {
      whereClause.createdAt = { [Op.gte]: new Date(fechaInicio) };
      activityWhere.createdAt = { [Op.gte]: new Date(fechaInicio) };
    }
    if (fechaFin) {
      whereClause.createdAt = {
        ...whereClause.createdAt,
        [Op.lte]: new Date(fechaFin),
      };
      activityWhere.createdAt = {
        ...activityWhere.createdAt,
        [Op.lte]: new Date(fechaFin),
      };
    }
    if (userId) {
      whereClause.id = userId;
      activityWhere.userId = userId;
    }

    // Obtener usuarios con estadísticas
    const usuarios = await User.findAll({
      attributes: {
        exclude: ["password", "passwordAdmin"],
      },
      where: whereClause,
    });

    // Obtener actividad agrupada por usuario
    const actividad = await ActivityLog.findAll({
      attributes: [
        "userId",
        "accion",
        "modulo",
        [sequelize.fn("COUNT", sequelize.col("id")), "total"],
      ],
      where: activityWhere,
      group: ["userId", "accion", "modulo"],
      raw: true,
    });

    // Obtener clicks agrupados por propietario
    const clicks = await ClickTracking.findAll({
      attributes: [
        "propietarioId",
        "modulo",
        [sequelize.fn("COUNT", sequelize.col("id")), "total"],
      ],
      where: activityWhere.createdAt
        ? { createdAt: activityWhere.createdAt }
        : {},
      group: ["propietarioId", "modulo"],
      raw: true,
    });

    const reporte = {
      usuarios,
      actividad,
      clicks,
      resumen: {
        totalUsuarios: usuarios.length,
        totalActividad: actividad.reduce(
          (sum, a) => sum + parseInt(a.total),
          0,
        ),
        totalClicks: clicks.reduce((sum, c) => sum + parseInt(c.total), 0),
      },
    };

    console.log("✅ Reporte de usuarios generado");
    res.json(reporte);
  } catch (error) {
    console.error("❌ Error al generar reporte de usuarios:", error);
    res.status(500).json({
      message: "Error al generar reporte",
      error: error.message,
    });
  }
};

// Reporte de clientes
const getClientesReport = async (req, res) => {
  try {
    const { fechaInicio, fechaFin, userId } = req.query;
    console.log("\n📊 [ADMIN] Generando reporte de clientes...");

    const whereClause = {};

    if (fechaInicio) {
      whereClause.createdAt = { [Op.gte]: new Date(fechaInicio) };
    }
    if (fechaFin) {
      whereClause.createdAt = {
        ...whereClause.createdAt,
        [Op.lte]: new Date(fechaFin),
      };
    }
    if (userId) {
      whereClause.userId = userId;
    }

    const clientes = await Cliente.findAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: "usuario",
          attributes: ["id", "nombre", "email", "razonSocial"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    // Agrupar por usuario
    const clientesPorUsuario = await Cliente.findAll({
      attributes: [
        "userId",
        [sequelize.fn("COUNT", sequelize.col("Cliente.id")), "total"],
      ],
      where: whereClause,
      include: [
        {
          model: User,
          as: "usuario",
          attributes: ["nombre", "email", "razonSocial"],
        },
      ],
      group: ["userId", "usuario.id"],
      raw: false,
    });

    const reporte = {
      clientes,
      porUsuario: clientesPorUsuario,
      resumen: {
        totalClientes: clientes.length,
        totalUsuariosConClientes: clientesPorUsuario.length,
      },
    };

    console.log("✅ Reporte de clientes generado");
    res.json(reporte);
  } catch (error) {
    console.error("❌ Error al generar reporte de clientes:", error);
    res.status(500).json({
      message: "Error al generar reporte de clientes",
      error: error.message,
    });
  }
};

// Reporte de clicks detallado
const getClicksReport = async (req, res) => {
  try {
    const { fechaInicio, fechaFin, userId, modulo } = req.query;
    console.log("\n📊 [ADMIN] Generando reporte de clicks...");

    const whereClause = {};

    if (fechaInicio) {
      whereClause.createdAt = { [Op.gte]: new Date(fechaInicio) };
    }
    if (fechaFin) {
      whereClause.createdAt = {
        ...whereClause.createdAt,
        [Op.lte]: new Date(fechaFin),
      };
    }
    if (userId) {
      whereClause.propietarioId = userId;
    }
    if (modulo) {
      whereClause.modulo = modulo;
    }

    // Total de clicks
    const totalClicks = await ClickTracking.count({ where: whereClause });

    // Clicks por módulo
    const clicksPorModulo = await ClickTracking.findAll({
      attributes: [
        "modulo",
        [sequelize.fn("COUNT", sequelize.col("id")), "total"],
      ],
      where: whereClause,
      group: ["modulo"],
      raw: true,
    });

    // Clicks por publicación (top 20)
    const clicksPorPublicacion = await ClickTracking.findAll({
      attributes: [
        "modulo",
        "publicacionId",
        "publicacionTitulo",
        "propietarioId",
        "propietarioEmpresa",
        [sequelize.fn("COUNT", sequelize.col("id")), "clicks"],
      ],
      where: whereClause,
      group: [
        "modulo",
        "publicacionId",
        "publicacionTitulo",
        "propietarioId",
        "propietarioEmpresa",
      ],
      order: [[sequelize.literal("clicks"), "DESC"]],
      limit: 20,
      raw: true,
    });

    // Clicks por propietario
    const clicksPorPropietario = await ClickTracking.findAll({
      attributes: [
        "propietarioId",
        "propietarioEmpresa",
        [sequelize.fn("COUNT", sequelize.col("id")), "total"],
      ],
      where: whereClause,
      group: ["propietarioId", "propietarioEmpresa"],
      order: [[sequelize.literal("total"), "DESC"]],
      raw: true,
    });

    const reporte = {
      resumen: {
        totalClicks,
        clicksPorModulo,
        clicksPorPublicacion,
        clicksPorPropietario,
      },
    };

    console.log("✅ Reporte de clicks generado");
    res.json(reporte);
  } catch (error) {
    console.error("❌ Error al generar reporte de clicks:", error);
    res.status(500).json({
      message: "Error al generar reporte de clicks",
      error: error.message,
    });
  }
};

// Reporte de actividad
const getActivityReport = async (req, res) => {
  try {
    const { fechaInicio, fechaFin, userId, modulo, accion } = req.query;
    console.log("\n📊 [ADMIN] Generando reporte de actividad...");

    const whereClause = {};

    if (fechaInicio) {
      whereClause.createdAt = { [Op.gte]: new Date(fechaInicio) };
    }
    if (fechaFin) {
      whereClause.createdAt = {
        ...whereClause.createdAt,
        [Op.lte]: new Date(fechaFin),
      };
    }
    if (userId) {
      whereClause.userId = userId;
    }
    if (modulo) {
      whereClause.modulo = modulo;
    }
    if (accion) {
      whereClause.accion = accion;
    }

    // Actividad reciente
    const actividad = await ActivityLog.findAll({
      where: whereClause,
      order: [["createdAt", "DESC"]],
      limit: 100,
    });

    // Por módulo y acción
    const porModuloAccion = await ActivityLog.findAll({
      attributes: [
        "modulo",
        "accion",
        [sequelize.fn("COUNT", sequelize.col("id")), "total"],
      ],
      where: whereClause,
      group: ["modulo", "accion"],
      raw: true,
    });

    // Por usuario
    const porUsuario = await ActivityLog.findAll({
      attributes: [
        "userId",
        "userName",
        "empresaNombre",
        [sequelize.fn("COUNT", sequelize.col("id")), "total"],
      ],
      where: whereClause,
      group: ["userId", "userName", "empresaNombre"],
      order: [[sequelize.literal("total"), "DESC"]],
      raw: true,
    });

    const reporte = {
      actividad,
      resumen: {
        total: actividad.length,
        porModuloAccion,
        porUsuario,
      },
    };

    console.log("✅ Reporte de actividad generado");
    res.json(reporte);
  } catch (error) {
    console.error("❌ Error al generar reporte de actividad:", error);
    res.status(500).json({
      message: "Error al generar reporte de actividad",
      error: error.message,
    });
  }
};

/**
 * 🔐 ACTIVACIÓN/DESACTIVACIÓN DE USUARIOS - ADMIN ONLY
 */

// Cambiar estado activo de un usuario
const cambiarEstadoUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const { activo } = req.body;

    console.log(
      `\n🔐 [ADMIN] Cambio de estado - Usuario: ${id}, Activo: ${activo}`,
    );

    // Validar que activo sea booleano
    if (typeof activo !== "boolean") {
      return res.status(400).json({
        message: "El campo 'activo' debe ser true o false",
      });
    }

    // Buscar usuario
    const usuario = await User.findByPk(id, {
      attributes: { exclude: ["password", "passwordAdmin"] },
    });

    if (!usuario) {
      return res.status(404).json({
        message: "Usuario no encontrado",
      });
    }

    // No permitir desactivar a admin o sysadmin
    if (!activo && (usuario.role === "admin" || usuario.role === "sysadmin")) {
      return res.status(403).json({
        message: "No se puede desactivar a un administrador del sistema",
      });
    }

    // Actualizar estado
    usuario.activo = activo;
    await usuario.save();

    // Registrar en activity_log
    await ActivityLog.create({
      userId: req.user.id, // Admin que realiza la acción
      accion: activo ? "USUARIO_ACTIVADO" : "USUARIO_DESACTIVADO",
      modulo: "usuarios",
      detalles: JSON.stringify({
        usuarioAfectado: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        role: usuario.role,
      }),
    });

    console.log(
      `✅ Usuario ${activo ? "activado" : "desactivado"}: ${usuario.nombre}`,
    );

    res.json({
      message: `Usuario ${activo ? "activado" : "desactivado"} exitosamente`,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        activo: usuario.activo,
      },
    });
  } catch (error) {
    console.error("❌ Error al cambiar estado del usuario:", error);
    res.status(500).json({
      message: "Error al cambiar estado del usuario",
      error: error.message,
    });
  }
};

module.exports = {
  getAllUsersWithStats,
  getUserDetail,
  searchUsers,
  getUsuariosReport,
  getClientesReport,
  getClicksReport,
  getActivityReport,
  cambiarEstadoUsuario,
};

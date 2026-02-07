const ReservaAnotador = require("../models/ReservaAnotador.model");
const { Op } = require("sequelize");

// Obtener todas las reservas del anotador
// ADMIN ve todas, otros ven solo las propias
const getReservasAnotador = async (req, res) => {
  try {
    console.log("\n📖 [RESERVAS ANOTADOR] Obteniendo reservas...");
    console.log(`   Usuario ID: ${req.user.id}`);
    console.log(`   Role: ${req.user.role}`);

    // ADMIN puede ver todas sin restricciones
    const isAdmin = req.user.role === "admin" || req.user.role === "sysadmin";

    console.log(`   Es Admin: ${isAdmin}`);

    // Construir query
    const whereClause = isAdmin
      ? {} // Admin: sin filtro
      : { userId: req.user.id }; // Otros: solo propias

    console.log("   Consultando base de datos...");
    const reservas = await ReservaAnotador.findAll({
      where: whereClause,
      order: [
        ["fecha", "DESC"],
        ["createdAt", "DESC"],
      ],
    });
    console.log(
      `   Reservas encontradas: ${reservas.length} ${isAdmin ? "(TODAS - Admin)" : "(propias)"}`,
    );

    console.log("✅ [RESERVAS ANOTADOR] Reservas obtenidas exitosamente");
    res.json(reservas);
  } catch (error) {
    console.error("❌ [RESERVAS ANOTADOR] Error en getReservasAnotador:");
    console.error("   Mensaje:", error.message);
    console.error("   Stack:", error.stack);
    res.status(500).json({
      message: "Error al obtener reservas",
      error: error.message,
    });
  }
};

// Crear nueva reserva en el anotador
const createReservaAnotador = async (req, res) => {
  try {
    console.log("\n➕ [RESERVAS ANOTADOR] Creando nueva reserva...");
    console.log(`   Usuario ID: ${req.user.id}`);

    const { cliente, servicio, fecha, monto, moneda, estado, observaciones } =
      req.body;

    // Validar campos requeridos
    if (!cliente || !servicio || !fecha || monto === undefined) {
      console.log("❌ Campos requeridos faltantes");
      return res.status(400).json({
        message:
          "Todos los campos son requeridos: cliente, servicio, fecha, monto",
      });
    }

    // Validar monto positivo
    if (monto < 0) {
      return res.status(400).json({
        message: "El monto debe ser mayor o igual a 0",
      });
    }

    // Validar estado
    if (estado && !["pendiente", "confirmada", "cancelada"].includes(estado)) {
      return res.status(400).json({
        message: "El estado debe ser: pendiente, confirmada o cancelada",
      });
    }

    const reserva = await ReservaAnotador.create({
      userId: req.user.id,
      cliente,
      servicio,
      fecha,
      monto,
      moneda: moneda || "ARS",
      estado: estado || "pendiente",
      observaciones: observaciones || null,
    });

    console.log(`✅ Reserva creada con ID: ${reserva.id}`);
    res.status(201).json(reserva);
  } catch (error) {
    console.error("❌ [RESERVAS ANOTADOR] Error en createReservaAnotador:");
    console.error("   Mensaje:", error.message);
    console.error("   Stack:", error.stack);
    res.status(500).json({
      message: "Error al crear reserva",
      error: error.message,
    });
  }
};

// Actualizar reserva del anotador
const updateReservaAnotador = async (req, res) => {
  try {
    console.log("\n✏️ [RESERVAS ANOTADOR] Actualizando reserva...");
    const { id } = req.params;
    console.log(`   Reserva ID: ${id}`);
    console.log(`   Usuario ID: ${req.user.id}`);

    const reserva = await ReservaAnotador.findByPk(id);

    if (!reserva) {
      console.log("❌ Reserva no encontrada");
      return res.status(404).json({
        message: "Reserva no encontrada",
      });
    }

    // ADMIN puede editar cualquier registro, otros solo los propios
    const isAdmin = req.user.role === "admin" || req.user.role === "sysadmin";

    if (!isAdmin && reserva.userId !== req.user.id) {
      console.log("❌ Usuario sin permisos para editar esta reserva");
      return res.status(403).json({
        message: "No tienes permisos para editar esta reserva",
      });
    }

    const { cliente, servicio, fecha, monto, moneda, estado, observaciones } =
      req.body;

    // Validar monto si se actualiza
    if (monto !== undefined && monto < 0) {
      return res.status(400).json({
        message: "El monto debe ser mayor o igual a 0",
      });
    }

    // Validar estado si se actualiza
    if (estado && !["pendiente", "confirmada", "cancelada"].includes(estado)) {
      return res.status(400).json({
        message: "El estado debe ser: pendiente, confirmada o cancelada",
      });
    }

    await reserva.update({
      cliente: cliente !== undefined ? cliente : reserva.cliente,
      servicio: servicio !== undefined ? servicio : reserva.servicio,
      fecha: fecha !== undefined ? fecha : reserva.fecha,
      monto: monto !== undefined ? monto : reserva.monto,
      moneda: moneda !== undefined ? moneda : reserva.moneda,
      estado: estado !== undefined ? estado : reserva.estado,
      observaciones:
        observaciones !== undefined ? observaciones : reserva.observaciones,
    });

    console.log(`✅ Reserva ${id} actualizada exitosamente`);
    res.json(reserva);
  } catch (error) {
    console.error("❌ [RESERVAS ANOTADOR] Error en updateReservaAnotador:");
    console.error("   Mensaje:", error.message);
    console.error("   Stack:", error.stack);
    res.status(500).json({
      message: "Error al actualizar reserva",
      error: error.message,
    });
  }
};

// Eliminar reserva del anotador
const deleteReservaAnotador = async (req, res) => {
  try {
    console.log("\n🗑️ [RESERVAS ANOTADOR] Eliminando reserva...");
    const { id } = req.params;
    console.log(`   Reserva ID: ${id}`);
    console.log(`   Usuario ID: ${req.user.id}`);

    const reserva = await ReservaAnotador.findByPk(id);

    if (!reserva) {
      console.log("❌ Reserva no encontrada");
      return res.status(404).json({
        message: "Reserva no encontrada",
      });
    }

    // ADMIN puede eliminar cualquier registro, otros solo los propios
    const isAdmin = req.user.role === "admin" || req.user.role === "sysadmin";

    if (!isAdmin && reserva.userId !== req.user.id) {
      console.log("❌ Usuario sin permisos para eliminar esta reserva");
      return res.status(403).json({
        message: "No tienes permisos para eliminar esta reserva",
      });
    }

    await reserva.destroy();

    console.log(`✅ Reserva ${id} eliminada exitosamente`);
    res.json({ message: "Reserva eliminada exitosamente" });
  } catch (error) {
    console.error("❌ [RESERVAS ANOTADOR] Error en deleteReservaAnotador:");
    console.error("   Mensaje:", error.message);
    console.error("   Stack:", error.stack);
    res.status(500).json({
      message: "Error al eliminar reserva",
      error: error.message,
    });
  }
};

module.exports = {
  getReservasAnotador,
  createReservaAnotador,
  updateReservaAnotador,
  deleteReservaAnotador,
};

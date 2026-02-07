const FacturacionAnotador = require("../models/FacturacionAnotador.model");
const { Op } = require("sequelize");

// Obtener todas las facturas del anotador
// ADMIN ve todas, otros ven solo las propias
const getFacturacionAnotador = async (req, res) => {
  try {
    console.log("\n💰 [FACTURACION ANOTADOR] Obteniendo facturas...");
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
    const facturas = await FacturacionAnotador.findAll({
      where: whereClause,
      order: [
        ["fecha", "DESC"],
        ["createdAt", "DESC"],
      ],
    });
    console.log(
      `   Facturas encontradas: ${facturas.length} ${isAdmin ? "(TODAS - Admin)" : "(propias)"}`,
    );

    console.log("✅ [FACTURACION ANOTADOR] Facturas obtenidas exitosamente");
    res.json(facturas);
  } catch (error) {
    console.error("❌ [FACTURACION ANOTADOR] Error en getFacturacionAnotador:");
    console.error("   Mensaje:", error.message);
    console.error("   Stack:", error.stack);
    res.status(500).json({
      message: "Error al obtener facturas",
      error: error.message,
    });
  }
};

// Crear nueva factura en el anotador
const createFacturacionAnotador = async (req, res) => {
  try {
    console.log("\n➕ [FACTURACION ANOTADOR] Creando nueva factura...");
    console.log(`   Usuario ID: ${req.user.id}`);

    const { cliente, concepto, fecha, importe, moneda, estado, observaciones } =
      req.body;

    // Validar campos requeridos
    if (!cliente || !concepto || !fecha || importe === undefined) {
      console.log("❌ Campos requeridos faltantes");
      return res.status(400).json({
        message:
          "Todos los campos son requeridos: cliente, concepto, fecha, importe",
      });
    }

    // Validar importe positivo
    if (importe < 0) {
      return res.status(400).json({
        message: "El importe debe ser mayor o igual a 0",
      });
    }

    // Validar estado
    if (estado && !["pendiente", "emitida", "cobrada"].includes(estado)) {
      return res.status(400).json({
        message: "El estado debe ser: pendiente, emitida o cobrada",
      });
    }

    const factura = await FacturacionAnotador.create({
      userId: req.user.id,
      cliente,
      concepto,
      fecha,
      importe,
      moneda: moneda || "ARS",
      estado: estado || "pendiente",
      observaciones: observaciones || null,
    });

    console.log(`✅ Factura creada con ID: ${factura.id}`);
    res.status(201).json(factura);
  } catch (error) {
    console.error(
      "❌ [FACTURACION ANOTADOR] Error en createFacturacionAnotador:",
    );
    console.error("   Mensaje:", error.message);
    console.error("   Stack:", error.stack);
    res.status(500).json({
      message: "Error al crear factura",
      error: error.message,
    });
  }
};

// Actualizar factura del anotador
const updateFacturacionAnotador = async (req, res) => {
  try {
    console.log("\n✏️ [FACTURACION ANOTADOR] Actualizando factura...");
    const { id } = req.params;
    console.log(`   Factura ID: ${id}`);
    console.log(`   Usuario ID: ${req.user.id}`);

    const factura = await FacturacionAnotador.findByPk(id);

    if (!factura) {
      console.log("❌ Factura no encontrada");
      return res.status(404).json({
        message: "Factura no encontrada",
      });
    }

    // ADMIN puede editar cualquier registro, otros solo los propios
    const isAdmin = req.user.role === "admin" || req.user.role === "sysadmin";

    if (!isAdmin && factura.userId !== req.user.id) {
      console.log("❌ Usuario sin permisos para editar esta factura");
      return res.status(403).json({
        message: "No tienes permisos para editar esta factura",
      });
    }

    const { cliente, concepto, fecha, importe, moneda, estado, observaciones } =
      req.body;

    // Validar importe si se actualiza
    if (importe !== undefined && importe < 0) {
      return res.status(400).json({
        message: "El importe debe ser mayor o igual a 0",
      });
    }

    // Validar estado si se actualiza
    if (estado && !["pendiente", "emitida", "cobrada"].includes(estado)) {
      return res.status(400).json({
        message: "El estado debe ser: pendiente, emitida o cobrada",
      });
    }

    await factura.update({
      cliente: cliente !== undefined ? cliente : factura.cliente,
      concepto: concepto !== undefined ? concepto : factura.concepto,
      fecha: fecha !== undefined ? fecha : factura.fecha,
      importe: importe !== undefined ? importe : factura.importe,
      moneda: moneda !== undefined ? moneda : factura.moneda,
      estado: estado !== undefined ? estado : factura.estado,
      observaciones:
        observaciones !== undefined ? observaciones : factura.observaciones,
    });

    console.log(`✅ Factura ${id} actualizada exitosamente`);
    res.json(factura);
  } catch (error) {
    console.error(
      "❌ [FACTURACION ANOTADOR] Error en updateFacturacionAnotador:",
    );
    console.error("   Mensaje:", error.message);
    console.error("   Stack:", error.stack);
    res.status(500).json({
      message: "Error al actualizar factura",
      error: error.message,
    });
  }
};

// Eliminar factura del anotador
const deleteFacturacionAnotador = async (req, res) => {
  try {
    console.log("\n🗑️ [FACTURACION ANOTADOR] Eliminando factura...");
    const { id } = req.params;
    console.log(`   Factura ID: ${id}`);
    console.log(`   Usuario ID: ${req.user.id}`);

    const factura = await FacturacionAnotador.findByPk(id);

    if (!factura) {
      console.log("❌ Factura no encontrada");
      return res.status(404).json({
        message: "Factura no encontrada",
      });
    }

    // ADMIN puede eliminar cualquier registro, otros solo los propios
    const isAdmin = req.user.role === "admin" || req.user.role === "sysadmin";

    if (!isAdmin && factura.userId !== req.user.id) {
      console.log("❌ Usuario sin permisos para eliminar esta factura");
      return res.status(403).json({
        message: "No tienes permisos para eliminar esta factura",
      });
    }

    await factura.destroy();

    console.log(`✅ Factura ${id} eliminada exitosamente`);
    res.json({ message: "Factura eliminada exitosamente" });
  } catch (error) {
    console.error(
      "❌ [FACTURACION ANOTADOR] Error en deleteFacturacionAnotador:",
    );
    console.error("   Mensaje:", error.message);
    console.error("   Stack:", error.stack);
    res.status(500).json({
      message: "Error al eliminar factura",
      error: error.message,
    });
  }
};

module.exports = {
  getFacturacionAnotador,
  createFacturacionAnotador,
  updateFacturacionAnotador,
  deleteFacturacionAnotador,
};

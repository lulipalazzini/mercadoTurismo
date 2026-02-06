const Reserva = require("../models/Reserva.model");
const Cliente = require("../models/Cliente.model");
const Paquete = require("../models/Paquete.model");
const { sequelize } = require("../config/database");
const { fn, col } = require("sequelize");
const { shouldFilterByOwnership } = require("../middleware/rolePermissions");

const getEstadisticas = async (req, res) => {
  try {
    const whereClause = {};

    // APLICAR FILTROS DE OWNERSHIP
    if (req.user && shouldFilterByOwnership(req.user, "facturacion")) {
      whereClause.createdById = req.user.id;
      console.log(`   Filtrando facturación del usuario: ${req.user.id}`);
    } else if (req.user) {
      console.log(`   Usuario ${req.user.role}: Ver toda la facturación`);
    }

    const totalReservas = await Reserva.count({ where: whereClause });
    const reservasConfirmadas = await Reserva.count({
      where: { ...whereClause, estado: "confirmada" },
    });
    const reservasPendientes = await Reserva.count({
      where: { ...whereClause, estado: "pendiente" },
    });

    const ingresosResult = await Reserva.findOne({
      where: { ...whereClause, pagoRealizado: true },
      attributes: [[fn("SUM", col("precioTotal")), "total"]],
      raw: true,
    });

    const ingresosPorMes = await Reserva.findAll({
      where: { ...whereClause, pagoRealizado: true },
      attributes: [
        [fn("STRFTIME", "%m", col("fechaReserva")), "mes"],
        [fn("STRFTIME", "%Y", col("fechaReserva")), "año"],
        [fn("SUM", col("precioTotal")), "total"],
        [fn("COUNT", col("id")), "cantidad"],
      ],
      group: [
        fn("STRFTIME", "%Y", col("fechaReserva")),
        fn("STRFTIME", "%m", col("fechaReserva")),
      ],
      order: [
        [fn("STRFTIME", "%Y", col("fechaReserva")), "DESC"],
        [fn("STRFTIME", "%m", col("fechaReserva")), "DESC"],
      ],
      raw: true,
    });

    res.json({
      totalReservas,
      reservasConfirmadas,
      reservasPendientes,
      ingresosTotal: ingresosResult?.total || 0,
      ingresosPorMes,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener estadísticas", error: error.message });
  }
};

const getFacturas = async (req, res) => {
  try {
    const facturas = await Reserva.findAll({
      where: { pagoRealizado: true },
      include: [
        { model: Cliente, as: "cliente" },
        { model: Paquete, as: "paquete" },
      ],
      order: [["fechaReserva", "DESC"]],
    });
    res.json(facturas);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener facturas", error: error.message });
  }
};

module.exports = {
  getEstadisticas,
  getFacturas,
};

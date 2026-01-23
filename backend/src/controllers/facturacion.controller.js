const Reserva = require("../models/Reserva.model");
const Cliente = require("../models/Cliente.model");
const Paquete = require("../models/Paquete.model");
const { sequelize } = require("../config/database");
const { fn, col } = require("sequelize");

const getEstadisticas = async (req, res) => {
  try {
    const totalReservas = await Reserva.count();
    const reservasConfirmadas = await Reserva.count({
      where: { estado: "confirmada" },
    });
    const reservasPendientes = await Reserva.count({
      where: { estado: "pendiente" },
    });

    const ingresosResult = await Reserva.findOne({
      where: { pagoRealizado: true },
      attributes: [[fn("SUM", col("precioTotal")), "total"]],
      raw: true,
    });

    const ingresosPorMes = await Reserva.findAll({
      where: { pagoRealizado: true },
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
  getFacturas
};

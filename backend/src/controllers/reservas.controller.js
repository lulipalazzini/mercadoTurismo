const Reserva = require("../models/Reserva.model");
const Paquete = require("../models/Paquete.model");
const Cliente = require("../models/Cliente.model");
const { shouldFilterByOwnership } = require("../middleware/rolePermissions");

const getReservas = async (req, res) => {
  try {
    const whereClause = {};

    // APLICAR FILTROS DE OWNERSHIP
    if (req.user && shouldFilterByOwnership(req.user, "reservas")) {
      whereClause.createdById = req.user.id;
      console.log(`   Filtrando reservas del usuario: ${req.user.id}`);
    } else if (req.user) {
      console.log(`   Usuario ${req.user.role}: Ver todas las reservas`);
    }

    const reservas = await Reserva.findAll({
      where: whereClause,
      include: [
        { model: Cliente, as: "cliente" },
        { model: Paquete, as: "paquete" },
      ],
      order: [["createdAt", "DESC"]],
    });
    res.json(reservas);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener reservas", error: error.message });
  }
};

const getReserva = async (req, res) => {
  try {
    const reserva = await Reserva.findByPk(req.params.id, {
      include: [
        { model: Cliente, as: "cliente" },
        { model: Paquete, as: "paquete" },
      ],
    });
    if (!reserva) {
      return res.status(404).json({ message: "Reserva no encontrada" });
    }
    res.json(reserva);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener reserva", error: error.message });
  }
};

const createReserva = async (req, res) => {
  try {
    const { paqueteId, numeroPersonas } = req.body;

    // Verificar disponibilidad del paquete
    const paquete = await Paquete.findByPk(paqueteId);
    if (!paquete) {
      return res.status(404).json({ message: "Paquete no encontrado" });
    }

    if (paquete.cupoDisponible < numeroPersonas) {
      return res
        .status(400)
        .json({ message: "No hay suficiente cupo disponible" });
    }

    // Crear reserva
    const reserva = await Reserva.create({
      ...req.body,
      precioTotal: paquete.precio * numeroPersonas,
      createdById: req.user.id,
    });

    // Actualizar cupo disponible
    await paquete.update({
      cupoDisponible: paquete.cupoDisponible - numeroPersonas,
    });

    // Recargar con las relaciones
    await reserva.reload({
      include: [
        { model: Cliente, as: "cliente" },
        { model: Paquete, as: "paquete" },
      ],
    });

    res.status(201).json({ message: "Reserva creada exitosamente", reserva });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al crear reserva", error: error.message });
  }
};

const updateReserva = async (req, res) => {
  try {
    const reserva = await Reserva.findByPk(req.params.id);

    if (!reserva) {
      return res.status(404).json({ message: "Reserva no encontrada" });
    }

    await reserva.update(req.body);
    await reserva.reload({
      include: [
        { model: Cliente, as: "cliente" },
        { model: Paquete, as: "paquete" },
      ],
    });

    res.json({ message: "Reserva actualizada exitosamente", reserva });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al actualizar reserva", error: error.message });
  }
};

const cancelReserva = async (req, res) => {
  try {
    const reserva = await Reserva.findByPk(req.params.id);
    if (!reserva) {
      return res.status(404).json({ message: "Reserva no encontrada" });
    }

    if (reserva.estado === "cancelada") {
      return res.status(400).json({ message: "La reserva ya está cancelada" });
    }

    // Devolver cupo al paquete
    const paquete = await Paquete.findByPk(reserva.paqueteId);
    if (paquete) {
      await paquete.update({
        cupoDisponible: paquete.cupoDisponible + reserva.numeroPersonas,
      });
    }

    await reserva.update({ estado: "cancelada" });

    res.json({ message: "Reserva cancelada exitosamente", reserva });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al cancelar reserva", error: error.message });
  }
};

module.exports = {
  getReservas,
  getReserva,
  createReserva,
  updateReserva,
  cancelReserva,
};

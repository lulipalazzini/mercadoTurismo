import CupoMercado from "../models/CupoMercado.model.js";
import { Op } from "sequelize";

export const getCuposMercado = async (req, res) => {
  try {
    const cupos = await CupoMercado.findAll({
      order: [["createdAt", "DESC"]],
    });

    // Actualizar estados según fecha de vencimiento
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    for (const cupo of cupos) {
      const vencimiento = new Date(cupo.fechaVencimiento);
      if (vencimiento < hoy && cupo.estado === "disponible") {
        await cupo.update({ estado: "vencido" });
      }
      if (cupo.cantidad === 0 && cupo.estado === "disponible") {
        await cupo.update({ estado: "vendido" });
      }
    }

    res.json(cupos);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener cupos", error: error.message });
  }
};

export const getCupoMercado = async (req, res) => {
  try {
    const cupo = await CupoMercado.findByPk(req.params.id);
    if (!cupo) {
      return res.status(404).json({ message: "Cupo no encontrado" });
    }
    res.json(cupo);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener cupo", error: error.message });
  }
};

export const createCupoMercado = async (req, res) => {
  try {
    const cupo = await CupoMercado.create({
      ...req.body,
      usuarioVendedorId: req.userId, // Del token JWT
    });
    res.status(201).json({ message: "Cupo publicado exitosamente", cupo });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al crear cupo", error: error.message });
  }
};

export const updateCupoMercado = async (req, res) => {
  try {
    const cupo = await CupoMercado.findByPk(req.params.id);
    if (!cupo) {
      return res.status(404).json({ message: "Cupo no encontrado" });
    }

    // Si se está comprando el cupo (cantidad = 0), registrar el comprador
    if (req.body.cantidad === 0 && !cupo.usuarioCompradorId) {
      req.body.usuarioCompradorId = req.userId;
      req.body.estado = "vendido";
    }

    await cupo.update(req.body);
    res.json({ message: "Cupo actualizado exitosamente", cupo });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al actualizar cupo", error: error.message });
  }
};

export const deleteCupoMercado = async (req, res) => {
  try {
    const cupo = await CupoMercado.findByPk(req.params.id);
    if (!cupo) {
      return res.status(404).json({ message: "Cupo no encontrado" });
    }
    await cupo.destroy();
    res.json({ message: "Cupo eliminado exitosamente" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al eliminar cupo", error: error.message });
  }
};

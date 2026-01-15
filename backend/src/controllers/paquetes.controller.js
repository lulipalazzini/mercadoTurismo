import Paquete from "../models/Paquete.model.js";
import User from "../models/User.model.js";

export const getPaquetes = async (req, res) => {
  try {
    const paquetes = await Paquete.findAll({
      order: [["createdAt", "DESC"]],
    });
    res.json(paquetes);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener paquetes", error: error.message });
  }
};

export const getPaquete = async (req, res) => {
  try {
    const paquete = await Paquete.findByPk(req.params.id);
    if (!paquete) {
      return res.status(404).json({ message: "Paquete no encontrado" });
    }
    res.json(paquete);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener paquete", error: error.message });
  }
};

export const createPaquete = async (req, res) => {
  try {
    const paquete = await Paquete.create({
      ...req.body,
      cupoDisponible: req.body.cupoMaximo,
      createdBy: req.user.id, // Guardar quién creó el paquete
    });
    res.status(201).json({ message: "Paquete creado exitosamente", paquete });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al crear paquete", error: error.message });
  }
};

export const updatePaquete = async (req, res) => {
  try {
    const paquete = await Paquete.findByPk(req.params.id);
    if (!paquete) {
      return res.status(404).json({ message: "Paquete no encontrado" });
    }
    await paquete.update(req.body);
    res.json({ message: "Paquete actualizado exitosamente", paquete });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al actualizar paquete", error: error.message });
  }
};

export const deletePaquete = async (req, res) => {
  try {
    const paquete = await Paquete.findByPk(req.params.id);
    if (!paquete) {
      return res.status(404).json({ message: "Paquete no encontrado" });
    }
    await paquete.destroy();
    res.json({ message: "Paquete eliminado exitosamente" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al eliminar paquete", error: error.message });
  }
};

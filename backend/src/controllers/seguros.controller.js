import Seguro from "../models/Seguro.model.js";
import User from "../models/User.model.js";

export const getSeguros = async (req, res) => {
  try {
    const seguros = await Seguro.findAll({
      where: { activo: true },
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: User,
          as: "vendedor",
          attributes: ["id", "nombre", "email", "razonSocial", "role"],
        },
      ],
    });
    res.json(seguros);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener seguros", error: error.message });
  }
};

export const getSeguro = async (req, res) => {
  try {
    const seguro = await Seguro.findByPk(req.params.id);
    if (!seguro) {
      return res.status(404).json({ message: "Seguro no encontrado" });
    }
    res.json(seguro);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener seguro", error: error.message });
  }
};

export const createSeguro = async (req, res) => {
  try {
    const seguro = await Seguro.create(req.body);
    res.status(201).json({ message: "Seguro creado exitosamente", seguro });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al crear seguro", error: error.message });
  }
};

export const updateSeguro = async (req, res) => {
  try {
    const seguro = await Seguro.findByPk(req.params.id);
    if (!seguro) {
      return res.status(404).json({ message: "Seguro no encontrado" });
    }
    await seguro.update(req.body);
    res.json({ message: "Seguro actualizado exitosamente", seguro });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al actualizar seguro", error: error.message });
  }
};

export const deleteSeguro = async (req, res) => {
  try {
    const seguro = await Seguro.findByPk(req.params.id);
    if (!seguro) {
      return res.status(404).json({ message: "Seguro no encontrado" });
    }
    await seguro.update({ activo: false });
    res.json({ message: "Seguro desactivado exitosamente" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al eliminar seguro", error: error.message });
  }
};

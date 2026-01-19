import Crucero from "../models/Crucero.model.js";
import User from "../models/User.model.js";

export const getCruceros = async (req, res) => {
  try {
    const cruceros = await Crucero.findAll({
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
    res.json(cruceros);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener cruceros", error: error.message });
  }
};

export const getCrucero = async (req, res) => {
  try {
    const crucero = await Crucero.findByPk(req.params.id);
    if (!crucero) {
      return res.status(404).json({ message: "Crucero no encontrado" });
    }
    res.json(crucero);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener crucero", error: error.message });
  }
};

export const createCrucero = async (req, res) => {
  try {
    const crucero = await Crucero.create(req.body);
    res.status(201).json({ message: "Crucero creado exitosamente", crucero });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al crear crucero", error: error.message });
  }
};

export const updateCrucero = async (req, res) => {
  try {
    const crucero = await Crucero.findByPk(req.params.id);
    if (!crucero) {
      return res.status(404).json({ message: "Crucero no encontrado" });
    }
    await crucero.update(req.body);
    res.json({ message: "Crucero actualizado exitosamente", crucero });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al actualizar crucero", error: error.message });
  }
};

export const deleteCrucero = async (req, res) => {
  try {
    const crucero = await Crucero.findByPk(req.params.id);
    if (!crucero) {
      return res.status(404).json({ message: "Crucero no encontrado" });
    }
    await crucero.update({ activo: false });
    res.json({ message: "Crucero desactivado exitosamente" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al eliminar crucero", error: error.message });
  }
};

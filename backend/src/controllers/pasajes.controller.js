import Pasaje from "../models/Pasaje.model.js";

export const getPasajes = async (req, res) => {
  try {
    const pasajes = await Pasaje.findAll({
      where: { activo: true },
      order: [["createdAt", "DESC"]],
    });
    res.json(pasajes);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener pasajes", error: error.message });
  }
};

export const getPasaje = async (req, res) => {
  try {
    const pasaje = await Pasaje.findByPk(req.params.id);
    if (!pasaje) {
      return res.status(404).json({ message: "Pasaje no encontrado" });
    }
    res.json(pasaje);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener pasaje", error: error.message });
  }
};

export const createPasaje = async (req, res) => {
  try {
    const pasaje = await Pasaje.create(req.body);
    res.status(201).json({ message: "Pasaje creado exitosamente", pasaje });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al crear pasaje", error: error.message });
  }
};

export const updatePasaje = async (req, res) => {
  try {
    const pasaje = await Pasaje.findByPk(req.params.id);
    if (!pasaje) {
      return res.status(404).json({ message: "Pasaje no encontrado" });
    }
    await pasaje.update(req.body);
    res.json({ message: "Pasaje actualizado exitosamente", pasaje });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al actualizar pasaje", error: error.message });
  }
};

export const deletePasaje = async (req, res) => {
  try {
    const pasaje = await Pasaje.findByPk(req.params.id);
    if (!pasaje) {
      return res.status(404).json({ message: "Pasaje no encontrado" });
    }
    await pasaje.update({ activo: false });
    res.json({ message: "Pasaje desactivado exitosamente" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al eliminar pasaje", error: error.message });
  }
};

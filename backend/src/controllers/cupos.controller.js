import Cupo from "../models/Cupo.model.js";

export const getCupos = async (req, res) => {
  try {
    const cupos = await Cupo.findAll({
      order: [["createdAt", "DESC"]],
    });
    res.json(cupos);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener cupos", error: error.message });
  }
};

export const getCupo = async (req, res) => {
  try {
    const cupo = await Cupo.findByPk(req.params.id);
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

export const createCupo = async (req, res) => {
  try {
    const cupo = await Cupo.create({
      ...req.body,
      cuposDisponibles: req.body.cuposMaximos,
    });
    res.status(201).json({ message: "Cupo creado exitosamente", cupo });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al crear cupo", error: error.message });
  }
};

export const updateCupo = async (req, res) => {
  try {
    const cupo = await Cupo.findByPk(req.params.id);
    if (!cupo) {
      return res.status(404).json({ message: "Cupo no encontrado" });
    }
    await cupo.update(req.body);
    res.json({ message: "Cupo actualizado exitosamente", cupo });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al actualizar cupo", error: error.message });
  }
};

export const deleteCupo = async (req, res) => {
  try {
    const cupo = await Cupo.findByPk(req.params.id);
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

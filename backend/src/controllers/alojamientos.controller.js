import Alojamiento from "../models/Alojamiento.model.js";

export const getAlojamientos = async (req, res) => {
  try {
    const alojamientos = await Alojamiento.findAll({
      where: { activo: true },
      order: [["createdAt", "DESC"]],
    });
    res.json(alojamientos);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener alojamientos", error: error.message });
  }
};

export const getAlojamiento = async (req, res) => {
  try {
    const alojamiento = await Alojamiento.findByPk(req.params.id);
    if (!alojamiento) {
      return res.status(404).json({ message: "Alojamiento no encontrado" });
    }
    res.json(alojamiento);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener alojamiento", error: error.message });
  }
};

export const createAlojamiento = async (req, res) => {
  try {
    const alojamiento = await Alojamiento.create(req.body);
    res
      .status(201)
      .json({ message: "Alojamiento creado exitosamente", alojamiento });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al crear alojamiento", error: error.message });
  }
};

export const updateAlojamiento = async (req, res) => {
  try {
    const alojamiento = await Alojamiento.findByPk(req.params.id);
    if (!alojamiento) {
      return res.status(404).json({ message: "Alojamiento no encontrado" });
    }
    await alojamiento.update(req.body);
    res.json({ message: "Alojamiento actualizado exitosamente", alojamiento });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error al actualizar alojamiento",
        error: error.message,
      });
  }
};

export const deleteAlojamiento = async (req, res) => {
  try {
    const alojamiento = await Alojamiento.findByPk(req.params.id);
    if (!alojamiento) {
      return res.status(404).json({ message: "Alojamiento no encontrado" });
    }
    await alojamiento.update({ activo: false });
    res.json({ message: "Alojamiento desactivado exitosamente" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al eliminar alojamiento", error: error.message });
  }
};

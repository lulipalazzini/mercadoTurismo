import SalidaGrupal from "../models/SalidaGrupal.model.js";

export const getSalidasGrupales = async (req, res) => {
  try {
    const salidas = await SalidaGrupal.findAll({
      where: { activo: true },
      order: [["fechaSalida", "ASC"]],
    });
    res.json(salidas);
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error al obtener salidas grupales",
        error: error.message,
      });
  }
};

export const getSalidaGrupal = async (req, res) => {
  try {
    const salida = await SalidaGrupal.findByPk(req.params.id);
    if (!salida) {
      return res.status(404).json({ message: "Salida grupal no encontrada" });
    }
    res.json(salida);
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error al obtener salida grupal",
        error: error.message,
      });
  }
};

export const createSalidaGrupal = async (req, res) => {
  try {
    const salida = await SalidaGrupal.create({
      ...req.body,
      cuposDisponibles: req.body.cuposMaximos,
    });
    res
      .status(201)
      .json({ message: "Salida grupal creada exitosamente", salida });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al crear salida grupal", error: error.message });
  }
};

export const updateSalidaGrupal = async (req, res) => {
  try {
    const salida = await SalidaGrupal.findByPk(req.params.id);
    if (!salida) {
      return res.status(404).json({ message: "Salida grupal no encontrada" });
    }
    await salida.update(req.body);
    res.json({ message: "Salida grupal actualizada exitosamente", salida });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error al actualizar salida grupal",
        error: error.message,
      });
  }
};

export const deleteSalidaGrupal = async (req, res) => {
  try {
    const salida = await SalidaGrupal.findByPk(req.params.id);
    if (!salida) {
      return res.status(404).json({ message: "Salida grupal no encontrada" });
    }
    await salida.update({ activo: false });
    res.json({ message: "Salida grupal desactivada exitosamente" });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error al eliminar salida grupal",
        error: error.message,
      });
  }
};

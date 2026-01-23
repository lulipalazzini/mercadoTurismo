const Excursion = require("../models/Excursion.model");
const User = require("../models/User.model");

const getExcursiones = async (req, res) => {
  try {
    const excursiones = await Excursion.findAll({
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
    res.json(excursiones);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener excursiones", error: error.message });
  }
};

const getExcursion = async (req, res) => {
  try {
    const excursion = await Excursion.findByPk(req.params.id);
    if (!excursion) {
      return res.status(404).json({ message: "Excursion no encontrada" });
    }
    res.json(excursion);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener excursion", error: error.message });
  }
};

const createExcursion = async (req, res) => {
  try {
    const excursion = await Excursion.create(req.body);
    res
      .status(201)
      .json({ message: "Excursion creada exitosamente", excursion });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al crear excursion", error: error.message });
  }
};

const updateExcursion = async (req, res) => {
  try {
    const excursion = await Excursion.findByPk(req.params.id);
    if (!excursion) {
      return res.status(404).json({ message: "Excursion no encontrada" });
    }
    await excursion.update(req.body);
    res.json({ message: "Excursion actualizada exitosamente", excursion });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al actualizar excursion", error: error.message });
  }
};

const deleteExcursion = async (req, res) => {
  try {
    const excursion = await Excursion.findByPk(req.params.id);
    if (!excursion) {
      return res.status(404).json({ message: "Excursion no encontrada" });
    }
    await excursion.update({ activo: false });
    res.json({ message: "Excursion desactivada exitosamente" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al eliminar excursion", error: error.message });
  }
};


module.exports = {
  getExcursiones,
  getExcursion,
  createExcursion,
  updateExcursion,
  deleteExcursion
};

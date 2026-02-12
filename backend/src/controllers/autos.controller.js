const Auto = require("../models/Auto.model");
const User = require("../models/User.model");
const { deleteOldImages } = require("../middleware/upload.middleware");

const getAutos = async (req, res) => {
  try {
    const autos = await Auto.findAll({
      where: { disponible: true },
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: User,
          as: "vendedor",
          attributes: ["id", "nombre", "email", "razonSocial", "role"],
        },
      ],
    });
    res.json(autos);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener autos", error: error.message });
  }
};

const getAuto = async (req, res) => {
  try {
    const auto = await Auto.findByPk(req.params.id);
    if (!auto) {
      return res.status(404).json({ message: "Auto no encontrado" });
    }
    res.json(auto);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener auto", error: error.message });
  }
};

const createAuto = async (req, res) => {
  try {
    const auto = await Auto.create(req.body);
    res.status(201).json({ message: "Auto creado exitosamente", auto });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al crear auto", error: error.message });
  }
};

const updateAuto = async (req, res) => {
  try {
    const auto = await Auto.findByPk(req.params.id);
    if (!auto) {
      return res.status(404).json({ message: "Auto no encontrado" });
    }
    await auto.update(req.body);
    res.json({ message: "Auto actualizado exitosamente", auto });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al actualizar auto", error: error.message });
  }
};

const deleteAuto = async (req, res) => {
  try {
    const auto = await Auto.findByPk(req.params.id);
    if (!auto) {
      return res.status(404).json({ message: "Auto no encontrado" });
    }
    await auto.update({ disponible: false });
    res.json({ message: "Auto desactivado exitosamente" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al eliminar auto", error: error.message });
  }
};


module.exports = {
  getAutos,
  getAuto,
  createAuto,
  updateAuto,
  deleteAuto
};

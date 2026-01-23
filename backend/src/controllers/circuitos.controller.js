const Circuito = require("../models/Circuito.model");
const User = require("../models/User.model");

const getCircuitos = async (req, res) => {
  try {
    const circuitos = await Circuito.findAll({
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
    res.json(circuitos);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener circuitos", error: error.message });
  }
};

const getCircuito = async (req, res) => {
  try {
    const circuito = await Circuito.findByPk(req.params.id);
    if (!circuito) {
      return res.status(404).json({ message: "Circuito no encontrado" });
    }
    res.json(circuito);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener circuito", error: error.message });
  }
};

const createCircuito = async (req, res) => {
  try {
    const circuito = await Circuito.create(req.body);
    res.status(201).json({ message: "Circuito creado exitosamente", circuito });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al crear circuito", error: error.message });
  }
};

const updateCircuito = async (req, res) => {
  try {
    const circuito = await Circuito.findByPk(req.params.id);
    if (!circuito) {
      return res.status(404).json({ message: "Circuito no encontrado" });
    }
    await circuito.update(req.body);
    res.json({ message: "Circuito actualizado exitosamente", circuito });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al actualizar circuito", error: error.message });
  }
};

const deleteCircuito = async (req, res) => {
  try {
    const circuito = await Circuito.findByPk(req.params.id);
    if (!circuito) {
      return res.status(404).json({ message: "Circuito no encontrado" });
    }
    await circuito.update({ activo: false });
    res.json({ message: "Circuito desactivado exitosamente" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al eliminar circuito", error: error.message });
  }
};


module.exports = {
  getCircuitos,
  getCircuito,
  createCircuito,
  updateCircuito,
  deleteCircuito
};

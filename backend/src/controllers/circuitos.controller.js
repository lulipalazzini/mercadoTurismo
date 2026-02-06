const Circuito = require("../models/Circuito.model");
const User = require("../models/User.model");
const {
  parseItemsJsonFields,
  parseItemJsonFields,
  parseRequestJsonFields,
} = require("../utils/parseJsonFields");

const JSON_FIELDS = ["imagenes"];

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
    const parsedCircuitos = parseItemsJsonFields(circuitos, JSON_FIELDS);
    res.json(parsedCircuitos);
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
    const parsedCircuito = parseItemJsonFields(circuito, JSON_FIELDS);
    res.json(parsedCircuito);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener circuito", error: error.message });
  }
};

const createCircuito = async (req, res) => {
  try {
    const circuitoData = { ...req.body };
    Object.assign(circuitoData, parseRequestJsonFields(req.body, JSON_FIELDS));

    if (req.uploadedImages && req.uploadedImages.length > 0) {
      circuitoData.imagenes = req.uploadedImages.map((img) => img.path);
    }

    const circuito = await Circuito.create(circuitoData);
    const parsedCircuito = parseItemJsonFields(circuito, JSON_FIELDS);
    res
      .status(201)
      .json({
        message: "Circuito creado exitosamente",
        circuito: parsedCircuito,
      });
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

    const updateData = { ...req.body };
    Object.assign(updateData, parseRequestJsonFields(req.body, JSON_FIELDS));

    // Manejar imágenes
    if (req.uploadedImages && req.uploadedImages.length > 0) {
      const nuevasImagenes = req.uploadedImages.map((img) => img.path);
      if (req.body.imagenesExistentes) {
        try {
          const existentes =
            typeof req.body.imagenesExistentes === "string"
              ? JSON.parse(req.body.imagenesExistentes)
              : req.body.imagenesExistentes;
          updateData.imagenes = [...existentes, ...nuevasImagenes];
        } catch (e) {
          updateData.imagenes = nuevasImagenes;
        }
      } else {
        updateData.imagenes = nuevasImagenes;
      }
    } else if (req.body.imagenesExistentes) {
      try {
        updateData.imagenes =
          typeof req.body.imagenesExistentes === "string"
            ? JSON.parse(req.body.imagenesExistentes)
            : req.body.imagenesExistentes;
      } catch (e) {}
    }

    await circuito.update(updateData);
    const parsedCircuito = parseItemJsonFields(circuito, JSON_FIELDS);
    res.json({
      message: "Circuito actualizado exitosamente",
      circuito: parsedCircuito,
    });
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
  deleteCircuito,
};

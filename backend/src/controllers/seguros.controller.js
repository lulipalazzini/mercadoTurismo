const Seguro = require("../models/Seguro.model");
const User = require("../models/User.model");
const { shouldFilterByOwnership } = require("../middleware/rolePermissions");
const {
  parseItemsJsonFields,
  parseItemJsonFields,
  parseRequestJsonFields,
} = require("../utils/parseJsonFields");

const JSON_FIELDS = ["imagenes"];

const getSeguros = async (req, res) => {
  try {
    const whereClause = { activo: true };

    // Aplicar filtro de ownership para usuarios B2B
    if (req.user && shouldFilterByOwnership(req.user, "seguros")) {
      whereClause.userId = req.user.id;
      console.log(`🔒 Filtrando seguros del usuario: ${req.user.id}`);
    }

    // Usuarios no autenticados pueden ver TODOS los seguros
    // (No se aplica filtro isPublic para B2C)

    const seguros = await Seguro.findAll({
      where: whereClause,
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: User,
          as: "vendedor",
          attributes: [
            "id",
            "nombre",
            "email",
            "razonSocial",
            "role",
            "calculatedRole",
            "isVisibleToPassengers",
          ],
        },
      ],
    });
    const parsedSeguros = parseItemsJsonFields(seguros, JSON_FIELDS);
    res.json(parsedSeguros);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener seguros", error: error.message });
  }
};

const getSeguro = async (req, res) => {
  try {
    const seguro = await Seguro.findByPk(req.params.id);
    if (!seguro) {
      return res.status(404).json({ message: "Seguro no encontrado" });
    }
    const parsedSeguro = parseItemJsonFields(seguro, JSON_FIELDS);
    res.json(parsedSeguro);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener seguro", error: error.message });
  }
};

const createSeguro = async (req, res) => {
  try {
    const seguroData = { ...req.body };
    Object.assign(seguroData, parseRequestJsonFields(req.body, JSON_FIELDS));

    if (req.uploadedImages && req.uploadedImages.length > 0) {
      seguroData.imagenes = req.uploadedImages.map((img) => img.path);
    }

    // Asignar owner (userId) automáticamente
    if (req.user) {
      seguroData.userId = req.user.id;
    }

    const seguro = await Seguro.create(seguroData);
    const parsedSeguro = parseItemJsonFields(seguro, JSON_FIELDS);
    res
      .status(201)
      .json({ message: "Seguro creado exitosamente", seguro: parsedSeguro });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al crear seguro", error: error.message });
  }
};

const updateSeguro = async (req, res) => {
  try {
    const seguro = await Seguro.findByPk(req.params.id);
    if (!seguro) {
      return res.status(404).json({ message: "Seguro no encontrado" });
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

    await seguro.update(updateData);
    const parsedSeguro = parseItemJsonFields(seguro, JSON_FIELDS);
    res.json({
      message: "Seguro actualizado exitosamente",
      seguro: parsedSeguro,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al actualizar seguro", error: error.message });
  }
};

const deleteSeguro = async (req, res) => {
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

module.exports = {
  getSeguros,
  getSeguro,
  createSeguro,
  updateSeguro,
  deleteSeguro,
};

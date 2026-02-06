const Excursion = require("../models/Excursion.model");
const User = require("../models/User.model");
const { isAdmin } = require("../middleware/publisherSecurity");
const {
  parseItemsJsonFields,
  parseItemJsonFields,
  parseRequestJsonFields,
} = require("../utils/parseJsonFields");

const JSON_FIELDS = ["imagenes"];

const getExcursiones = async (req, res) => {
  try {
    const whereClause = { activo: true };

    // Aplicar filtro de ownership para usuarios B2B
    if (req.user && !isAdmin(req.user)) {
      whereClause.published_by_user_id = req.user.id;
      console.log(`🔒 Filtrando excursiones del usuario: ${req.user.id}`);
    }

    // Usuarios no autenticados pueden ver TODAS las excursiones
    // (No se aplica filtro isPublic para B2C)

    const excursiones = await Excursion.findAll({
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
    const parsedExcursiones = parseItemsJsonFields(excursiones, JSON_FIELDS);
    res.json(parsedExcursiones);
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

    // Verificar ownership
    if (req.user && !isAdmin(req.user) && excursion.published_by_user_id !== req.user.id) {
      return res.status(403).json({ message: "No tienes permiso para ver esta excursión" });
    }

    const parsedExcursion = parseItemJsonFields(excursion, JSON_FIELDS);
    res.json(parsedExcursion);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener excursion", error: error.message });
  }
};

const createExcursion = async (req, res) => {
  try {
    const excursionData = { ...req.body };
    Object.assign(excursionData, parseRequestJsonFields(req.body, JSON_FIELDS));

    if (req.uploadedImages && req.uploadedImages.length > 0) {
      excursionData.imagenes = req.uploadedImages.map((img) => img.path);
    }

    // Asignar publisher automáticamente
    if (req.user) {
      excursionData.published_by_user_id = req.user.id;
    }

    const excursion = await Excursion.create(excursionData);
    const parsedExcursion = parseItemJsonFields(excursion, JSON_FIELDS);
    res.status(201).json({
      message: "Excursion creada exitosamente",
      excursion: parsedExcursion,
    });
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

    // Verificar ownership
    if (!isAdmin(req.user) && excursion.published_by_user_id !== req.user.id) {
      return res.status(403).json({ message: "No tienes permiso para editar esta excursión" });
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

    await excursion.update(updateData);
    const parsedExcursion = parseItemJsonFields(excursion, JSON_FIELDS);
    res.json({
      message: "Excursion actualizada exitosamente",
      excursion: parsedExcursion,
    });
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

    // Verificar ownership
    if (!isAdmin(req.user) && excursion.published_by_user_id !== req.user.id) {
      return res.status(403).json({ message: "No tienes permiso para eliminar esta excursión" });
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
  deleteExcursion,
};

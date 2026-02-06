const Alojamiento = require("../models/Alojamiento.model");
const User = require("../models/User.model");
const { shouldFilterByOwnership } = require("../middleware/rolePermissions");
const {
  parseItemsJsonFields,
  parseItemJsonFields,
  parseRequestJsonFields,
} = require("../utils/parseJsonFields");

const JSON_FIELDS = ["imagenes"];

const getAlojamientos = async (req, res) => {
  try {
    const whereClause = { activo: true };

    // Aplicar filtro de ownership para usuarios B2B
    if (req.user && shouldFilterByOwnership(req.user, "alojamientos")) {
      whereClause.userId = req.user.id;
      console.log(`🔒 Filtrando alojamientos del usuario: ${req.user.id}`);
    }

    // Usuarios no autenticados pueden ver TODOS los alojamientos
    // (No se aplica filtro isPublic para B2C)

    const alojamientos = await Alojamiento.findAll({
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
    const parsedAlojamientos = parseItemsJsonFields(alojamientos, JSON_FIELDS);
    res.json(parsedAlojamientos);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener alojamientos", error: error.message });
  }
};

const getAlojamiento = async (req, res) => {
  try {
    const alojamiento = await Alojamiento.findByPk(req.params.id);
    if (!alojamiento) {
      return res.status(404).json({ message: "Alojamiento no encontrado" });
    }
    const parsedAlojamiento = parseItemJsonFields(alojamiento, JSON_FIELDS);
    res.json(parsedAlojamiento);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener alojamiento", error: error.message });
  }
};

const createAlojamiento = async (req, res) => {
  try {
    const alojamientoData = { ...req.body };
    Object.assign(
      alojamientoData,
      parseRequestJsonFields(req.body, JSON_FIELDS),
    );

    if (req.uploadedImages && req.uploadedImages.length > 0) {
      alojamientoData.imagenes = req.uploadedImages.map((img) => img.path);
    }

    // Asignar owner (userId) automáticamente
    if (req.user) {
      alojamientoData.userId = req.user.id;
    }

    const alojamiento = await Alojamiento.create(alojamientoData);
    const parsedAlojamiento = parseItemJsonFields(alojamiento, JSON_FIELDS);
    res.status(201).json({
      message: "Alojamiento creado exitosamente",
      alojamiento: parsedAlojamiento,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al crear alojamiento", error: error.message });
  }
};

const updateAlojamiento = async (req, res) => {
  try {
    const alojamiento = await Alojamiento.findByPk(req.params.id);
    if (!alojamiento) {
      return res.status(404).json({ message: "Alojamiento no encontrado" });
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

    await alojamiento.update(updateData);
    const parsedAlojamiento = parseItemJsonFields(alojamiento, JSON_FIELDS);
    res.json({
      message: "Alojamiento actualizado exitosamente",
      alojamiento: parsedAlojamiento,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al actualizar alojamiento",
      error: error.message,
    });
  }
};

const deleteAlojamiento = async (req, res) => {
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

module.exports = {
  getAlojamientos,
  getAlojamiento,
  createAlojamiento,
  updateAlojamiento,
  deleteAlojamiento,
};

const SalidaGrupal = require("../models/SalidaGrupal.model");
const User = require("../models/User.model");
const { shouldFilterByOwnership } = require("../middleware/rolePermissions");
const {
  parseItemsJsonFields,
  parseItemJsonFields,
  parseRequestJsonFields,
} = require("../utils/parseJsonFields");

const JSON_FIELDS = ["imagenes"];

const getSalidasGrupales = async (req, res) => {
  try {
    const whereClause = { activo: true };

    // Aplicar filtro de ownership para usuarios B2B
    if (req.user && shouldFilterByOwnership(req.user, "salidasGrupales")) {
      whereClause.userId = req.user.id;
      console.log(`🔒 Filtrando salidas grupales del usuario: ${req.user.id}`);
    }

    // Usuarios no autenticados pueden ver TODAS las salidas grupales
    // (No se aplica filtro isPublic para B2C)

    const salidas = await SalidaGrupal.findAll({
      where: whereClause,
      order: [["fechaSalida", "ASC"]],
      include: [
        {
          model: User,
          as: "vendedor",
          attributes: ["id", "nombre", "email", "razonSocial", "role", "calculatedRole", "isVisibleToPassengers"],
        },
      ],
    });
    const parsedSalidas = parseItemsJsonFields(salidas, JSON_FIELDS);
    res.json(parsedSalidas);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener salidas grupales",
      error: error.message,
    });
  }
};

const getSalidaGrupal = async (req, res) => {
  try {
    const salida = await SalidaGrupal.findByPk(req.params.id);
    if (!salida) {
      return res.status(404).json({ message: "Salida grupal no encontrada" });
    }
    const parsedSalida = parseItemJsonFields(salida, JSON_FIELDS);
    res.json(parsedSalida);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener salida grupal",
      error: error.message,
    });
  }
};

const createSalidaGrupal = async (req, res) => {
  try {
    const salidaData = {
      ...req.body,
      cuposDisponibles: req.body.cuposMaximos,
    };
    Object.assign(salidaData, parseRequestJsonFields(req.body, JSON_FIELDS));

    if (req.uploadedImages && req.uploadedImages.length > 0) {
      salidaData.imagenes = req.uploadedImages.map((img) => img.path);
    }

    // Asignar owner (userId) automáticamente
    if (req.user) {
      salidaData.userId = req.user.id;
    }

    const salida = await SalidaGrupal.create(salidaData);
    const parsedSalida = parseItemJsonFields(salida, JSON_FIELDS);
    res
      .status(201)
      .json({
        message: "Salida grupal creada exitosamente",
        salida: parsedSalida,
      });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al crear salida grupal", error: error.message });
  }
};

const updateSalidaGrupal = async (req, res) => {
  try {
    const salida = await SalidaGrupal.findByPk(req.params.id);
    if (!salida) {
      return res.status(404).json({ message: "Salida grupal no encontrada" });
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

    await salida.update(updateData);
    const parsedSalida = parseItemJsonFields(salida, JSON_FIELDS);
    res.json({
      message: "Salida grupal actualizada exitosamente",
      salida: parsedSalida,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al actualizar salida grupal",
      error: error.message,
    });
  }
};

const deleteSalidaGrupal = async (req, res) => {
  try {
    const salida = await SalidaGrupal.findByPk(req.params.id);
    if (!salida) {
      return res.status(404).json({ message: "Salida grupal no encontrada" });
    }
    await salida.update({ activo: false });
    res.json({ message: "Salida grupal desactivada exitosamente" });
  } catch (error) {
    res.status(500).json({
      message: "Error al eliminar salida grupal",
      error: error.message,
    });
  }
};

module.exports = {
  getSalidasGrupales,
  getSalidaGrupal,
  createSalidaGrupal,
  updateSalidaGrupal,
  deleteSalidaGrupal,
};

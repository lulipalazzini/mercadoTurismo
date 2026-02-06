const Crucero = require("../models/Crucero.model");
const User = require("../models/User.model");
const { Op } = require("sequelize");
const { shouldFilterByOwnership } = require("../middleware/rolePermissions");
const {
  parseItemsJsonFields,
  parseItemJsonFields,
  parseRequestJsonFields,
} = require("../utils/parseJsonFields");

const JSON_FIELDS = ["imagenes"];

const getCruceros = async (req, res) => {
  try {
    const whereClause = { activo: true };

    // Aplicar filtro de ownership para usuarios B2B
    if (req.user && shouldFilterByOwnership(req.user, "cruceros")) {
      whereClause.userId = req.user.id;
      console.log(`🔒 Filtrando cruceros del usuario: ${req.user.id}`);
    }

    // Usuarios no autenticados pueden ver TODOS los cruceros
    // (No se aplica filtro isPublic para B2C)

    // FILTROS DE BÚSQUEDA ESPECÍFICOS
    const { puertoSalida, mes, duracionMin, duracionMax, moneda } = req.query;

    // Filtro por puerto de salida (EXACTO, no buscar en itinerario)
    if (puertoSalida) {
      whereClause.puertoSalida = puertoSalida;
      console.log(`🚢 Filtrando por puerto de salida: ${puertoSalida}`);
    }

    // Filtro por mes de salida
    if (mes) {
      whereClause.mesSalida = parseInt(mes);
      console.log(`📅 Filtrando por mes: ${mes}`);
    }

    // Filtro por duración
    if (duracionMin || duracionMax) {
      whereClause.duracionDias = {};
      if (duracionMin) {
        whereClause.duracionDias[Op.gte] = parseInt(duracionMin);
      }
      if (duracionMax) {
        whereClause.duracionDias[Op.lte] = parseInt(duracionMax);
      }
      console.log(
        `⏱️ Filtrando por duración: ${duracionMin || "N/A"}-${duracionMax || "N/A"} días`,
      );
    }

    // Filtro por moneda
    if (moneda) {
      whereClause.moneda = moneda;
      console.log(`💰 Filtrando por moneda: ${moneda}`);
    }

    const cruceros = await Crucero.findAll({
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
    const parsedCruceros = parseItemsJsonFields(cruceros, JSON_FIELDS);
    res.json(parsedCruceros);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener cruceros", error: error.message });
  }
};

const getCrucero = async (req, res) => {
  try {
    const crucero = await Crucero.findByPk(req.params.id);
    if (!crucero) {
      return res.status(404).json({ message: "Crucero no encontrado" });
    }
    const parsedCrucero = parseItemJsonFields(crucero, JSON_FIELDS);
    res.json(parsedCrucero);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener crucero", error: error.message });
  }
};

const createCrucero = async (req, res) => {
  try {
    const cruceroData = { ...req.body };
    Object.assign(cruceroData, parseRequestJsonFields(req.body, JSON_FIELDS));

    if (req.uploadedImages && req.uploadedImages.length > 0) {
      cruceroData.imagenes = req.uploadedImages.map((img) => img.path);
    }

    // Asignar owner (userId) automáticamente
    if (req.user) {
      cruceroData.userId = req.user.id;
    }

    const crucero = await Crucero.create(cruceroData);
    const parsedCrucero = parseItemJsonFields(crucero, JSON_FIELDS);
    res
      .status(201)
      .json({ message: "Crucero creado exitosamente", crucero: parsedCrucero });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al crear crucero", error: error.message });
  }
};

const updateCrucero = async (req, res) => {
  try {
    const crucero = await Crucero.findByPk(req.params.id);
    if (!crucero) {
      return res.status(404).json({ message: "Crucero no encontrado" });
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

    await crucero.update(updateData);
    const parsedCrucero = parseItemJsonFields(crucero, JSON_FIELDS);
    res.json({
      message: "Crucero actualizado exitosamente",
      crucero: parsedCrucero,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al actualizar crucero", error: error.message });
  }
};

const deleteCrucero = async (req, res) => {
  try {
    const crucero = await Crucero.findByPk(req.params.id);
    if (!crucero) {
      return res.status(404).json({ message: "Crucero no encontrado" });
    }
    await crucero.update({ activo: false });
    res.json({ message: "Crucero desactivado exitosamente" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al eliminar crucero", error: error.message });
  }
};

module.exports = {
  getCruceros,
  getCrucero,
  createCrucero,
  updateCrucero,
  deleteCrucero,
};

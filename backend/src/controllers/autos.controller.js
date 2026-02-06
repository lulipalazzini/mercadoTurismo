const Auto = require("../models/Auto.model");
const User = require("../models/User.model");
const { Op } = require("sequelize");
const { isAdmin } = require("../middleware/publisherSecurity");
const {
  parseItemsJsonFields,
  parseItemJsonFields,
  parseRequestJsonFields,
} = require("../utils/parseJsonFields");

const JSON_FIELDS = ["imagenes"];

const getAutos = async (req, res) => {
  try {
    const whereClause = { disponible: true };

    // Aplicar filtro de ownership para usuarios B2B
    if (req.user && !isAdmin(req.user)) {
      whereClause.published_by_user_id = req.user.id;
      console.log(`🔒 Filtrando autos del usuario: ${req.user.id}`);
    }

    // Usuarios no autenticados pueden ver TODOS los autos
    // (No se aplica filtro isPublic para B2C)

    // Filtros de búsqueda
    const { transmision, categoria, ubicacion, precioMin, precioMax } =
      req.query;

    if (transmision) {
      whereClause.transmision = transmision;
      console.log(`🚗 Filtrando por transmisión: ${transmision}`);
    }

    if (categoria) {
      whereClause.categoria = categoria;
      console.log(`🏷️ Filtrando por categoría: ${categoria}`);
    }

    if (ubicacion) {
      whereClause.ubicacion = { [Op.like]: `%${ubicacion}%` };
      console.log(`📍 Filtrando por ubicación: ${ubicacion}`);
    }

    if (precioMin || precioMax) {
      whereClause.precioPorDia = {};
      if (precioMin) {
        whereClause.precioPorDia[Op.gte] = parseFloat(precioMin);
        console.log(`💰 Filtrando precio mínimo: ${precioMin}`);
      }
      if (precioMax) {
        whereClause.precioPorDia[Op.lte] = parseFloat(precioMax);
        console.log(`💰 Filtrando precio máximo: ${precioMax}`);
      }
    }

    const autos = await Auto.findAll({
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
    const parsedAutos = parseItemsJsonFields(autos, JSON_FIELDS);
    res.json(parsedAutos);
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

    // Verificar ownership
    if (
      req.user &&
      !isAdmin(req.user) &&
      auto.published_by_user_id !== req.user.id
    ) {
      return res
        .status(403)
        .json({ message: "No tienes permiso para ver este auto" });
    }

    const parsedAuto = parseItemJsonFields(auto, JSON_FIELDS);
    res.json(parsedAuto);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener auto", error: error.message });
  }
};

const createAuto = async (req, res) => {
  try {
    const autoData = { ...req.body };
    Object.assign(autoData, parseRequestJsonFields(req.body, JSON_FIELDS));

    if (req.uploadedImages && req.uploadedImages.length > 0) {
      autoData.imagenes = req.uploadedImages.map((img) => img.path);
    }

    // Asignar publisher automáticamente
    if (req.user) {
      autoData.published_by_user_id = req.user.id;
    }

    const auto = await Auto.create(autoData);
    const parsedAuto = parseItemJsonFields(auto, JSON_FIELDS);
    res
      .status(201)
      .json({ message: "Auto creado exitosamente", auto: parsedAuto });
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

    // Verificar ownership
    if (!isAdmin(req.user) && auto.published_by_user_id !== req.user.id) {
      return res
        .status(403)
        .json({ message: "No tienes permiso para editar este auto" });
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

    await auto.update(updateData);
    const parsedAuto = parseItemJsonFields(auto, JSON_FIELDS);
    res.json({ message: "Auto actualizado exitosamente", auto: parsedAuto });
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

    // Verificar ownership
    if (!isAdmin(req.user) && auto.published_by_user_id !== req.user.id) {
      return res
        .status(403)
        .json({ message: "No tienes permiso para eliminar este auto" });
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
  deleteAuto,
};

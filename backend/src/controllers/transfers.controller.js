const Transfer = require("../models/Transfer.model");
const User = require("../models/User.model");
const { Op } = require("sequelize");
const { isAdmin } = require("../middleware/publisherSecurity");
const {
  parseItemsJsonFields,
  parseItemJsonFields,
  parseRequestJsonFields,
} = require("../utils/parseJsonFields");

const JSON_FIELDS = ["imagenes"];

const getTransfers = async (req, res) => {
  try {
    const whereClause = { disponible: true };

    // Aplicar filtro de ownership para usuarios B2B
    if (req.user && !isAdmin(req.user)) {
      whereClause.published_by_user_id = req.user.id;
      console.log(`🔒 Filtrando transfers del usuario: ${req.user.id}`);
    }

    // Usuarios no autenticados pueden ver TODOS los transfers
    // (No se aplica filtro isPublic para B2C)

    // Filtros de búsqueda
    const { tipoServicio, origen, destino, precioMin, precioMax } = req.query;

    if (tipoServicio) {
      whereClause.tipoServicio = tipoServicio;
      console.log(`🚗 Filtrando por tipo de servicio: ${tipoServicio}`);
    }

    if (origen) {
      whereClause.origen = { [Op.like]: `%${origen}%` };
      console.log(`📍 Filtrando por origen: ${origen}`);
    }

    if (destino) {
      whereClause.destino = { [Op.like]: `%${destino}%` };
      console.log(`📍 Filtrando por destino: ${destino}`);
    }

    if (precioMin || precioMax) {
      whereClause.precio = {};
      if (precioMin) {
        whereClause.precio[Op.gte] = parseFloat(precioMin);
        console.log(`💰 Filtrando precio mínimo: ${precioMin}`);
      }
      if (precioMax) {
        whereClause.precio[Op.lte] = parseFloat(precioMax);
        console.log(`💰 Filtrando precio máximo: ${precioMax}`);
      }
    }

    const transfers = await Transfer.findAll({
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
    const parsedTransfers = parseItemsJsonFields(transfers, JSON_FIELDS);
    res.json(parsedTransfers);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener transfers", error: error.message });
  }
};

const getTransfer = async (req, res) => {
  try {
    const transfer = await Transfer.findByPk(req.params.id);
    if (!transfer) {
      return res.status(404).json({ message: "Transfer no encontrado" });
    }

    // Verificar ownership
    if (
      req.user &&
      !isAdmin(req.user) &&
      transfer.published_by_user_id !== req.user.id
    ) {
      return res
        .status(403)
        .json({ message: "No tienes permiso para ver este transfer" });
    }

    const parsedTransfer = parseItemJsonFields(transfer, JSON_FIELDS);
    res.json(parsedTransfer);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener transfer", error: error.message });
  }
};

const createTransfer = async (req, res) => {
  try {
    const transferData = { ...req.body };
    Object.assign(transferData, parseRequestJsonFields(req.body, JSON_FIELDS));

    if (req.uploadedImages && req.uploadedImages.length > 0) {
      transferData.imagenes = req.uploadedImages.map((img) => img.path);
    }

    // Asignar publisher automáticamente
    if (req.user) {
      transferData.published_by_user_id = req.user.id;
    }

    const transfer = await Transfer.create(transferData);
    const parsedTransfer = parseItemJsonFields(transfer, JSON_FIELDS);
    res.status(201).json({
      message: "Transfer creado exitosamente",
      transfer: parsedTransfer,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al crear transfer", error: error.message });
  }
};

const updateTransfer = async (req, res) => {
  try {
    const transfer = await Transfer.findByPk(req.params.id);
    if (!transfer) {
      return res.status(404).json({ message: "Transfer no encontrado" });
    }

    // Verificar ownership
    if (!isAdmin(req.user) && transfer.published_by_user_id !== req.user.id) {
      return res
        .status(403)
        .json({ message: "No tienes permiso para editar este transfer" });
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

    await transfer.update(updateData);
    const parsedTransfer = parseItemJsonFields(transfer, JSON_FIELDS);
    res.json({
      message: "Transfer actualizado exitosamente",
      transfer: parsedTransfer,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al actualizar transfer", error: error.message });
  }
};

const deleteTransfer = async (req, res) => {
  try {
    const transfer = await Transfer.findByPk(req.params.id);
    if (!transfer) {
      return res.status(404).json({ message: "Transfer no encontrado" });
    }

    // Verificar ownership
    if (!isAdmin(req.user) && transfer.published_by_user_id !== req.user.id) {
      return res
        .status(403)
        .json({ message: "No tienes permiso para eliminar este transfer" });
    }

    await transfer.update({ disponible: false });
    res.json({ message: "Transfer desactivado exitosamente" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al eliminar transfer", error: error.message });
  }
};

module.exports = {
  getTransfers,
  getTransfer,
  createTransfer,
  updateTransfer,
  deleteTransfer,
};

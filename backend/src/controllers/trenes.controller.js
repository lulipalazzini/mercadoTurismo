const Tren = require("../models/Tren.model");
const User = require("../models/User.model");
const { Op } = require("sequelize");
const { isAdmin } = require("../middleware/publisherSecurity");
const {
  parseItemsJsonFields,
  parseItemJsonFields,
  parseRequestJsonFields,
} = require("../utils/parseJsonFields");

const JSON_FIELDS = ["paradas", "servicios", "imagenes"];

const getTrenes = async (req, res) => {
  try {
    console.log('📋 Obteniendo lista de trenes...');
    const whereClause = { activo: true };

    // Aplicar filtro de ownership para usuarios B2B
    if (req.user && !isAdmin(req.user)) {
      whereClause.published_by_user_id = req.user.id;
      console.log(`🔒 Filtrando trenes del usuario: ${req.user.id}`);
    }

    // Usuarios no autenticados pueden ver TODOS los trenes
    // (No se aplica filtro isPublic para B2C)

    // Filtros de búsqueda
    const {
      tipo,
      clase,
      origen,
      destino,
      empresa,
      precioMin,
      precioMax,
      moneda,
    } = req.query;

    if (tipo) {
      whereClause.tipo = tipo;
      console.log(`🚄 Filtrando por tipo: ${tipo}`);
    }

    if (clase) {
      whereClause.clase = clase;
      console.log(`🎫 Filtrando por clase: ${clase}`);
    }

    if (origen) {
      whereClause.origen = { [Op.like]: `%${origen}%` };
      console.log(`📍 Filtrando por origen: ${origen}`);
    }

    if (destino) {
      whereClause.destino = { [Op.like]: `%${destino}%` };
      console.log(`📍 Filtrando por destino: ${destino}`);
    }

    if (empresa) {
      whereClause.empresa = { [Op.like]: `%${empresa}%` };
      console.log(`🏢 Filtrando por empresa: ${empresa}`);
    }

    if (moneda) {
      whereClause.moneda = moneda;
      console.log(`💰 Filtrando por moneda: ${moneda}`);
    }

    if (precioMin || precioMax) {
      whereClause.precio = {};
      if (precioMin) {
        whereClause.precio[Op.gte] = parseFloat(precioMin);
        console.log(`💰 Precio mínimo: ${precioMin}`);
      }
      if (precioMax) {
        whereClause.precio[Op.lte] = parseFloat(precioMax);
        console.log(`💰 Precio máximo: ${precioMax}`);
      }
    }

    const trenes = await Tren.findAll({
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

    console.log(`✅ Se encontraron ${trenes.length} trenes`);
    const parsedTrenes = parseItemsJsonFields(trenes, JSON_FIELDS);
    
    // Asegurar headers CORS en la respuesta
    res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.json(parsedTrenes);
  } catch (error) {
    console.error("❌ Error al obtener trenes:");
    console.error("   Mensaje:", error.message);
    console.error("   Stack:", error.stack);
    console.error("   Query params:", req.query);
    
    // Asegurar headers CORS incluso en error
    res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    
    res.status(500).json({
      success: false,
      message: "Error al obtener trenes",
      error: error.message,
      details: process.env.NODE_ENV === 'production' ? undefined : error.stack
    });
  }
};

const getTren = async (req, res) => {
  try {
    const tren = await Tren.findByPk(req.params.id, {
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

    if (!tren) {
      return res.status(404).json({ message: "Tren no encontrado" });
    }

    // Verificar ownership
    if (
      req.user &&
      !isAdmin(req.user) &&
      tren.published_by_user_id !== req.user.id
    ) {
      return res
        .status(403)
        .json({ message: "No tienes permiso para ver este tren" });
    }

    const parsedTren = parseItemJsonFields(tren, JSON_FIELDS);
    res.json(parsedTren);
  } catch (error) {
    console.error("❌ Error al obtener tren:", error);
    res.status(500).json({
      message: "Error al obtener tren",
      error: error.message,
    });
  }
};

const createTren = async (req, res) => {
  try {
    const trenData = { ...req.body };
    Object.assign(trenData, parseRequestJsonFields(req.body, JSON_FIELDS));

    if (req.uploadedImages && req.uploadedImages.length > 0) {
      trenData.imagenes = req.uploadedImages.map((img) => img.path);
    }

    // Asignar vendedorId y published_by_user_id si hay usuario autenticado
    if (req.user) {
      trenData.vendedorId = req.user.id;
      trenData.published_by_user_id = req.user.id;
    }

    const tren = await Tren.create(trenData);
    const parsedTren = parseItemJsonFields(tren, JSON_FIELDS);

    res.status(201).json(parsedTren);
  } catch (error) {
    console.error("❌ Error al crear tren:", error);
    res.status(500).json({
      message: "Error al crear tren",
      error: error.message,
    });
  }
};

const updateTren = async (req, res) => {
  try {
    const tren = await Tren.findByPk(req.params.id);

    if (!tren) {
      return res.status(404).json({ message: "Tren no encontrado" });
    }

    // Verificar ownership
    if (!isAdmin(req.user) && tren.published_by_user_id !== req.user.id) {
      return res
        .status(403)
        .json({ message: "No tienes permiso para editar este tren" });
    }

    const trenData = { ...req.body };
    Object.assign(trenData, parseRequestJsonFields(req.body, JSON_FIELDS));

    if (req.uploadedImages && req.uploadedImages.length > 0) {
      trenData.imagenes = req.uploadedImages.map((img) => img.path);
    }

    await tren.update(trenData);
    const parsedTren = parseItemJsonFields(tren, JSON_FIELDS);

    res.json(parsedTren);
  } catch (error) {
    console.error("❌ Error al actualizar tren:", error);
    res.status(500).json({
      message: "Error al actualizar tren",
      error: error.message,
    });
  }
};

const deleteTren = async (req, res) => {
  try {
    const tren = await Tren.findByPk(req.params.id);

    if (!tren) {
      return res.status(404).json({ message: "Tren no encontrado" });
    }

    // Verificar ownership
    if (!isAdmin(req.user) && tren.published_by_user_id !== req.user.id) {
      return res
        .status(403)
        .json({ message: "No tienes permiso para eliminar este tren" });
    }

    await tren.destroy();
    res.json({ message: "Tren eliminado correctamente" });
  } catch (error) {
    console.error("❌ Error al eliminar tren:", error);
    res.status(500).json({
      message: "Error al eliminar tren",
      error: error.message,
    });
  }
};

module.exports = {
  getTrenes,
  getTren,
  createTren,
  updateTren,
  deleteTren,
};

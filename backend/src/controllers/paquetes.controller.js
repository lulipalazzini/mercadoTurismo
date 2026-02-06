const Paquete = require("../models/Paquete.model");
const User = require("../models/User.model");
const { Op } = require("sequelize");
const {
  parseItemsJsonFields,
  parseItemJsonFields,
  parseRequestJsonFields,
} = require("../utils/parseJsonFields");
const { shouldFilterByOwnership } = require("../middleware/rolePermissions");

// Campos JSON que deben parsearse
const JSON_FIELDS = ["incluye", "imagenes"];

const getPaquetes = async (req, res) => {
  console.log("\n🌄 [PAQUETES] Obteniendo todos los paquetes...");

  // Validar que res.json exista
  if (!res || typeof res.json !== "function") {
    console.error("❌ [PAQUETES] Objeto res inválido");
    return;
  }

  try {
    // APLICAR FILTROS DE OWNERSHIP
    const whereClause = {};

    // Si el usuario está autenticado y debe filtrar por ownership
    if (req.user && shouldFilterByOwnership(req.user, "paquetes")) {
      whereClause.userId = req.user.id;
      console.log(`   Filtrando paquetes del usuario: ${req.user.id}`);
    } else if (req.user) {
      console.log(`   Usuario ${req.user.role}: Ver todos los paquetes`);
    }

    // Usuarios no autenticados pueden ver TODOS los paquetes
    // (No se aplica filtro isPublic para B2C)

    // FILTROS DE BÚSQUEDA ESPECÍFICOS
    const { destino, nochesMin, nochesMax, precioMin, precioMax } = req.query;

    if (destino) {
      whereClause.destino = { [Op.like]: `%${destino}%` };
      console.log(`   Filtrando por destino: ${destino}`);
    }

    if (nochesMin || nochesMax) {
      whereClause.noches = {};
      if (nochesMin) {
        whereClause.noches[Op.gte] = parseInt(nochesMin);
      }
      if (nochesMax) {
        whereClause.noches[Op.lte] = parseInt(nochesMax);
      }
      console.log(`   Filtrando por noches: ${nochesMin || 'N/A'}-${nochesMax || 'N/A'}`);
    }

    if (precioMin || precioMax) {
      whereClause.precio = {};
      if (precioMin) {
        whereClause.precio[Op.gte] = parseFloat(precioMin);
      }
      if (precioMax) {
        whereClause.precio[Op.lte] = parseFloat(precioMax);
      }
      console.log(`   Filtrando por precio: $${precioMin || 'N/A'}-$${precioMax || 'N/A'}`);
    }

    const paquetes = await Paquete.findAll({
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
    console.log(`   Paquetes encontrados: ${paquetes.length}`);
    console.log("✅ [PAQUETES] Paquetes obtenidos exitosamente");

    // Parsear campos JSON
    const parsedPaquetes = parseItemsJsonFields(paquetes, JSON_FIELDS);

    // Asegurar que devolvemos JSON válido
    return res.status(200).json(parsedPaquetes);
  } catch (error) {
    console.error("❌ [PAQUETES] Error en getPaquetes:");
    console.error("   Mensaje:", error.message);
    console.error("   Stack:", error.stack);

    return res.status(500).json({
      success: false,
      message: "Error al obtener paquetes",
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
};

const getPaquete = async (req, res) => {
  try {
    const paquete = await Paquete.findByPk(req.params.id);
    if (!paquete) {
      return res.status(404).json({ message: "Paquete no encontrado" });
    }

    // Parsear campos JSON
    const parsedPaquete = parseItemJsonFields(paquete, JSON_FIELDS);

    res.json(parsedPaquete);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener paquete", error: error.message });
  }
};

const createPaquete = async (req, res) => {
  try {
    console.log("\n➕ [PAQUETES] Creando nuevo paquete...");
    console.log("   Usuario ID:", req.user.id);
    console.log("   Datos:", JSON.stringify(req.body, null, 2));

    const paqueteData = {
      ...req.body,
      cupoDisponible: req.body.cupoMaximo,
      createdBy: req.user.id,
    };

    // Parsear campos JSON que vienen como strings desde FormData
    Object.assign(paqueteData, parseRequestJsonFields(req.body, JSON_FIELDS));

    // Procesar imágenes subidas (si existen)
    // Si hay req.uploadedImages (desde middleware), usar esas rutas
    if (req.uploadedImages && req.uploadedImages.length > 0) {
      paqueteData.imagenes = req.uploadedImages.map((img) => img.path);
      console.log(`   Imágenes cargadas: ${paqueteData.imagenes.length}`);
    }

    const paquete = await Paquete.create(paqueteData);

    console.log(
      `✅ [PAQUETES] Paquete creado exitosamente - ID: ${paquete.id}`,
    );

    // Parsear antes de devolver
    const parsedPaquete = parseItemJsonFields(paquete, JSON_FIELDS);

    res
      .status(201)
      .json({ message: "Paquete creado exitosamente", paquete: parsedPaquete });
  } catch (error) {
    console.error("❌ [PAQUETES] Error en createPaquete:");
    console.error("   Mensaje:", error.message);
    console.error("   Stack:", error.stack);
    res
      .status(500)
      .json({ message: "Error al crear paquete", error: error.message });
  }
};

const updatePaquete = async (req, res) => {
  try {
    const paquete = await Paquete.findByPk(req.params.id);
    if (!paquete) {
      return res.status(404).json({ message: "Paquete no encontrado" });
    }

    const updateData = { ...req.body };

    // Parsear campos JSON
    Object.assign(updateData, parseRequestJsonFields(req.body, JSON_FIELDS));

    // Manejar imágenes
    if (req.uploadedImages && req.uploadedImages.length > 0) {
      // Si hay nuevas imágenes subidas
      const nuevasImagenes = req.uploadedImages.map((img) => img.path);

      // Si hay imágenes existentes que se quieren mantener
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
        // Reemplazar todas las imágenes
        updateData.imagenes = nuevasImagenes;
      }
    } else if (req.body.imagenesExistentes) {
      // Solo mantener las existentes (el usuario eliminó algunas)
      try {
        updateData.imagenes =
          typeof req.body.imagenesExistentes === "string"
            ? JSON.parse(req.body.imagenesExistentes)
            : req.body.imagenesExistentes;
      } catch (e) {
        // Si falla el parse, mantener las actuales
      }
    }

    await paquete.update(updateData);

    // Parsear antes de devolver
    const parsedPaquete = parseItemJsonFields(paquete, JSON_FIELDS);

    res.json({
      message: "Paquete actualizado exitosamente",
      paquete: parsedPaquete,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al actualizar paquete", error: error.message });
  }
};

const deletePaquete = async (req, res) => {
  try {
    const paquete = await Paquete.findByPk(req.params.id);
    if (!paquete) {
      return res.status(404).json({ message: "Paquete no encontrado" });
    }
    await paquete.destroy();
    res.json({ message: "Paquete eliminado exitosamente" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al eliminar paquete", error: error.message });
  }
};

module.exports = {
  getPaquetes,
  getPaquete,
  createPaquete,
  updatePaquete,
  deletePaquete,
};

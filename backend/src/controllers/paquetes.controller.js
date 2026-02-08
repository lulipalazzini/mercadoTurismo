const Paquete = require("../models/Paquete.model");
const User = require("../models/User.model");
const { Op } = require("sequelize");
const {
  parseItemsJsonFields,
  parseItemJsonFields,
  parseRequestJsonFields,
} = require("../utils/parseJsonFields");
const {
  isAdmin,
  buildWhereClause,
  verifyResourceOwnership,
} = require("../middleware/publisherSecurity");

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
    // Construir whereClause base
    const whereClause = {};

    // Si se especifica ?myPaquetes=true, filtrar por usuario (vista dashboard)
    const { myPaquetes } = req.query;

    if (myPaquetes === "true" && req.user) {
      // Vista de dashboard: mostrar paquetes del usuario
      if (!isAdmin(req.user)) {
        whereClause.published_by_user_id = req.user.id;
        console.log(`   🔐 Filtrando paquetes del usuario: ${req.user.id}`);
      } else {
        console.log(`   👑 Admin: Ver todos los paquetes`);
      }
    } else {
      // Vista pública: mostrar todos los paquetes (sin filtro por activo)
      console.log(`   🌍 Vista pública: Mostrando todos los paquetes`);
    }

    // FILTROS DE BÚSQUEDA ESPECÍFICOS
    const {
      destino,
      destination,
      nochesMin,
      nochesMax,
      precioMin,
      precioMax,
      budget,
      currency,
    } = req.query;

    // Manejo de destino (soporta ambos parámetros: destino y destination)
    const destinoFiltro = destino || destination;
    if (destinoFiltro) {
      whereClause.destino = { [Op.like]: `%${destinoFiltro}%` };
      console.log(`   Filtrando por destino: ${destinoFiltro}`);
    }

    if (nochesMin || nochesMax) {
      whereClause.noches = {};
      if (nochesMin) {
        whereClause.noches[Op.gte] = parseInt(nochesMin);
      }
      if (nochesMax) {
        whereClause.noches[Op.lte] = parseInt(nochesMax);
      }
      console.log(
        `   Filtrando por noches: ${nochesMin || "N/A"}-${nochesMax || "N/A"}`,
      );
    }

    // Manejo de precio (soporta budget como precioMax)
    const precioMaxFiltro = precioMax || budget;
    if (precioMin || precioMaxFiltro) {
      whereClause.precio = {};
      if (precioMin) {
        whereClause.precio[Op.gte] = parseFloat(precioMin);
      }
      if (precioMaxFiltro) {
        whereClause.precio[Op.lte] = parseFloat(precioMaxFiltro);
      }
      console.log(
        `   Filtrando por precio: $${precioMin || "N/A"}-$${precioMaxFiltro || "N/A"}`,
      );
    }
    // Nota: currency no se usa porque los paquetes no tienen campo moneda

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

    // ⚠️ VERIFICACIÓN DE SEGURIDAD: Solo el dueño o admin pueden ver detalles
    if (
      req.user &&
      !isAdmin(req.user) &&
      paquete.published_by_user_id !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: "No tienes permiso para ver este paquete",
      });
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
      // ⚠️ SEGURIDAD: Asignar automáticamente published_by_user_id
      published_by_user_id: req.user.id,
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

    // ⚠️ VERIFICACIÓN DE SEGURIDAD: Solo el dueño o admin pueden editar
    if (!isAdmin(req.user) && paquete.published_by_user_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "No tienes permiso para editar este paquete",
      });
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

    // ⚠️ VERIFICACIÓN DE SEGURIDAD: Solo el dueño o admin pueden eliminar
    if (!isAdmin(req.user) && paquete.published_by_user_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "No tienes permiso para eliminar este paquete",
      });
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

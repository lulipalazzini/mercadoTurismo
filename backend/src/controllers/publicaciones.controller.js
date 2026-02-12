const Paquete = require("../models/Paquete.model");
const Alojamiento = require("../models/Alojamiento.model");
const Auto = require("../models/Auto.model");
const Transfer = require("../models/Transfer.model");
const Crucero = require("../models/Crucero.model");
const Excursion = require("../models/Excursion.model");
const SalidaGrupal = require("../models/SalidaGrupal.model");
const Circuito = require("../models/Circuito.model");
const Tren = require("../models/Tren.model");
const Seguro = require("../models/Seguro.model");
const User = require("../models/User.model");

const getModelStatusFilter = (model, extraWhere = {}) => {
  const rawAttributes = model.rawAttributes || {};

  if (rawAttributes.activo) {
    return { ...extraWhere, activo: true };
  }

  if (rawAttributes.disponible) {
    return { ...extraWhere, disponible: true };
  }

  return extraWhere;
};

const getFieldValue = (item, field) =>
  typeof item.get === "function" ? item.get(field) : item[field];

const getFirstDefined = (item, fields) => {
  for (const field of fields) {
    const value = getFieldValue(item, field);
    if (value !== null && value !== undefined && value !== "") {
      return value;
    }
  }
  return null;
};

const toArray = (value) => {
  if (Array.isArray(value)) {
    return value;
  }

  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      return [];
    }
  }

  return [];
};

const extractImageValue = (image) => {
  if (typeof image === "string") {
    return image;
  }

  if (image && typeof image === "object") {
    if (typeof image.url === "string") return image.url;
    if (typeof image.path === "string") return image.path;
    if (typeof image.preview === "string") return image.preview;
  }

  return null;
};

const sanitizeImagePath = (value) => {
  const raw = extractImageValue(value);
  if (!raw) return null;

  const normalized = raw.trim().replace(/\\/g, "/");
  if (!normalized) return null;
  if (normalized.startsWith("data:") || normalized.startsWith("blob:")) {
    return normalized;
  }

  const uploadsMatch = normalized.match(/(?:api\/)?uploads\/[^?#\s"'\\\]]+/i);
  if (uploadsMatch && uploadsMatch[0]) {
    const clean = uploadsMatch[0].replace(/^api\//i, "");
    return `/${clean}`;
  }

  return normalized;
};

const sanitizeImages = (images) =>
  images.map(sanitizeImagePath).filter((value) => typeof value === "string");

const toNumber = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const mapFeaturedItem = (item, tipo) => {
  const nombreBase = getFirstDefined(item, ["nombre"]);
  const nombreAuto = [getFieldValue(item, "marca"), getFieldValue(item, "modelo")]
    .filter(Boolean)
    .join(" ")
    .trim();
  const nombreTransfer = [getFieldValue(item, "origen"), getFieldValue(item, "destino")]
    .filter(Boolean)
    .join(" -> ")
    .trim();

  const nombre =
    nombreBase ||
    (tipo === "auto" ? nombreAuto : "") ||
    (tipo === "transfer" ? nombreTransfer : "") ||
    `${tipo} #${getFieldValue(item, "id")}`;

  const destinos = toArray(getFieldValue(item, "destinos"));
  const puertosDestino = toArray(getFieldValue(item, "puertosDestino"));

  const destino =
    getFirstDefined(item, ["destino", "ubicacion", "origen", "puertoSalida"]) ||
    destinos[0] ||
    puertosDestino[0] ||
    null;

  const precio = toNumber(
    getFirstDefined(item, [
      "precio",
      "precioDia",
      "precioNoche",
      "importeAdulto",
      "precioDesde",
    ]),
  );

  const vendedor = getFieldValue(item, "vendedor");

  return {
    id: getFieldValue(item, "id"),
    tipo,
    nombre,
    descripcion: getFirstDefined(item, ["descripcion"]) || "",
    destino,
    precio,
    imagenes: sanitizeImages(toArray(getFieldValue(item, "imagenes"))),
    destacado: Boolean(getFieldValue(item, "destacado")),
    createdAt: getFieldValue(item, "createdAt"),
    vendedor: vendedor
      ? {
          id: vendedor.id,
          nombre: vendedor.nombre,
          email: vendedor.email,
        }
      : null,
  };
};

/**
 * 🌟 OBTENER PUBLICACIONES DESTACADAS - ENDPOINT PÚBLICO
 * GET /api/publicaciones-destacadas
 */
const getPublicacionesDestacadas = async (req, res) => {
  try {
    console.log("\n🌟 [PUBLIC] Obteniendo publicaciones destacadas...");

    // Modelos a consultar
    const modelsConfig = [
      { model: Paquete, tipo: "paquete", table: "Paquetes" },
      { model: Alojamiento, tipo: "alojamiento", table: "alojamientos" },
      { model: Auto, tipo: "auto", table: "autos" },
      { model: Transfer, tipo: "transfer", table: "transfers" },
      { model: Crucero, tipo: "crucero", table: "cruceros" },
      { model: Excursion, tipo: "excursion", table: "excursiones" },
      { model: SalidaGrupal, tipo: "salidaGrupal", table: "salidas_grupales" },
      { model: Circuito, tipo: "circuito", table: "circuitos" },
      { model: Tren, tipo: "tren", table: "trenes" },
      { model: Seguro, tipo: "seguro", table: "seguros" },
    ];

    const destacadas = [];

    // Consultar cada modelo solo por las destacadas
    for (const { model, tipo } of modelsConfig) {
      try {
        const items = await model.findAll({
          where: getModelStatusFilter(model, { destacado: true }),
          include: [
            {
              model: User,
              as: "vendedor",
              attributes: ["id", "nombre", "email"],
            },
          ],
          order: [["createdAt", "DESC"]],
          limit: 10, // Máximo 10 por tipo
        });

        // Formatear y agregar al array
        items.forEach((item) => {
          destacadas.push(mapFeaturedItem(item, tipo));
        });
      } catch (error) {
        console.error(`⚠️ Error al obtener ${tipo} destacados:`, error.message);
        // Continuar con el siguiente modelo
      }
    }

    // Ordenar por fecha de creación (más recientes primero)
    destacadas.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Limitar a las primeras 10 destacadas en total
    const destacadasLimitadas = destacadas.slice(0, 10);

    console.log(
      `✅ Publicaciones destacadas encontradas: ${destacadasLimitadas.length}`,
    );

    res.json({
      total: destacadasLimitadas.length,
      publicaciones: destacadasLimitadas,
    });
  } catch (error) {
    console.error("❌ Error al obtener publicaciones destacadas:", error);
    res.status(500).json({
      message: "Error al obtener publicaciones destacadas",
      error: error.message,
    });
  }
};

/**
 * 📋 OBTENER TIPOS DE SERVICIOS DISPONIBLES - ENDPOINT PÚBLICO
 * GET /api/tipos-servicios
 * Devuelve los tipos de servicios con cantidad de publicaciones activas
 */
const getTiposServicios = async (req, res) => {
  try {
    console.log("\n📋 [PUBLIC] Obteniendo tipos de servicios disponibles...");

    // Configuración de tipos de servicios
    const tiposConfig = [
      {
        id: "paquetes",
        label: "Paquetes",
        route: "/paquetes",
        model: Paquete,
      },
      {
        id: "alojamientos",
        label: "Alojamientos",
        route: "/alojamientos",
        model: Alojamiento,
      },
      {
        id: "cruceros",
        label: "Cruceros",
        route: "/cruceros",
        model: Crucero,
      },
      {
        id: "autos",
        label: "Autos",
        route: "/autos",
        model: Auto,
      },
      {
        id: "excursiones",
        label: "Excursiones",
        route: "/excursiones",
        model: Excursion,
      },
      {
        id: "salidas-grupales",
        label: "Salidas Grupales",
        route: "/salidas-grupales",
        model: SalidaGrupal,
      },
      {
        id: "seguros",
        label: "Seguros",
        route: "/seguros",
        model: Seguro,
      },
      {
        id: "transfers",
        label: "Transfers",
        route: "/transfers",
        model: Transfer,
      },
      {
        id: "circuitos",
        label: "Circuitos",
        route: "/circuitos",
        model: Circuito,
      },
      {
        id: "trenes",
        label: "Trenes",
        route: "/trenes",
        model: Tren,
      },
    ];

    const tiposDisponibles = [];

    // Consultar cantidad de publicaciones activas por cada tipo
    for (const tipo of tiposConfig) {
      try {
        const count = await tipo.model.count({
          where: getModelStatusFilter(tipo.model),
        });

        tiposDisponibles.push({
          id: tipo.id,
          label: tipo.label,
          route: tipo.route,
          count: count,
          available: count > 0,
        });
      } catch (error) {
        console.error(`⚠️ Error al contar ${tipo.label}:`, error.message);
        tiposDisponibles.push({
          id: tipo.id,
          label: tipo.label,
          route: tipo.route,
          count: 0,
          available: false,
        });
      }
    }

    // Ordenar por label alfabéticamente
    tiposDisponibles.sort((a, b) => a.label.localeCompare(b.label));

    console.log(
      `✅ Tipos de servicios encontrados: ${tiposDisponibles.length}`,
    );

    res.json({
      total: tiposDisponibles.length,
      tipos: tiposDisponibles,
    });
  } catch (error) {
    console.error("❌ Error al obtener tipos de servicios:", error);
    res.status(500).json({
      message: "Error al obtener tipos de servicios",
      error: error.message,
    });
  }
};

/**
 * 📍 OBTENER DESTINOS ÚNICOS - ENDPOINT PÚBLICO
 * GET /api/destinos
 * Devuelve lista de destinos únicos de todas las publicaciones activas
 */
const getDestinos = async (req, res) => {
  try {
    console.log("\n📍 [PUBLIC] Obteniendo destinos únicos...");

    const modelsConfig = [
      { model: Paquete, table: "Paquetes" },
      { model: Alojamiento, table: "alojamientos" },
      { model: Auto, table: "autos" },
      { model: Transfer, table: "transfers" },
      { model: Crucero, table: "cruceros" },
      { model: Excursion, table: "excursiones" },
      { model: SalidaGrupal, table: "salidas_grupales" },
      { model: Circuito, table: "circuitos" },
      { model: Tren, table: "trenes" },
    ];

    const destinosSet = new Set();

    // Consultar cada modelo para obtener destinos únicos
    for (const { model } of modelsConfig) {
      try {
        const rawAttributes = model.rawAttributes || {};
        const candidateFields = [
          "destino",
          "ubicacion",
          "origen",
          "puertoSalida",
          "destinos",
          "puertosDestino",
        ];

        const attributes = candidateFields.filter((field) => rawAttributes[field]);
        if (attributes.length === 0) {
          continue;
        }

        const items = await model.findAll({
          where: getModelStatusFilter(model),
          attributes,
          raw: true,
        });

        items.forEach((item) => {
          const simples = [
            item.destino,
            item.ubicacion,
            item.origen,
            item.puertoSalida,
          ].filter((value) => typeof value === "string" && value.trim());

          simples.forEach((value) => destinosSet.add(value.trim()));

          const destinosArray = toArray(item.destinos);
          destinosArray.forEach((value) => {
            if (typeof value === "string" && value.trim()) {
              destinosSet.add(value.trim());
            }
          });

          const puertosArray = toArray(item.puertosDestino);
          puertosArray.forEach((value) => {
            if (typeof value === "string" && value.trim()) {
              destinosSet.add(value.trim());
            }
          });
        });
      } catch (error) {
        console.error(`⚠️ Error al obtener destinos de modelo:`, error.message);
      }
    }

    // Convertir Set a Array y ordenar alfabéticamente
    const destinos = Array.from(destinosSet).sort((a, b) =>
      a.localeCompare(b, "es", { sensitivity: "base" }),
    );

    console.log(`✅ Destinos únicos encontrados: ${destinos.length}`);

    res.json({
      total: destinos.length,
      destinos: destinos,
    });
  } catch (error) {
    console.error("❌ Error al obtener destinos:", error);
    res.status(500).json({
      message: "Error al obtener destinos",
      error: error.message,
    });
  }
};

/**
 * 🛫 OBTENER ORÍGENES ÚNICOS - ENDPOINT PÚBLICO
 * GET /api/origenes
 * Devuelve lista de orígenes únicos de publicaciones que tienen este campo
 */
const getOrigenes = async (req, res) => {
  try {
    console.log("\n🛫 [PUBLIC] Obteniendo orígenes únicos...");

    // Modelos que tienen campo "origen"
    const modelsConfig = [
      { model: Paquete, table: "Paquetes" },
      { model: Auto, table: "autos" },
      { model: Transfer, table: "transfers" },
      { model: Crucero, table: "cruceros" },
    ];

    const origenesSet = new Set();

    // Consultar cada modelo para obtener orígenes únicos
    for (const { model } of modelsConfig) {
      try {
        const rawAttributes = model.rawAttributes || {};
        const candidateFields = ["origen", "ubicacion", "puertoSalida"];
        const attributes = candidateFields.filter((field) => rawAttributes[field]);

        if (attributes.length === 0) {
          continue;
        }

        const items = await model.findAll({
          where: getModelStatusFilter(model),
          attributes,
          raw: true,
        });

        items.forEach((item) => {
          const values = [item.origen, item.ubicacion, item.puertoSalida].filter(
            (value) => typeof value === "string" && value.trim(),
          );
          values.forEach((value) => origenesSet.add(value.trim()));
        });
      } catch (error) {
        console.error(`⚠️ Error al obtener orígenes de modelo:`, error.message);
      }
    }

    // Convertir Set a Array y ordenar alfabéticamente
    const origenes = Array.from(origenesSet).sort((a, b) =>
      a.localeCompare(b, "es", { sensitivity: "base" }),
    );

    console.log(`✅ Orígenes únicos encontrados: ${origenes.length}`);

    res.json({
      total: origenes.length,
      origenes: origenes,
    });
  } catch (error) {
    console.error("❌ Error al obtener orígenes:", error);
    res.status(500).json({
      message: "Error al obtener orígenes",
      error: error.message,
    });
  }
};

module.exports = {
  getPublicacionesDestacadas,
  getTiposServicios,
  getDestinos,
  getOrigenes,
};

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

/**
 * 🌟 OBTENER PUBLICACIONES DESTACADAS - ENDPOINT PÚBLICO
 * GET /api/publicaciones-destacadas
 */
const getPublicacionesDestacadas = async (req, res) => {
  try {
    console.log("\n🌟 [PUBLIC] Obteniendo publicaciones destacadas...");

    // Configuración de modelos con sus campos específicos
    const modelsConfig = [
      {
        model: Paquete,
        tipo: "paquete",
        statusField: "activo",
        attributes: [
          "id",
          "nombre",
          "descripcion",
          "precio",
          "destino",
          "imagenes",
          "destacado",
          "activo",
          "createdAt",
        ],
        mapFields: (item) => ({
          nombre: item.nombre,
          descripcion: item.descripcion,
          precio: item.precio,
          destino: item.destino,
        }),
      },
      {
        model: Alojamiento,
        tipo: "alojamiento",
        statusField: "activo",
        attributes: [
          "id",
          "nombre",
          "descripcion",
          "precioNoche",
          "ubicacion",
          "imagenes",
          "destacado",
          "activo",
          "createdAt",
        ],
        mapFields: (item) => ({
          nombre: item.nombre,
          descripcion: item.descripcion,
          precio: item.precioNoche,
          destino: item.ubicacion,
        }),
      },
      {
        model: Auto,
        tipo: "auto",
        statusField: "disponible",
        attributes: [
          "id",
          "marca",
          "modelo",
          "descripcion",
          "precioDia",
          "ubicacion",
          "imagenes",
          "destacado",
          "disponible",
          "createdAt",
        ],
        mapFields: (item) => ({
          nombre: `${item.marca} ${item.modelo}`,
          descripcion: item.descripcion,
          precio: item.precioDia,
          destino: item.ubicacion,
        }),
      },
      {
        model: Transfer,
        tipo: "transfer",
        statusField: "disponible",
        attributes: [
          "id",
          "origen",
          "destino",
          "descripcion",
          "precio",
          "imagenes",
          "destacado",
          "disponible",
          "createdAt",
        ],
        mapFields: (item) => ({
          nombre: `Transfer ${item.origen} - ${item.destino}`,
          descripcion: item.descripcion,
          precio: item.precio,
          destino: item.destino,
        }),
      },
      {
        model: Crucero,
        tipo: "crucero",
        statusField: "activo",
        attributes: [
          "id",
          "nombre",
          "descripcion",
          "precioDesde",
          "importeAdulto",
          "puertoSalida",
          "imagenes",
          "destacado",
          "activo",
          "createdAt",
        ],
        mapFields: (item) => ({
          nombre: item.nombre,
          descripcion: item.descripcion,
          precio: item.precioDesde || item.importeAdulto,
          destino: item.puertoSalida,
        }),
      },
      {
        model: Excursion,
        tipo: "excursion",
        statusField: "activo",
        attributes: [
          "id",
          "nombre",
          "descripcion",
          "precio",
          "destino",
          "imagenes",
          "destacado",
          "activo",
          "createdAt",
        ],
        mapFields: (item) => ({
          nombre: item.nombre,
          descripcion: item.descripcion,
          precio: item.precio,
          destino: item.destino,
        }),
      },
      {
        model: SalidaGrupal,
        tipo: "salidaGrupal",
        statusField: "activo",
        attributes: [
          "id",
          "nombre",
          "descripcion",
          "precio",
          "destino",
          "imagenes",
          "destacado",
          "activo",
          "createdAt",
        ],
        mapFields: (item) => ({
          nombre: item.nombre,
          descripcion: item.descripcion,
          precio: item.precio,
          destino: item.destino,
        }),
      },
      {
        model: Circuito,
        tipo: "circuito",
        statusField: "activo",
        attributes: [
          "id",
          "nombre",
          "descripcion",
          "precio",
          "destinos",
          "imagenes",
          "destacado",
          "activo",
          "createdAt",
        ],
        mapFields: (item) => ({
          nombre: item.nombre,
          descripcion: item.descripcion,
          precio: item.precio,
          destino: item.destinos,
        }),
      },
      {
        model: Tren,
        tipo: "tren",
        statusField: "activo",
        attributes: [
          "id",
          "nombre",
          "descripcion",
          "precio",
          "destino",
          "imagenes",
          "destacado",
          "activo",
          "createdAt",
        ],
        mapFields: (item) => ({
          nombre: item.nombre,
          descripcion: item.descripcion,
          precio: item.precio,
          destino: item.destino,
        }),
      },
      {
        model: Seguro,
        tipo: "seguro",
        statusField: "activo",
        attributes: [
          "id",
          "nombre",
          "descripcion",
          "precio",
          "imagenes",
          "destacado",
          "activo",
          "createdAt",
        ],
        mapFields: (item) => ({
          nombre: item.nombre,
          descripcion: item.descripcion,
          precio: item.precio,
          destino: null,
        }),
      },
    ];

    const destacadas = [];

    // Consultar cada modelo solo por las destacadas
    for (const {
      model,
      tipo,
      statusField,
      attributes,
      mapFields,
    } of modelsConfig) {
      try {
        const whereClause = {
          destacado: true,
        };
        // Agregar filtro de estado activo/disponible
        whereClause[statusField] = true;

        const items = await model.findAll({
          where: whereClause,
          attributes: attributes,
          include: [
            {
              model: User,
              as: "vendedor",
              attributes: ["id", "nombre", "email"],
              required: false,
            },
          ],
          order: [["createdAt", "DESC"]],
          limit: 10, // Máximo 10 por tipo
        });

        // Formatear y agregar al array
        items.forEach((item) => {
          const mapped = mapFields(item);
          destacadas.push({
            id: item.id,
            tipo,
            nombre: mapped.nombre || `${tipo} #${item.id}`,
            descripcion: mapped.descripcion || "",
            destino: mapped.destino || null,
            precio: parseFloat(mapped.precio || 0),
            imagenes: item.imagenes || [],
            destacado: item.destacado,
            createdAt: item.createdAt,
            vendedor: item.vendedor
              ? {
                  id: item.vendedor.id,
                  nombre: item.vendedor.nombre,
                  email: item.vendedor.email,
                }
              : null,
          });
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
          where: { activo: true },
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
        const items = await model.findAll({
          where: { activo: true },
          attributes: ["destino"],
          raw: true,
        });

        items.forEach((item) => {
          if (item.destino && item.destino.trim()) {
            destinosSet.add(item.destino.trim());
          }
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
        const items = await model.findAll({
          where: { activo: true },
          attributes: ["origen"],
          raw: true,
        });

        items.forEach((item) => {
          if (item.origen && item.origen.trim()) {
            origenesSet.add(item.origen.trim());
          }
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

const ClickStats = require("../models/ClickStats.model");

// Incrementar contador de clicks para un tipo de card
const incrementClickCount = async (req, res) => {
  try {
    const { cardType, serviceId, serviceName } = req.body;

    console.log("📊 [STATS] Request recibido:", {
      method: req.method,
      path: req.path,
      body: req.body,
      headers: {
        origin: req.headers.origin,
        'content-type': req.headers['content-type'],
      },
    });

    // Validar que el tipo de card sea válido
    const validCardTypes = [
      "alojamiento",
      "auto",
      "circuito",
      "crucero",
      "excursion",
      "paquete",
      "pasaje",
      "salidaGrupal",
      "seguro",
      "transfer",
    ];

    if (!cardType || !validCardTypes.includes(cardType)) {
      console.warn("⚠️  [STATS] Tipo de card inválido:", cardType);
      return res.status(400).json({
        error: "Tipo de card inválido",
        validTypes: validCardTypes,
      });
    }

    // Buscar o crear el registro (por categoría o por servicio específico)
    const whereClause = {
      cardType,
      serviceId: serviceId || null,
    };

    let stat = await ClickStats.findOne({ where: whereClause });

    if (!stat) {
      stat = await ClickStats.create({
        cardType,
        serviceId: serviceId || null,
        serviceName: serviceName || null,
        clicks: 1,
      });
      console.log(`✅ [STATS] Nuevo registro creado: ${stat.cardType} - Clicks: 1`);
    } else {
      stat.clicks += 1;
      // Actualizar el nombre si cambió
      if (serviceName && stat.serviceName !== serviceName) {
        stat.serviceName = serviceName;
      }
      await stat.save();
      console.log(`✅ [STATS] Click incrementado: ${stat.cardType} - Total: ${stat.clicks}`);
    }

    const response = {
      success: true,
      cardType: stat.cardType,
      serviceId: stat.serviceId,
      serviceName: stat.serviceName,
      count: stat.clicks,
    };

    console.log("📤 [STATS] Enviando respuesta:", response);
    
    return res.status(200).json(response);
  } catch (error) {
    console.error("❌ [STATS] Error incrementando contador:");
    console.error("   Mensaje:", error.message);
    console.error("   Stack:", error.stack);
    
    // Asegurar que SIEMPRE devolvemos JSON
    res.setHeader("Content-Type", "application/json");
    return res.status(500).json({ 
      success: false,
      error: "Error al registrar click",
      message: error.message,
      timestamp: new Date().toISOString(),
    });
  }
};

// Obtener todos los contadores
const getAllStats = async (req, res) => {
  try {
    const stats = await ClickStats.findAll({
      order: [["clicks", "DESC"]],
    });

    // Calcular total de clicks
    const totalClicks = stats.reduce((sum, stat) => sum + stat.clicks, 0);

    // Agrupar por categoría
    const statsByCategory = {};
    const categoryTotals = {};

    stats.forEach((stat) => {
      const category = stat.cardType;

      // Inicializar categoría si no existe
      if (!statsByCategory[category]) {
        statsByCategory[category] = [];
        categoryTotals[category] = 0;
      }

      // Sumar al total de la categoría
      categoryTotals[category] += stat.clicks;

      // Si tiene serviceId, es un servicio específico
      if (stat.serviceId) {
        statsByCategory[category].push({
          serviceId: stat.serviceId,
          serviceName: stat.serviceName,
          clicks: stat.clicks,
        });
      }
    });

    // Ordenar servicios dentro de cada categoría por clicks
    Object.keys(statsByCategory).forEach((category) => {
      statsByCategory[category].sort((a, b) => b.clicks - a.clicks);
    });

    // Crear array de categorías con totales
    const categoryStats = Object.entries(categoryTotals)
      .map(([cardType, clicks]) => ({
        cardType,
        clicks,
      }))
      .sort((a, b) => b.clicks - a.clicks);

    res.json({
      success: true,
      totalClicks,
      stats: categoryStats, // Totales por categoría
      statsByCategory, // Servicios específicos por categoría
    });
  } catch (error) {
    console.error("Error obteniendo estadísticas:", error);
    res.status(500).json({ error: "Error en la base de datos" });
  }
};

// Obtener contador de un tipo específico
const getStatByType = async (req, res) => {
  try {
    const { cardType } = req.params;

    const stat = await ClickStats.findOne({ where: { cardType } });

    if (!stat) {
      return res.json({ cardType, count: 0 });
    }

    res.json({
      success: true,
      cardType: stat.cardType,
      count: stat.clicks,
    });
  } catch (error) {
    console.error("Error obteniendo estadística:", error);
    res.status(500).json({ error: "Error en la base de datos" });
  }
};


module.exports = {
  incrementClickCount,
  getAllStats,
  getStatByType
};

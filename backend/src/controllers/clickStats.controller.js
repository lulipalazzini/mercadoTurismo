import ClickStats from "../models/ClickStats.model.js";

// Incrementar contador de clicks para un tipo de card
export const incrementClickCount = async (req, res) => {
  try {
    const { cardType } = req.body;

    // Validación de header de seguridad
    if (req.headers["x-sec-origin"] !== "mercado-turismo-app") {
      return res.status(403).json({ error: "Acceso no autorizado" });
    }

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
      return res.status(400).json({
        error: "Tipo de card inválido",
        validTypes: validCardTypes,
      });
    }

    // Buscar o crear el registro
    let stat = await ClickStats.findOne({ where: { cardType } });

    if (!stat) {
      stat = await ClickStats.create({ cardType, clicks: 1 });
    } else {
      stat.clicks += 1;
      await stat.save();
    }

    res.json({
      success: true,
      cardType: stat.cardType,
      count: stat.clicks,
    });
  } catch (error) {
    console.error("Error incrementando contador:", error);
    res.status(500).json({ error: "Error en la base de datos" });
  }
};

// Obtener todos los contadores
export const getAllStats = async (req, res) => {
  try {
    const stats = await ClickStats.findAll({
      order: [["clicks", "DESC"]],
    });

    const totalClicks = stats.reduce((sum, stat) => sum + stat.clicks, 0);

    res.json({
      success: true,
      totalClicks,
      stats,
    });
  } catch (error) {
    console.error("Error obteniendo estadísticas:", error);
    res.status(500).json({ error: "Error en la base de datos" });
  }
};

// Obtener contador de un tipo específico
export const getStatByType = async (req, res) => {
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

const ClickStats = require("../models/ClickStats.model");
const seedClickStats = async () => {
  try {
    console.log("🔄 Inicializando estadísticas de clicks...");

    const cardTypes = [
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

    // Crear estadísticas base por categoría (sin clicks iniciales)
    for (const cardType of cardTypes) {
      const existingStat = await ClickStats.findOne({
        where: { cardType, serviceId: null },
      });

      if (!existingStat) {
        await ClickStats.create({
          cardType,
          serviceId: null,
          serviceName: null,
          clicks: 0,
        });
        console.log(`✅ Estadística base creada para: ${cardType}`);
      } else {
        console.log(`⏭️  Estadística ya existe para: ${cardType}`);
      }
    }

    console.log("✅ Estadísticas de clicks inicializadas correctamente");
  } catch (error) {
    console.error("❌ Error inicializando estadísticas:", error);
    throw error;
  }
};

module.exports = seedClickStats;
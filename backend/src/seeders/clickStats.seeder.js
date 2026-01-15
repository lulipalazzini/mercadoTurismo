import ClickStats from "../models/ClickStats.model.js";

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

    for (const cardType of cardTypes) {
      const existingStat = await ClickStats.findOne({ where: { cardType } });

      if (!existingStat) {
        await ClickStats.create({
          cardType,
          clicks: 0,
        });
        console.log(`✅ Estadística creada para: ${cardType}`);
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

export default seedClickStats;

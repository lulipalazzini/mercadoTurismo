const { sequelize } = require("./src/config/database");

// Importar todos los modelos
require("./src/models/User.model");
require("./src/models/Alojamiento.model");
require("./src/models/Auto.model");
require("./src/models/Circuito.model");
require("./src/models/Crucero.model");
require("./src/models/Excursion.model");
require("./src/models/Paquete.model");
require("./src/models/SalidaGrupal.model");
require("./src/models/Seguro.model");
require("./src/models/Transfer.model");
require("./src/models/Tren.model");
require("./src/models/Cliente.model");
require("./src/models/Reserva.model");
require("./src/models/ReservaAnotador.model");
require("./src/models/FacturacionAnotador.model");
require("./src/models/CupoMercado.model");
require("./src/models/Cupo.model");
require("./src/models/ClickStats.model");
require("./src/models/ClickTracking.model");
require("./src/models/ActivityLog.model");

async function syncDatabase() {
  try {
    console.log("🔄 Sincronizando base de datos...");

    // Sincronizar todos los modelos sin eliminar datos existentes
    await sequelize.sync({ alter: true });

    console.log("✅ Base de datos sincronizada correctamente");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error al sincronizar base de datos:", error);
    process.exit(1);
  }
}

syncDatabase();

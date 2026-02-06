const { sequelize } = require("./src/config/database");
const Paquete = require("./src/models/Paquete.model");
const Transfer = require("./src/models/Transfer.model");
const Seguro = require("./src/models/Seguro.model");
const Auto = require("./src/models/Auto.model");
const Alojamiento = require("./src/models/Alojamiento.model");
const Circuito = require("./src/models/Circuito.model");
const Crucero = require("./src/models/Crucero.model");
const Excursion = require("./src/models/Excursion.model");
const SalidaGrupal = require("./src/models/SalidaGrupal.model");

async function fixDatabaseSchema() {
  try {
    console.log("🔧 Fixing database schema...");

    // Sincronizar todos los modelos con alter: true
    // Esto agregará las columnas faltantes sin borrar datos
    await sequelize.sync({ alter: true });

    console.log("✅ Database schema fixed successfully!");
    console.log("\n📋 Updated tables:");
    console.log("   - Paquetes (added imagenes column)");
    console.log("   - transfers (verified imagenes column)");
    console.log("   - seguros (verified imagenes column)");
    console.log("   - autos (verified imagenes column)");
    console.log("   - alojamientos (verified imagenes column)");
    console.log("   - circuitos (verified imagenes column)");
    console.log("   - cruceros (verified imagenes column)");
    console.log("   - excursiones (verified imagenes column)");
    console.log("   - salidas_grupales (verified imagenes column)");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error fixing database schema:", error);
    process.exit(1);
  }
}

fixDatabaseSchema();

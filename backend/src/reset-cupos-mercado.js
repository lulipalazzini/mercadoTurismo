import { sequelize } from "./config/database.js";
import CupoMercado from "./models/CupoMercado.model.js";
import { seedCuposMercado } from "./seeders/cuposMercado.seeder.js";

/**
 * Script para resetear la tabla de cupos_mercado con los nuevos campos
 */
const resetCuposMercado = async () => {
  try {
    console.log("\n🔄 Reseteando tabla cupos_mercado...\n");

    // Conectar a la base de datos
    await sequelize.authenticate();
    console.log("✅ Conexión establecida");

    // Forzar la recreación de la tabla
    await CupoMercado.sync({ force: true });
    console.log("✅ Tabla cupos_mercado recreada con nuevos campos");

    // Insertar datos de ejemplo
    await seedCuposMercado();
    console.log("✅ Datos de ejemplo insertados");

    console.log("\n✨ Reset completado exitosamente\n");
    process.exit(0);
  } catch (error) {
    console.error("\n❌ Error:", error.message);
    console.error(error);
    process.exit(1);
  }
};

resetCuposMercado();

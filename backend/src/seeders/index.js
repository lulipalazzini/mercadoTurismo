import { sequelize } from "../config/database.js";
import { seedUsers } from "./users.seeder.js";
import { seedClientes } from "./clientes.seeder.js";
import { seedAlojamientos } from "./alojamientos.seeder.js";
import { seedAutos } from "./autos.seeder.js";
import { seedPaquetes } from "./paquetes.seeder.js";
import { seedExcursiones } from "./excursiones.seeder.js";
import { seedTransfers } from "./transfers.seeder.js";
import { seedSeguros } from "./seguros.seeder.js";
import { seedCruceros } from "./cruceros.seeder.js";
import { seedCircuitos } from "./circuitos.seeder.js";
import { seedSalidasGrupales } from "./salidasGrupales.seeder.js";
import { seedCuposMercado } from "./cuposMercado.seeder.js";
import seedClickStats from "./clickStats.seeder.js";

/**
 * Ejecuta todos los seeders en orden
 * Solo inserta datos si las tablas están vacías
 */
export const runAllSeeders = async () => {
  try {
    console.log("\n🌱 Iniciando seeders...\n");

    // Verificar conexión a la base de datos
    await sequelize.authenticate();
    console.log("✅ Conexión a la base de datos establecida\n");

    // Sincronizar modelos (crear/actualizar tablas)
    // Usar force: true para recrear las tablas y aplicar correctamente los constraints
    await sequelize.sync({ force: true });
    console.log("✅ Tablas sincronizadas\n");

    // Ejecutar seeders en orden (algunos tienen dependencias)
    await seedUsers();
    await seedClientes();
    await seedPaquetes();
    await seedAlojamientos();
    await seedAutos();
    await seedExcursiones();
    await seedTransfers();
    await seedSeguros();
    await seedCruceros();
    await seedCircuitos();
    await seedSalidasGrupales();
    await seedCuposMercado();
    await seedClickStats();

    console.log("\n✨ Todos los seeders se ejecutaron exitosamente\n");
  } catch (error) {
    console.error("\n❌ Error ejecutando seeders:", error.message);
    console.error(error);
    throw error;
  }
};

// Ejecutar seeders cuando este archivo se ejecuta directamente
runAllSeeders()
  .then(() => {
    console.log("✅ Proceso de seeding completado");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Error en el proceso de seeding:", error);
    process.exit(1);
  });

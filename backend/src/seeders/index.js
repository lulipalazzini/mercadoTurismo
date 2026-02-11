const { sequelize } = require("../config/database");
const { seedUsers } = require("./users.seeder");
const { seedClientes } = require("./clientes.seeder");
const { seedAlojamientos } = require("./alojamientos.seeder");
const { seedAutos } = require("./autos.seeder");
const { seedPaquetes } = require("./paquetes.seeder");
const { seedExcursiones } = require("./excursiones.seeder");
const { seedTransfers } = require("./transfers.seeder");
const { seedSeguros } = require("./seguros.seeder");
const { seedCruceros } = require("./cruceros.seeder");
const { seedCircuitos } = require("./circuitos.seeder");
const { seedSalidasGrupales } = require("./salidasGrupales.seeder");
const { seedCuposMercado } = require("./cuposMercado.seeder");
const seedClickStats = require("./clickStats.seeder");

/**
 * Ejecuta todos los seeders en orden
 * Solo inserta datos si las tablas están vacías
 */
const runAllSeeders = async () => {
  try {
    console.log("\n🌱 Iniciando seeders...\n");

    // Verificar conexión a la base de datos
    await sequelize.authenticate();
    console.log("✅ Conexión a la base de datos establecida\n");

    // Sincronizar modelos (crear tablas faltantes)
    // Para recrear tablas y borrar datos, usar SEED_FORCE=true
    const force = process.env.SEED_FORCE === "true";
    await sequelize.sync({ force });
    console.log(
      force
        ? "✅ Tablas recreadas (SEED_FORCE=true)\n"
        : "✅ Tablas sincronizadas (sin borrar datos)\n",
    );

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

module.exports = { runAllSeeders };

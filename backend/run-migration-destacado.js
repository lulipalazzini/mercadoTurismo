/**
 * Script para ejecutar migración: Agregar campo destacado
 * Ejecutar: node run-migration-destacado.js
 */

require("dotenv").config();
const { sequelize } = require("./src/config/database");
const migration = require("./migrations/add-destacado-field");

async function runMigration() {
  try {
    console.log("=".repeat(60));
    console.log("🚀 EJECUTANDO MIGRACIÓN: Agregar campo destacado");
    console.log("=".repeat(60));

    // Conectar a la base de datos
    await sequelize.authenticate();
    console.log("✅ Conexión a base de datos establecida\n");

    // Ejecutar migración
    await migration.up(sequelize.getQueryInterface());

    console.log("\n" + "=".repeat(60));
    console.log("✅ MIGRACIÓN COMPLETADA EXITOSAMENTE");
    console.log("=".repeat(60));

    process.exit(0);
  } catch (error) {
    console.error("\n" + "❌".repeat(30));
    console.error("❌ ERROR AL EJECUTAR MIGRACIÓN:");
    console.error("❌".repeat(30));
    console.error(error);
    console.error("❌".repeat(30) + "\n");
    process.exit(1);
  }
}

runMigration();

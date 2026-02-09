const { sequelize } = require("./src/config/database");

// Importar todos los modelos secundarios
const Cliente = require("./src/models/Cliente.model");
const Reserva = require("./src/models/Reserva.model");
const ReservaAnotador = require("./src/models/ReservaAnotador.model");
const FacturacionAnotador = require("./src/models/FacturacionAnotador.model");
const CupoMercado = require("./src/models/CupoMercado.model");
const Cupo = require("./src/models/Cupo.model");
const ClickStats = require("./src/models/ClickStats.model");
const ClickTracking = require("./src/models/ClickTracking.model");
const ActivityLog = require("./src/models/ActivityLog.model");

async function checkSecondaryTables() {
  try {
    console.log("🔍 Verificando tablas secundarias...\n");

    const models = [
      { name: "Cliente", model: Cliente, tableName: "Clientes" },
      { name: "Reserva", model: Reserva, tableName: "Reservas" },
      { name: "ReservaAnotador", model: ReservaAnotador, tableName: "reservas_anotador" },
      { name: "FacturacionAnotador", model: FacturacionAnotador, tableName: "facturacion_anotador" },
      { name: "CupoMercado", model: CupoMercado, tableName: "cupos_mercado" },
      { name: "Cupo", model: Cupo, tableName: "Cupos" },
      { name: "ClickStats", model: ClickStats, tableName: "click_stats" },
      { name: "ClickTracking", model: ClickTracking, tableName: "click_tracking" },
      { name: "ActivityLog", model: ActivityLog, tableName: "activity_log" },
    ];

    for (const { name, model, tableName } of models) {
      console.log(`\n${"=".repeat(60)}`);
      console.log(`📋 ${name} (${tableName})`);
      console.log("=".repeat(60));

      // Obtener columnas del modelo
      const modelAttributes = Object.keys(model.rawAttributes);
      console.log(`\n✅ Columnas en el MODELO (${modelAttributes.length}):`);
      console.log(modelAttributes.join(", "));

      // Obtener columnas de la tabla
      try {
        const [tableInfo] = await sequelize.query(
          `PRAGMA table_info(${tableName})`
        );

        if (tableInfo.length === 0) {
          console.log(`\n❌ LA TABLA ${tableName} NO EXISTE`);
          continue;
        }

        const dbColumns = tableInfo.map((col) => col.name);
        console.log(
          `\n✅ Columnas en la BASE DE DATOS (${dbColumns.length}):`
        );
        console.log(dbColumns.join(", "));

        // Comparar
        const missingInDb = modelAttributes.filter(
          (col) => !dbColumns.includes(col)
        );
        const extraInDb = dbColumns.filter(
          (col) => !modelAttributes.includes(col)
        );

        if (missingInDb.length > 0) {
          console.log(`\n⚠️  FALTAN EN LA BD (${missingInDb.length}):`);
          console.log(missingInDb.join(", "));
        }

        if (extraInDb.length > 0) {
          console.log(`\n⚠️  SOBRAN EN LA BD (${extraInDb.length}):`);
          console.log(extraInDb.join(", "));
        }

        if (missingInDb.length === 0 && extraInDb.length === 0) {
          console.log("\n✅ TABLA CORRECTA - Sin diferencias");
        }
      } catch (error) {
        console.log(`\n❌ Error al verificar tabla: ${error.message}`);
      }
    }

    console.log(`\n${"=".repeat(60)}`);
    console.log("✅ Verificación completada");
    console.log("=".repeat(60));

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

checkSecondaryTables();

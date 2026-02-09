const { sequelize } = require("./src/config/database");

// Importar todos los modelos
const User = require("./src/models/User.model");
const Alojamiento = require("./src/models/Alojamiento.model");
const Auto = require("./src/models/Auto.model");
const Circuito = require("./src/models/Circuito.model");
const Crucero = require("./src/models/Crucero.model");
const Excursion = require("./src/models/Excursion.model");
const Paquete = require("./src/models/Paquete.model");
const SalidaGrupal = require("./src/models/SalidaGrupal.model");
const Seguro = require("./src/models/Seguro.model");
const Transfer = require("./src/models/Transfer.model");
const Tren = require("./src/models/Tren.model");

async function checkDatabase() {
  try {
    console.log("🔍 Verificando estructura de la base de datos...\n");

    const models = [
      { name: "User", model: User, tableName: "Users" },
      { name: "Alojamiento", model: Alojamiento, tableName: "alojamientos" },
      { name: "Auto", model: Auto, tableName: "autos" },
      { name: "Circuito", model: Circuito, tableName: "circuitos" },
      { name: "Crucero", model: Crucero, tableName: "cruceros" },
      { name: "Excursion", model: Excursion, tableName: "excursiones" },
      { name: "Paquete", model: Paquete, tableName: "paquetes" },
      {
        name: "SalidaGrupal",
        model: SalidaGrupal,
        tableName: "salidas_grupales",
      },
      { name: "Seguro", model: Seguro, tableName: "seguros" },
      { name: "Transfer", model: Transfer, tableName: "transfers" },
      { name: "Tren", model: Tren, tableName: "trenes" },
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
          `PRAGMA table_info(${tableName})`,
        );

        if (tableInfo.length === 0) {
          console.log(`\n❌ LA TABLA ${tableName} NO EXISTE`);
          continue;
        }

        const dbColumns = tableInfo.map((col) => col.name);
        console.log(`\n✅ Columnas en la BASE DE DATOS (${dbColumns.length}):`);
        console.log(dbColumns.join(", "));

        // Comparar
        const missingInDb = modelAttributes.filter(
          (col) => !dbColumns.includes(col),
        );
        const extraInDb = dbColumns.filter(
          (col) => !modelAttributes.includes(col),
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

checkDatabase();

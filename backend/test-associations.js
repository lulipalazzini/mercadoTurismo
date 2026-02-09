const { sequelize } = require("./src/config/database");

// Importar TODOS los modelos
const User = require("./src/models/User.model");
const Paquete = require("./src/models/Paquete.model");
const Alojamiento = require("./src/models/Alojamiento.model");
const Auto = require("./src/models/Auto.model");
const Transfer = require("./src/models/Transfer.model");
const Crucero = require("./src/models/Crucero.model");
const Excursion = require("./src/models/Excursion.model");
const SalidaGrupal = require("./src/models/SalidaGrupal.model");
const Circuito = require("./src/models/Circuito.model");
const Tren = require("./src/models/Tren.model");
const Seguro = require("./src/models/Seguro.model");
const Cliente = require("./src/models/Cliente.model");
const Reserva = require("./src/models/Reserva.model");
const CupoMercado = require("./src/models/CupoMercado.model");

console.log("🔍 ANÁLISIS COMPLETO DE ASOCIACIONES\n");
console.log("=".repeat(80));

const models = [
  { name: "Paquete", model: Paquete, tableName: "paquetes" },
  { name: "Alojamiento", model: Alojamiento, tableName: "alojamientos" },
  { name: "Auto", model: Auto, tableName: "autos" },
  { name: "Transfer", model: Transfer, tableName: "transfers" },
  { name: "Crucero", model: Crucero, tableName: "cruceros" },
  { name: "Excursion", model: Excursion, tableName: "excursiones" },
  { name: "SalidaGrupal", model: SalidaGrupal, tableName: "salidas_grupales" },
  { name: "Circuito", model: Circuito, tableName: "circuitos" },
  { name: "Tren", model: Tren, tableName: "trenes" },
  { name: "Seguro", model: Seguro, tableName: "seguros" },
];

async function testModels() {
  try {
    for (const { name, model, tableName } of models) {
      console.log(`\n${"=".repeat(80)}`);
      console.log(`📋 TESTING: ${name} (${tableName})`);
      console.log("=".repeat(80));

      // Verificar asociaciones
      const associations = Object.keys(model.associations || {});
      console.log(`\n✅ Asociaciones definidas (${associations.length}):`);
      associations.forEach(assoc => {
        const detail = model.associations[assoc];
        console.log(`   - ${assoc} (${detail.associationType})`);
      });

      // Test query básico
      try {
        console.log(`\n🔍 Ejecutando query con include de vendedor...`);
        const items = await model.findAll({
          where: { destacado: true },
          include: [
            {
              model: User,
              as: "vendedor",
              attributes: ["id", "nombre", "email"],
              required: false
            },
          ],
          limit: 1,
        });
        console.log(`✅ Query exitoso - ${items.length} items encontrados`);
      } catch (error) {
        console.error(`❌ ERROR en query: ${error.message}`);
        console.error(`   Stack: ${error.stack}`);
      }

      // Verificar columnas en BD
      try {
        const [tableInfo] = await sequelize.query(
          `PRAGMA table_info(${tableName})`
        );
        
        // Verificar que tenga published_by_user_id
        const hasPublishedBy = tableInfo.some(col => col.name === "published_by_user_id");
        const hasVendedorId = tableInfo.some(col => col.name === "vendedorId");
        const hasUserId = tableInfo.some(col => col.name === "userId");

        console.log(`\n🔍 Columnas de relación:`);
        console.log(`   published_by_user_id: ${hasPublishedBy ? "✅" : "❌"}`);
        console.log(`   vendedorId: ${hasVendedorId ? "✅" : "❌"}`);
        console.log(`   userId: ${hasUserId ? "✅" : "❌"}`);

        // Verificar qué foreignKey está usando la asociación
        const vendedorAssoc = model.associations?.vendedor;
        if (vendedorAssoc) {
          console.log(`\n💡 Asociación 'vendedor' usa foreignKey: ${vendedorAssoc.foreignKey}`);
        } else {
          console.log(`\n❌ No tiene asociación 'vendedor'`);
        }
      } catch (error) {
        console.error(`❌ Error verificando tabla: ${error.message}`);
      }
    }

    console.log(`\n${"=".repeat(80)}`);
    console.log("✅ ANÁLISIS COMPLETADO");
    console.log("=".repeat(80));

    process.exit(0);
  } catch (error) {
    console.error("❌ ERROR FATAL:", error);
    process.exit(1);
  }
}

testModels();

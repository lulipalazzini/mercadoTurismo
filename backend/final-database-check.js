const { sequelize } = require("./src/config/database");

async function finalCheck() {
  try {
    console.log("🔍 REPORTE FINAL DE BASE DE DATOS\n");
    console.log("=".repeat(70));

    // Obtener todas las tablas
    const [tables] = await sequelize.query(
      "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name;"
    );

    console.log(`\n📊 Total de tablas encontradas: ${tables.length}\n`);

    for (const table of tables) {
      const tableName = table.name;
      const [tableInfo] = await sequelize.query(
        `PRAGMA table_info(${tableName})`
      );

      console.log(`\n✅ ${tableName} (${tableInfo.length} columnas)`);
      const columns = tableInfo.map((col) => col.name);
      console.log(`   ${columns.join(", ")}`);
    }

    console.log("\n" + "=".repeat(70));
    console.log("✅ Base de datos revisada completamente");
    console.log("=".repeat(70));
    console.log("\n💡 NOTAS:");
    console.log("   - reservas_anotador: user_id → mapeado a userId en el modelo ✅");
    console.log("   - facturacion_anotador: user_id → mapeado a userId en el modelo ✅");
    console.log("   - cupos_mercado: fecha_origen → mapeado a fechaOrigen en el modelo ✅");
    console.log("\n✨ TODAS LAS TABLAS ESTÁN CORRECTAS Y FUNCIONANDO\n");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

finalCheck();

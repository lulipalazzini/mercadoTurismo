const { sequelize } = require("./src/config/database");

async function fixSalidasGrupales() {
  try {
    console.log("🔍 Verificando tablas de salidas grupales...\n");

    // Verificar qué tablas existen
    const [tables] = await sequelize.query(`
      SELECT name FROM sqlite_master WHERE type='table' AND name LIKE '%alida%';
    `);

    console.log('📋 Tablas encontradas relacionadas con "salida":');
    tables.forEach((t) => console.log(`   - ${t.name}`));

    // Intentar agregar columnas a las tablas posibles
    const possibleNames = [
      "salidas_grupales",
      "SalidasGrupales",
      "SalidaGrupals",
      "SalidaGrupales",
    ];

    for (const tableName of possibleNames) {
      console.log(`\n🔧 Intentando con tabla: ${tableName}`);

      try {
        // Verificar si la tabla existe
        const [info] = await sequelize.query(`PRAGMA table_info(${tableName})`);

        if (info.length > 0) {
          console.log(
            `   ✅ Tabla ${tableName} existe con ${info.length} columnas`,
          );

          // Agregar columnas faltantes
          const columns = [
            {
              name: "userId",
              sql: `ALTER TABLE ${tableName} ADD COLUMN userId INTEGER`,
            },
            {
              name: "isPublic",
              sql: `ALTER TABLE ${tableName} ADD COLUMN isPublic BOOLEAN DEFAULT 0`,
            },
            {
              name: "activo",
              sql: `ALTER TABLE ${tableName} ADD COLUMN activo BOOLEAN DEFAULT 1`,
            },
          ];

          for (const col of columns) {
            try {
              await sequelize.query(col.sql);
              console.log(`   ✅ ${col.name} agregada`);
            } catch (err) {
              if (err.message.includes("duplicate column name")) {
                console.log(`   ℹ️  ${col.name} ya existe`);
              } else {
                console.log(`   ⚠️  ${col.name}: ${err.message}`);
              }
            }
          }
        }
      } catch (err) {
        console.log(`   ⚠️  Tabla ${tableName} no existe`);
      }
    }

    console.log("\n✅ Proceso finalizado");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

fixSalidasGrupales();

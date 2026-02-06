const { sequelize } = require("./src/config/database");

async function createTrenesTable() {
  try {
    console.log("🚄 CREANDO TABLA DE TRENES\n");
    console.log("=".repeat(60));

    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS trenes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL,
        empresa TEXT NOT NULL,
        tipo TEXT NOT NULL DEFAULT 'regional',
        clase TEXT NOT NULL DEFAULT 'economica',
        origen TEXT NOT NULL,
        destino TEXT NOT NULL,
        duracionHoras REAL NOT NULL,
        distanciaKm INTEGER,
        frecuenciaSemanal INTEGER,
        horarioSalida TEXT,
        horarioLlegada TEXT,
        precio REAL NOT NULL,
        moneda TEXT NOT NULL DEFAULT 'USD',
        descripcion TEXT,
        paradas TEXT,
        servicios TEXT,
        imagenes TEXT,
        politicaCancelacion TEXT,
        requisitos TEXT,
        vendedorId INTEGER,
        userId INTEGER,
        isPublic BOOLEAN DEFAULT 0,
        activo BOOLEAN DEFAULT 1,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('✅ Tabla "trenes" creada exitosamente');

    // Verificar estructura
    const [columns] = await sequelize.query(`PRAGMA table_info(trenes)`);
    console.log(`\n📊 Tabla tiene ${columns.length} columnas:`);
    columns.forEach((col) => {
      console.log(`   - ${col.name} (${col.type})`);
    });

    console.log("\n" + "=".repeat(60));
    console.log("✅ MIGRACIÓN COMPLETA");
    console.log("=".repeat(60));
    process.exit(0);
  } catch (error) {
    console.error("❌ Error al crear tabla:", error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

createTrenesTable();

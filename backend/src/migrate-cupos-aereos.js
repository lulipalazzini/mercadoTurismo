import { sequelize } from "./config/database.js";

/**
 * Script de migración para actualizar cupos a solo aéreos
 * - Cambia el campo tipoProducto a ENUM con solo 'aereo'
 * - Elimina todos los cupos que no sean de tipo aéreo
 */

async function migrateCuposToAereos() {
  try {
    console.log("🔄 Iniciando migración de cupos a solo aéreos...\n");

    // Conectar a la base de datos
    await sequelize.authenticate();
    console.log("✅ Conexión a la base de datos establecida\n");

    // 1. Eliminar cupos que no sean aéreos
    console.log("🗑️  Eliminando cupos no aéreos...");
    const [deletedRows] = await sequelize.query(`
      DELETE FROM cupos_mercado 
      WHERE tipoProducto NOT IN ('aereo', 'Pasaje Aéreo');
    `);
    console.log(`   ✓ ${deletedRows.length || 0} cupos eliminados\n`);

    // 2. Actualizar cupos existentes de "Pasaje Aéreo" a "aereo"
    console.log("🔄 Actualizando cupos aéreos existentes...");
    await sequelize.query(`
      UPDATE cupos_mercado 
      SET tipoProducto = 'aereo' 
      WHERE tipoProducto = 'Pasaje Aéreo';
    `);
    console.log("   ✓ Cupos actualizados correctamente\n");

    // 3. Recrear la tabla con el nuevo ENUM (SQLite no soporta ALTER COLUMN)
    console.log("🔧 Recreando tabla con nuevo esquema...");

    // Crear tabla temporal
    await sequelize.query(`
      CREATE TABLE cupos_mercado_new (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        tipoProducto VARCHAR(10) NOT NULL DEFAULT 'aereo' CHECK(tipoProducto IN ('aereo')),
        descripcion TEXT NOT NULL,
        cantidad INTEGER NOT NULL CHECK(cantidad >= 0),
        precioMayorista DECIMAL(10, 2) NOT NULL CHECK(precioMayorista >= 0),
        precioMinorista DECIMAL(10, 2) NOT NULL CHECK(precioMinorista >= 0),
        fechaVencimiento DATE NOT NULL,
        observaciones TEXT,
        estado VARCHAR(20) NOT NULL DEFAULT 'disponible' CHECK(estado IN ('disponible', 'vendido', 'vencido')),
        usuarioVendedorId INTEGER,
        usuarioCompradorId INTEGER,
        createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Copiar datos
    await sequelize.query(`
      INSERT INTO cupos_mercado_new 
      SELECT * FROM cupos_mercado;
    `);

    // Eliminar tabla vieja
    await sequelize.query(`DROP TABLE cupos_mercado;`);

    // Renombrar tabla nueva
    await sequelize.query(
      `ALTER TABLE cupos_mercado_new RENAME TO cupos_mercado;`,
    );

    console.log("   ✓ Tabla recreada exitosamente\n");

    // 4. Verificar resultado
    const [result] = await sequelize.query(`
      SELECT COUNT(*) as total FROM cupos_mercado WHERE tipoProducto = 'aereo';
    `);

    console.log("✅ Migración completada exitosamente!");
    console.log(`📊 Total de cupos aéreos: ${result[0].total}\n`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Error durante la migración:", error.message);
    console.error(error);
    process.exit(1);
  }
}

// Ejecutar migración
migrateCuposToAereos();

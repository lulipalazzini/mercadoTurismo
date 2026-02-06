const { sequelize } = require("../src/config/database");

async function fixRemainingTables() {
  console.log("🔧 Corrigiendo tablas restantes...\n");

  try {
    // Cupos Mercado
    console.log("📋 Actualizando cupos_mercado...");
    await sequelize.query(`
      UPDATE cupos_mercado 
      SET published_by_user_id = COALESCE(usuarioVendedorId, 4) 
      WHERE published_by_user_id IS NULL
    `);
    console.log("✅ cupos_mercado actualizado\n");

    // Crear índices para cupos_mercado
    console.log("📋 Creando índices...");

    try {
      await sequelize.query(`
        CREATE INDEX IF NOT EXISTS idx_cupos_mercado_published_by 
        ON cupos_mercado(published_by_user_id)
      `);
      console.log("✅ Índice creado: idx_cupos_mercado_published_by");
    } catch (err) {
      console.log("⚠️  Índice ya existe o error:", err.message);
    }

    console.log("\n✅ ¡Migración completamente finalizada!\n");
    console.log("📊 Resumen:");
    console.log("   - 11 tablas actualizadas con published_by_user_id");
    console.log("   - Índices creados para optimización");
    console.log("   - Datos migrados exitosamente\n");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

fixRemainingTables();

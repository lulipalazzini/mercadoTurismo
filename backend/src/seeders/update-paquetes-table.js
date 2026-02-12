const { sequelize } = require("../config/database");
const Paquete = require("../models/Paquete.model");
const User = require("../models/User.model");
/**
 * Script para actualizar la base de datos con los nuevos campos:
 * - createdBy: para rastrear quién creó el paquete
 * - deletedAt: para soft delete (paranoid mode)
 */
async function updatePaquetesTable() {
  try {
    console.log("🔄 Iniciando actualización de tabla Paquetes...");

    // Sincronizar modelos con la base de datos
    // alter: true actualiza la tabla sin borrar datos
    await Paquete.sync({ alter: true });

    console.log("✅ Tabla Paquetes actualizada exitosamente");
    console.log("📋 Nuevos campos agregados:");
    console.log("   - createdBy: INTEGER (referencia a Users)");
    console.log("   - deletedAt: DATE (para soft delete)");

    // Cerrar conexión
    await sequelize.close();
    console.log("✨ Proceso completado");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error al actualizar la tabla:", error);
    process.exit(1);
  }
}

// Ejecutar actualización
updatePaquetesTable();

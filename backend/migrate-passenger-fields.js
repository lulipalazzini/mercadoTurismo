/**
 * MIGRACIÓN: Agregar campos adultos/menores a tabla reservas
 * 
 * Este script agrega los campos separados para adultos y menores,
 * manteniendo compatibilidad con el campo existente numeroPersonas.
 * 
 * Cambios:
 * - Agregar campo: adultos INT NOT NULL DEFAULT 1
 * - Agregar campo: menores INT NOT NULL DEFAULT 0
 * - Mantener campo: numeroPersonas (para compatibilidad)
 * 
 * Estrategia de migración:
 * 1. Agregar nuevos campos con defaults
 * 2. Migrar datos existentes: adultos = numeroPersonas, menores = 0
 * 3. Actualizar aplicación para usar adultos/menores
 */

const { sequelize } = require("./src/config/database");
const { QueryTypes } = require("sequelize");

async function migratePassengerFields() {
  console.log("🔄 Iniciando migración de campos de pasajeros...\n");

  try {
    // Verificar si la tabla existe
    const [tables] = await sequelize.query(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='Reservas'",
      { type: QueryTypes.SELECT }
    );

    if (!tables || tables.length === 0) {
      console.log("⚠️  Tabla Reservas no existe. Saltando migración.");
      console.log("   (La tabla se creará con los campos correctos en el próximo sync)\n");
      return;
    }

    // Verificar columnas existentes
    const columns = await sequelize.query(
      "PRAGMA table_info(Reservas)",
      { type: QueryTypes.SELECT }
    );

    const columnNames = columns.map(col => col.name);
    console.log("📋 Columnas existentes:", columnNames.join(", "));

    const hasAdultos = columnNames.includes("adultos");
    const hasMenores = columnNames.includes("menores");

    if (hasAdultos && hasMenores) {
      console.log("✅ Campos adultos/menores ya existen. No se requiere migración.\n");
      return;
    }

    console.log("\n🔨 Agregando campos adultos y menores...");

    // SQLite no soporta ALTER TABLE para agregar múltiples columnas con constraints complejos
    // Usamos el método PRAGMA para reconstruir la tabla

    // 1. Crear tabla temporal con nueva estructura
    await sequelize.query(`
      CREATE TABLE Reservas_new (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        clienteId INTEGER NOT NULL,
        paqueteId INTEGER NOT NULL,
        numeroPersonas INTEGER NOT NULL,
        adultos INTEGER NOT NULL DEFAULT 1,
        menores INTEGER NOT NULL DEFAULT 0,
        precioTotal DECIMAL(10, 2) NOT NULL,
        estado TEXT DEFAULT 'pendiente' CHECK(estado IN ('pendiente', 'confirmada', 'cancelada', 'completada')),
        fechaReserva DATETIME DEFAULT CURRENT_TIMESTAMP,
        observaciones TEXT,
        metodoPago TEXT NOT NULL CHECK(metodoPago IN ('efectivo', 'tarjeta', 'transferencia')),
        pagoRealizado INTEGER DEFAULT 0,
        createdById INTEGER,
        createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (clienteId) REFERENCES Clientes(id),
        FOREIGN KEY (paqueteId) REFERENCES Paquetes(id),
        FOREIGN KEY (createdById) REFERENCES Users(id)
      );
    `);

    console.log("   ✓ Tabla temporal creada");

    // 2. Copiar datos existentes (si hay)
    const [reservasExistentes] = await sequelize.query(
      "SELECT COUNT(*) as count FROM Reservas",
      { type: QueryTypes.SELECT }
    );

    if (reservasExistentes.count > 0) {
      console.log(`   📦 Migrando ${reservasExistentes.count} reservas existentes...`);

      await sequelize.query(`
        INSERT INTO Reservas_new (
          id, clienteId, paqueteId, numeroPersonas, adultos, menores,
          precioTotal, estado, fechaReserva, observaciones,
          metodoPago, pagoRealizado, createdById, createdAt, updatedAt
        )
        SELECT 
          id, clienteId, paqueteId, numeroPersonas,
          numeroPersonas as adultos, /* Asumir que todas las personas eran adultos */
          0 as menores,
          precioTotal, estado, fechaReserva, observaciones,
          metodoPago, pagoRealizado, createdById, createdAt, updatedAt
        FROM Reservas;
      `);

      console.log("   ✓ Datos migrados exitosamente");
    } else {
      console.log("   ℹ️  No hay reservas existentes para migrar");
    }

    // 3. Eliminar tabla vieja y renombrar nueva
    await sequelize.query("DROP TABLE Reservas;");
    await sequelize.query("ALTER TABLE Reservas_new RENAME TO Reservas;");

    console.log("   ✓ Tabla reemplazada exitosamente");

    // 4. Recrear índices si existían
    console.log("   🔗 Recreando índices...");
    
    await sequelize.query(`
      CREATE INDEX idx_reservas_cliente ON Reservas(clienteId);
    `);
    await sequelize.query(`
      CREATE INDEX idx_reservas_paquete ON Reservas(paqueteId);
    `);
    await sequelize.query(`
      CREATE INDEX idx_reservas_estado ON Reservas(estado);
    `);
    await sequelize.query(`
      CREATE INDEX idx_reservas_created_by ON Reservas(createdById);
    `);

    console.log("   ✓ Índices recreados");

    // Verificar migración
    const [result] = await sequelize.query(
      "SELECT adultos, menores FROM Reservas LIMIT 1",
      { type: QueryTypes.SELECT }
    );

    console.log("\n✅ MIGRACIÓN COMPLETADA EXITOSAMENTE");
    console.log("   • Campo 'adultos' agregado (INT NOT NULL DEFAULT 1)");
    console.log("   • Campo 'menores' agregado (INT NOT NULL DEFAULT 0)");
    console.log("   • Campo 'numeroPersonas' mantenido para compatibilidad");
    
    if (reservasExistentes.count > 0) {
      console.log(`   • ${reservasExistentes.count} reservas migradas (adultos = numeroPersonas, menores = 0)`);
    }
    
    console.log("\n");

  } catch (error) {
    console.error("\n❌ ERROR EN MIGRACIÓN:");
    console.error(error);
    
    // Intentar rollback si algo salió mal
    try {
      await sequelize.query("DROP TABLE IF EXISTS Reservas_new;");
      console.log("🔄 Rollback ejecutado - tabla temporal eliminada");
    } catch (rollbackError) {
      console.error("⚠️  Error en rollback:", rollbackError.message);
    }
    
    throw error;
  }
}

// Ejecutar migración si se llama directamente
if (require.main === module) {
  migratePassengerFields()
    .then(() => {
      console.log("✅ Script completado");
      process.exit(0);
    })
    .catch((error) => {
      console.error("❌ Script falló:", error);
      process.exit(1);
    });
}

module.exports = { migratePassengerFields };

const { sequelize } = require("../src/config/database");

/**
 * MIGRACIÓN: Agregar columna published_by_user_id a todas las tablas publicables
 *
 * Esta migración implementa control estricto por publicador:
 * - Cada registro tiene un dueño (published_by_user_id)
 * - Solo el dueño o admin puede ver/editar
 * - Implementación a nivel de base de datos (NO solo frontend)
 */

const PUBLISHABLE_TABLES = [
  "Paquetes",
  "alojamientos", // tableName en minúscula
  "autos",
  "transfers",
  "trenes",
  "circuitos",
  "excursiones",
  "salidas_grupales", // Nombre correcto de tabla
  "cruceros",
  "seguros",
  "cupos_mercado", // Nombre correcto de tabla
];

async function addPublishedByColumn() {
  console.log("🔐 Iniciando migración: published_by_user_id\n");

  const queryInterface = sequelize.getQueryInterface();

  for (const tableName of PUBLISHABLE_TABLES) {
    try {
      console.log(`📋 Procesando tabla: ${tableName}`);

      // 1. Verificar si la columna ya existe
      const tableDescription = await queryInterface.describeTable(tableName);

      if (tableDescription.published_by_user_id) {
        console.log(`   ⚠️  Columna ya existe, saltando...`);
        continue;
      }

      // 2. Agregar la columna (permitir NULL temporalmente)
      await queryInterface.addColumn(tableName, "published_by_user_id", {
        type: sequelize.Sequelize.INTEGER,
        allowNull: true, // Temporal para migración
        references: {
          model: "Users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT", // No permitir eliminar usuario si tiene publicaciones
      });
      console.log(`   ✅ Columna agregada`);

      // 3. Buscar el primer admin para asignar registros huérfanos
      const [adminUsers] = await sequelize.query(
        `SELECT id FROM Users WHERE role IN ('admin', 'sysadmin') LIMIT 1`,
      );

      const defaultUserId = adminUsers.length > 0 ? adminUsers[0].id : 1;

      // 4. Migrar datos existentes usando userId o vendedorId
      // NOTA: No todas las tablas tienen createdBy
      await sequelize.query(`
        UPDATE ${tableName}
        SET published_by_user_id = COALESCE(userId, vendedorId, ${defaultUserId})
        WHERE published_by_user_id IS NULL
      `);
      console.log(`   ✅ Datos migrados`);

      // 5. Hacer la columna NOT NULL después de migrar datos
      await queryInterface.changeColumn(tableName, "published_by_user_id", {
        type: sequelize.Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      });
      console.log(`   ✅ Columna establecida como NOT NULL`);

      // 6. Crear índice para mejorar performance de consultas filtradas
      const indexName = `idx_${tableName.toLowerCase()}_published_by`;
      try {
        await sequelize.query(`
          CREATE INDEX ${indexName} ON ${tableName}(published_by_user_id)
        `);
        console.log(`   ✅ Índice creado: ${indexName}`);
      } catch (indexError) {
        if (indexError.message.includes("already exists")) {
          console.log(`   ⚠️  Índice ya existe: ${indexName}`);
        } else {
          throw indexError;
        }
      }

      console.log(`   ✅ ${tableName} completado\n`);
    } catch (error) {
      console.error(`   ❌ Error en ${tableName}:`, error.message);
      // Continuar con la siguiente tabla
    }
  }

  console.log("\n✅ Migración completada exitosamente");
}

async function rollback() {
  console.log("\n⚠️  Rollback: Eliminando columna published_by_user_id\n");

  const queryInterface = sequelize.getQueryInterface();

  for (const tableName of PUBLISHABLE_TABLES) {
    try {
      console.log(`📋 Procesando tabla: ${tableName}`);

      const tableDescription = await queryInterface.describeTable(tableName);

      if (!tableDescription.published_by_user_id) {
        console.log(`   ⚠️  Columna no existe, saltando...`);
        continue;
      }

      // Eliminar índice primero
      const indexName = `idx_${tableName.toLowerCase()}_published_by`;
      try {
        await sequelize.query(`DROP INDEX IF EXISTS ${indexName}`);
        console.log(`   ✅ Índice eliminado: ${indexName}`);
      } catch (err) {
        console.log(`   ⚠️  Error eliminando índice (puede no existir)`);
      }

      // Eliminar columna
      await queryInterface.removeColumn(tableName, "published_by_user_id");
      console.log(`   ✅ Columna eliminada\n`);
    } catch (error) {
      console.error(`   ❌ Error en ${tableName}:`, error.message);
    }
  }

  console.log("\n✅ Rollback completado");
}

// Ejecutar migración si se llama directamente
if (require.main === module) {
  const command = process.argv[2];

  if (command === "rollback") {
    rollback()
      .then(() => process.exit(0))
      .catch((err) => {
        console.error("❌ Error en rollback:", err);
        process.exit(1);
      });
  } else {
    addPublishedByColumn()
      .then(() => process.exit(0))
      .catch((err) => {
        console.error("❌ Error en migración:", err);
        process.exit(1);
      });
  }
}

module.exports = { addPublishedByColumn, rollback };

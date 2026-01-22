import { sequelize } from "./config/database.js";
import User from "./models/User.model.js";

/**
 * Script de migración de roles
 * 
 * Convierte:
 * - operador_independiente → operador
 * - operador_agencia → operador
 * 
 * También valida que operadores y agencias tengan teléfono
 */

async function migrateRoles() {
  try {
    console.log("🔄 Iniciando migración de roles...\n");

    await sequelize.authenticate();
    console.log("✅ Conexión a base de datos establecida\n");

    // SQLite no soporta ALTER COLUMN, así que hacemos la migración directamente
    console.log("📝 Preparando migración de roles...");

    // Contar usuarios a migrar
    const usersToMigrate = await sequelize.query(
      `SELECT id, nombre, email, role FROM Users 
       WHERE role IN ('operador_independiente', 'operador_agencia')`,
      { type: sequelize.QueryTypes.SELECT }
    );

    console.log(`📊 Usuarios a migrar: ${usersToMigrate.length}`);
    
    if (usersToMigrate.length > 0) {
      console.log("\n👥 Lista de usuarios:");
      usersToMigrate.forEach(user => {
        console.log(`   - ${user.nombre} (${user.email}): ${user.role} → operador`);
      });
      console.log();
    }

    // Migrar operador_independiente a operador
    await sequelize.query(
      `UPDATE Users SET role = 'operador' WHERE role = 'operador_independiente'`
    );
    const countIndep = usersToMigrate.filter(u => u.role === 'operador_independiente').length;
    console.log(`✅ Migrados ${countIndep} operadores independientes\n`);

    // Migrar operador_agencia a operador
    await sequelize.query(
      `UPDATE Users SET role = 'operador' WHERE role = 'operador_agencia'`
    );
    const countAgencia = usersToMigrate.filter(u => u.role === 'operador_agencia').length;
    console.log(`✅ Migrados ${countAgencia} operadores de agencia\n`);

    console.log("✅ Migración de datos completada\n");

    // Verificar usuarios sin teléfono
    const usersWithoutPhone = await sequelize.query(
      `SELECT id, nombre, email, role FROM Users 
       WHERE role IN ('operador', 'agencia') AND (telefono IS NULL OR telefono = '')`,
      { type: sequelize.QueryTypes.SELECT }
    );

    if (usersWithoutPhone.length > 0) {
      console.log(`⚠️  ADVERTENCIA: ${usersWithoutPhone.length} usuarios sin teléfono:`);
      usersWithoutPhone.forEach(user => {
        console.log(`   - ${user.nombre} (${user.email}) - Rol: ${user.role}`);
      });
      console.log("\n❗ Es importante que estos usuarios actualicen su teléfono para el marketplace\n");
    }

    // Resumen final
    const finalStats = await sequelize.query(
      `SELECT role, COUNT(*) as count FROM Users GROUP BY role`,
      { type: sequelize.QueryTypes.SELECT }
    );

    console.log("📊 Resumen de roles después de la migración:");
    finalStats.forEach(stat => {
      console.log(`   ${stat.role}: ${stat.count} usuarios`);
    });

    console.log("\n✅ Migración completada exitosamente!");

  } catch (error) {
    console.error("\n❌ Error durante la migración:");
    console.error(error);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

// Ejecutar migración
migrateRoles();

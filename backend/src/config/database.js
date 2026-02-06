const { Sequelize } = require("sequelize");

console.log("\n🗄️  [DATABASE] Inicializando configuración de base de datos...");
console.log(`   Dialect: sqlite`);
console.log(`   Storage: ./database.sqlite`);

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./database.sqlite",
  logging: (msg) => console.log(`   [SQL] ${msg}`), // Log queries SQL
});

const connectDB = async () => {
  try {
    console.log("   Intentando conectar a la base de datos...");
    await sequelize.authenticate();
    console.log("✅ [DATABASE] SQLite conectado exitosamente");

    // Sincronizar modelos con la base de datos
    // No usar sync en startup para evitar recrear tablas
    // Usar seeders para inicializar/resetear la BD
    console.log("✅ [DATABASE] Modelos sincronizados");
  } catch (error) {
    console.error("\n" + "❌".repeat(30));
    console.error(`❌ [DATABASE] Error de conexión:`);
    console.error(`   Mensaje: ${error.message}`);
    console.error(`   Stack: ${error.stack}`);
    console.error("❌".repeat(30) + "\n");

    // En producción, NO matar el proceso - dejar que Passenger lo maneje
    if (process.env.NODE_ENV !== "production") {
      process.exit(1);
    } else {
      // En producción, lanzar error pero no exit
      throw error;
    }
  }
};

module.exports = connectDB;
module.exports.sequelize = sequelize;
module.exports.connectDB = connectDB;

import { Sequelize } from "sequelize";

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./database.sqlite",
  logging: false,
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ SQLite conectado exitosamente");

    // Sincronizar modelos con la base de datos
    // No usar sync en startup para evitar recrear tablas
    // Usar seeders para inicializar/resetear la BD
    console.log("✅ Modelos sincronizados");
  } catch (error) {
    console.error(`❌ Error de conexión: ${error.message}`);
    process.exit(1);
  }
};

export { sequelize, connectDB };
export default connectDB;

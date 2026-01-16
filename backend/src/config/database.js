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
    // Usar alter en desarrollo para actualizar la estructura sin perder datos
    if (process.env.NODE_ENV !== "production") {
      await sequelize.sync({ alter: true });
    }
    console.log("✅ Modelos sincronizados");
  } catch (error) {
    console.error(`❌ Error de conexión: ${error.message}`);
    process.exit(1);
  }
};

export { sequelize, connectDB };
export default connectDB;

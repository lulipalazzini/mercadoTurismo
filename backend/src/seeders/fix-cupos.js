const { sequelize } = require("../config/database");
const Cupo = require("../models/Cupo.model");
const fixCuposTable = async () => {
  try {
    console.log("🔧 Arreglando tabla de cupos...");

    // Conectar a la base de datos
    await sequelize.authenticate();
    console.log("✅ Conexión establecida");

    // Dropar la tabla de cupos si existe
    await sequelize.query("DROP TABLE IF EXISTS cupos;");
    console.log("✅ Tabla cupos eliminada");

    // Recrear la tabla con la estructura correcta
    await Cupo.sync({ force: true });
    console.log("✅ Tabla cupos recreada con índices correctos");

    await sequelize.close();
    console.log("✅ Proceso completado");
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
};

fixCuposTable();

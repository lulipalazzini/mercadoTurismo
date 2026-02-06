const { sequelize } = require("./src/config/database");

async function addNochesColumn() {
  try {
    console.log("🔧 Agregando columna noches a Paquetes...");

    // Agregar columna noches
    await sequelize.query("ALTER TABLE Paquetes ADD COLUMN noches INTEGER");

    console.log("✅ Columna noches agregada exitosamente");
    process.exit(0);
  } catch (error) {
    if (error.message.includes("duplicate column name")) {
      console.log("ℹ️  La columna noches ya existe");
      process.exit(0);
    } else {
      console.error("❌ Error:", error.message);
      process.exit(1);
    }
  }
}

addNochesColumn();

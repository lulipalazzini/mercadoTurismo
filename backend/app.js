// Entry point para Phusion Passenger (WNPower)

console.log("🚀 [PASSENGER] Iniciando app.js como entry point...");
console.log(`   Working Directory: ${process.cwd()}`);
console.log(`   Node Version: ${process.version}`);
console.log(`   Environment: ${process.env.NODE_ENV || "development"}`);

try {
  // Cargar variables de entorno ANTES de requerir la app
  require("dotenv").config();

  console.log("📝 [PASSENGER] Variables de entorno cargadas:");
  console.log(
    `   JWT_SECRET: ${process.env.JWT_SECRET ? "✅ Configurado" : "❌ FALTA"}`,
  );
  console.log(`   PORT: ${process.env.PORT || "3001"}`);
  console.log(
    `   FRONTEND_URL: ${process.env.FRONTEND_URL || "http://localhost:5173"}`,
  );

  // Requerir y exportar la app
  const app = require("./src/index.js");
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`✅ [PASSENGER] Escuchando en puerto ${PORT}`);
  });
  module.exports = app;


  console.log("✅ [PASSENGER] Aplicación iniciada correctamente");
} catch (err) {
  console.error("❌ [PASSENGER] Error al iniciar aplicación:");
  console.error("   Mensaje:", err.message);
  console.error("   Stack:", err.stack);

  // En lugar de process.exit, lanzar el error para que Passenger lo vea
  throw err;
}

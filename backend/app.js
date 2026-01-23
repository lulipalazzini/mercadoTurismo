// Entry point para Phusion Passenger (WNPower)
console.log("🚀 [PASSENGER] Iniciando app.js como entry point...");
console.log(`   Working Directory: ${process.cwd()}`);
console.log(`   Node Version: ${process.version}`);

try {
  require("./src/index.js");
  console.log("✅ [PASSENGER] Aplicación iniciada correctamente");
} catch (err) {
  console.error("❌ [PASSENGER] Error al iniciar aplicación:");
  console.error("   Mensaje:", err.message);
  console.error("   Stack:", err.stack);
  process.exit(1);
}

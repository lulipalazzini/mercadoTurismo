// Script de diagnóstico para detectar problemas
console.log("🔍 DIAGNÓSTICO DEL BACKEND\n");
console.log("=".repeat(60));

// 1. Verificar Node.js
console.log("\n1️⃣  Node.js:");
console.log(`   Versión: ${process.version}`);
console.log(`   Platform: ${process.platform}`);
console.log(`   Arch: ${process.arch}`);

// 2. Verificar directorio
console.log("\n2️⃣  Directorio:");
console.log(`   CWD: ${process.cwd()}`);
console.log(`   __dirname: ${import.meta.url}`);

// 3. Verificar archivos críticos
import { existsSync } from "fs";
import { join } from "path";

console.log("\n3️⃣  Archivos críticos:");
const files = [
  "app.js",
  "src/index.js",
  "src/config/database.js",
  "src/controllers/paquetes.controller.js",
  "database.sqlite",
  "package.json",
];

for (const file of files) {
  const exists = existsSync(file);
  console.log(`   ${exists ? "✅" : "❌"} ${file}`);
}

// 4. Verificar variables de entorno
console.log("\n4️⃣  Variables de entorno:");
import dotenv from "dotenv";
dotenv.config();

const envVars = [
  "NODE_ENV",
  "PORT",
  "DATABASE_URL",
  "JWT_SECRET",
  "FRONTEND_URL",
];
for (const envVar of envVars) {
  const value = process.env[envVar];
  console.log(
    `   ${value ? "✅" : "⚠️ "} ${envVar}: ${value ? "(configurada)" : "NO configurada"}`,
  );
}

// 5. Intentar conectar a la base de datos
console.log("\n5️⃣  Base de datos:");
try {
  const { sequelize } = await import("./src/config/database.js");
  await sequelize.authenticate();
  console.log("   ✅ Conexión exitosa");

  // Verificar tablas
  const [results] = await sequelize.query(
    "SELECT name FROM sqlite_master WHERE type='table'",
  );
  console.log(`   Tablas encontradas: ${results.length}`);
  results.forEach((table) => console.log(`      - ${table.name}`));
} catch (error) {
  console.log("   ❌ Error de conexión:", error.message);
}

// 6. Verificar modelos
console.log("\n6️⃣  Modelos:");
try {
  await import("./src/models/Paquete.model.js");
  console.log("   ✅ Paquete.model.js");
} catch (error) {
  console.log("   ❌ Error en Paquete.model.js:", error.message);
}

try {
  await import("./src/models/User.model.js");
  console.log("   ✅ User.model.js");
} catch (error) {
  console.log("   ❌ Error en User.model.js:", error.message);
}

// 7. Verificar controladores
console.log("\n7️⃣  Controladores:");
try {
  const paquetesController =
    await import("./src/controllers/paquetes.controller.js");
  console.log("   ✅ paquetes.controller.js");
  console.log(
    `      Funciones exportadas: ${Object.keys(paquetesController).join(", ")}`,
  );
} catch (error) {
  console.log("   ❌ Error en paquetes.controller.js:", error.message);
}

console.log("\n" + "=".repeat(60));
console.log("✅ Diagnóstico completado\n");

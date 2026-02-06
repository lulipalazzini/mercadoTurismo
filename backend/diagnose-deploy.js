#!/usr/bin/env node

/**
 * Script de diagnóstico para problemas de deploy
 * Verifica configuración y conectividad
 */

const fs = require("fs");
const path = require("path");

console.log("🔍 DIAGNÓSTICO DE DEPLOY - MERCADO TURISMO");
console.log("=".repeat(70));
console.log("\n");

// 1. Verificar archivos críticos
console.log("📁 1. VERIFICANDO ARCHIVOS CRÍTICOS\n");

const criticalFiles = [
  "app.js",
  "src/index.js",
  ".env.example",
  "package.json",
  "src/config/database.js",
  "src/controllers/auth.controller.js",
  "src/routes/auth.routes.js",
  "src/models/User.model.js",
];

criticalFiles.forEach((file) => {
  const exists = fs.existsSync(path.join(__dirname, file));
  console.log(`   ${exists ? "✅" : "❌"} ${file}`);
});

// 2. Verificar .env
console.log("\n📝 2. VERIFICANDO .ENV\n");

const envPath = path.join(__dirname, ".env");
if (fs.existsSync(envPath)) {
  console.log("   ✅ Archivo .env existe");
  const envContent = fs.readFileSync(envPath, "utf8");
  const envVars = [
    "PORT",
    "NODE_ENV",
    "JWT_SECRET",
    "DATABASE_URL",
    "FRONTEND_URL",
  ];

  envVars.forEach((varName) => {
    const hasVar = envContent.includes(varName);
    const isEmpty = envContent.includes(`${varName}=`);
    console.log(
      `   ${hasVar ? "✅" : "⚠️ "} ${varName}: ${hasVar ? (isEmpty ? "Definido" : "VACÍO") : "NO DEFINIDO"}`,
    );
  });
} else {
  console.log("   ❌ Archivo .env NO EXISTE");
  console.log("   💡 Copia .env.example a .env y configura las variables");
}

// 3. Verificar package.json
console.log("\n📦 3. VERIFICANDO PACKAGE.JSON\n");

try {
  const pkg = require("./package.json");
  console.log(`   ✅ Nombre: ${pkg.name}`);
  console.log(`   ✅ Versión: ${pkg.version}`);
  console.log(`   ✅ Script start: ${pkg.scripts?.start || "NO DEFINIDO"}`);

  const requiredDeps = [
    "express",
    "sequelize",
    "sqlite3",
    "jsonwebtoken",
    "bcryptjs",
  ];
  console.log("\n   Dependencias críticas:");
  requiredDeps.forEach((dep) => {
    const hasIt = pkg.dependencies?.[dep];
    console.log(`   ${hasIt ? "✅" : "❌"} ${dep}: ${hasIt || "NO INSTALADO"}`);
  });
} catch (error) {
  console.log("   ❌ Error al leer package.json:", error.message);
}

// 4. Verificar estructura de directorios
console.log("\n📂 4. VERIFICANDO ESTRUCTURA DE DIRECTORIOS\n");

const requiredDirs = [
  "src",
  "src/controllers",
  "src/routes",
  "src/models",
  "src/middleware",
  "src/config",
];

requiredDirs.forEach((dir) => {
  const exists = fs.existsSync(path.join(__dirname, dir));
  console.log(`   ${exists ? "✅" : "❌"} ${dir}/`);
});

// 5. Verificar uploads directory
console.log("\n🖼️  5. VERIFICANDO DIRECTORIO DE UPLOADS\n");

const uploadsDir = path.join(__dirname, "uploads");
if (fs.existsSync(uploadsDir)) {
  console.log("   ✅ Directorio uploads existe");
  try {
    fs.accessSync(uploadsDir, fs.constants.W_OK);
    console.log("   ✅ Directorio uploads tiene permisos de escritura");
  } catch {
    console.log("   ❌ Directorio uploads NO tiene permisos de escritura");
  }
} else {
  console.log(
    "   ⚠️  Directorio uploads NO existe (se creará automáticamente)",
  );
}

// 6. Test de database.sqlite
console.log("\n💾 6. VERIFICANDO BASE DE DATOS\n");

const dbPath = path.join(__dirname, "database.sqlite");
if (fs.existsSync(dbPath)) {
  const stats = fs.statSync(dbPath);
  console.log("   ✅ Archivo database.sqlite existe");
  console.log(`   📊 Tamaño: ${(stats.size / 1024).toFixed(2)} KB`);

  try {
    fs.accessSync(dbPath, fs.constants.R_OK | fs.constants.W_OK);
    console.log("   ✅ Base de datos tiene permisos de lectura/escritura");
  } catch {
    console.log("   ❌ Base de datos NO tiene permisos adecuados");
  }
} else {
  console.log(
    "   ⚠️  Archivo database.sqlite NO existe (se creará en primer inicio)",
  );
}

// 7. Resumen y recomendaciones
console.log("\n" + "=".repeat(70));
console.log("📋 RESUMEN Y RECOMENDACIONES\n");

console.log("Para producción en WNPower, asegúrate de:");
console.log("  1. ✓ Tener un .env con todas las variables configuradas");
console.log("  2. ✓ JWT_SECRET debe ser una cadena segura y larga");
console.log("  3. ✓ FRONTEND_URL debe apuntar a https://mercadoturismo.ar");
console.log("  4. ✓ NODE_ENV debe ser 'production'");
console.log("  5. ✓ El directorio tiene permisos de escritura para SQLite");
console.log("  6. ✓ app.js está configurado como entry point en Passenger");
console.log("\nProblemas comunes:");
console.log("  • Error 500: Revisar logs del servidor para ver stack trace");
console.log("  • HTML en lugar de JSON: Middleware JSON mal configurado");
console.log("  • Token inválido: JWT_SECRET diferente entre deploys");
console.log("  • DB locked: Permisos o múltiples instancias escribiendo");
console.log("\n" + "=".repeat(70));

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const path = require("path");
const connectDB = require("./config/database");

console.log("=".repeat(60));
console.log("🚀 INICIANDO SERVIDOR BACKEND - MERCADO TURISMO");
console.log("=".repeat(60));
console.log(`📅 Fecha: ${new Date().toISOString()}`);
console.log(`🖥️  Node Version: ${process.version}`);
console.log(`📁 Working Directory: ${process.cwd()}`);
console.log("=".repeat(60));

// Importar modelos para establecer relaciones
const User = require("./models/User.model");
const CupoMercado = require("./models/CupoMercado.model");

// Importar rutas
const authRoutes = require("./routes/auth.routes");
const clientesRoutes = require("./routes/clientes.routes");
const paquetesRoutes = require("./routes/paquetes.routes");
const reservasRoutes = require("./routes/reservas.routes");
const facturacionRoutes = require("./routes/facturacion.routes");
const alojamientosRoutes = require("./routes/alojamientos.routes");
const autosRoutes = require("./routes/autos.routes");
const circuitosRoutes = require("./routes/circuitos.routes");
const crucerosRoutes = require("./routes/cruceros.routes");
const cuposMercadoRoutes = require("./routes/cuposMercado.routes");
const excursionesRoutes = require("./routes/excursiones.routes");
const salidasGrupalesRoutes = require("./routes/salidasGrupales.routes");
const segurosRoutes = require("./routes/seguros.routes");
const transfersRoutes = require("./routes/transfers.routes");
const trenesRoutes = require("./routes/trenes.routes");
const clickStatsRoutes = require("./routes/clickStats.routes");
const usersRoutes = require("./routes/users.routes");

dotenv.config();

// Establecer relaciones entre modelos
User.hasMany(CupoMercado, {
  foreignKey: "usuarioVendedorId",
  as: "cuposVendidos",
});
CupoMercado.belongsTo(User, {
  foreignKey: "usuarioVendedorId",
  as: "vendedor",
});

User.hasMany(CupoMercado, {
  foreignKey: "usuarioCompradorId",
  as: "cuposComprados",
});
CupoMercado.belongsTo(User, {
  foreignKey: "usuarioCompradorId",
  as: "comprador",
});

const app = express();
const PORT = process.env.PORT || 3001;

console.log("\n📝 Variables de entorno:");
console.log(`   PORT: ${PORT}`);
console.log(`   NODE_ENV: ${process.env.NODE_ENV || "development"}`);
console.log(
  `   DATABASE_URL: ${process.env.DATABASE_URL ? "✅ Configurada" : "❌ NO configurada"}`,
);
console.log(
  `   JWT_SECRET: ${process.env.JWT_SECRET ? "✅ Configurada" : "❌ NO configurada"}`,
);
console.log(
  `   FRONTEND_URL: ${process.env.FRONTEND_URL || "http://localhost:5173"}`,
);

// Conectar a la base de datos
console.log("\n🔌 Conectando a la base de datos...");
connectDB();

// Middlewares de seguridad
app.use(helmet()); // Protección de headers HTTP

// Rate limiting: Previene ataques de fuerza bruta y DDoS
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // Máximo 100 peticiones por IP cada 15 minutos
  message: "Demasiadas peticiones desde esta IP, por favor intenta más tarde.",
  standardHeaders: true,
  legacyHeaders: false,
});
// app.use(limiter); // Comentado temporalmente para testing

// Middlewares básicos - CORS con soporte para múltiples orígenes
/* CORS COMENTADO TEMPORALMENTE PARA TESTING
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://mercadoturismo.ar",
  "https://www.mercadoturismo.ar",
  process.env.FRONTEND_URL,
].filter(Boolean); // Eliminar valores undefined

const corsOptions = {
  origin: function (origin, callback) {
    // Permitir requests sin origin (como mobile apps o curl)
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.warn(`⚠️  CORS: Origin no permitido: ${origin}`);
      callback(null, true); // En producción, podrías cambiarlo a false para mayor seguridad
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));
*/

// CORS simple para testing - PERMITIR TODO
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos (imágenes subidas) con CORS
app.use(
  "/uploads",
  (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    res.header("Cross-Origin-Resource-Policy", "cross-origin");
    next();
  },
  express.static(path.join(__dirname, "../uploads")),
);
console.log(`📁 Directorio de uploads: ${path.join(__dirname, "../uploads")}`);

// Middleware de logging para todas las requests
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`\n${"=".repeat(60)}`);
  console.log(`📥 [${timestamp}] ${req.method} ${req.path}`);
  console.log(`   IP: ${req.ip}`);
  console.log(`   Headers:`, JSON.stringify(req.headers, null, 2));
  if (req.body && Object.keys(req.body).length > 0) {
    console.log(`   Body:`, JSON.stringify(req.body, null, 2));
  }
  console.log(`${"=".repeat(60)}`);
  next();
});

// Middleware para forzar JSON en rutas de API (después de logging, antes de rutas)
app.use("/api", (req, res, next) => {
  res.setHeader("Content-Type", "application/json");
  next();
});

// Health check endpoint (DEBE estar ANTES de las otras rutas)
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    status: "OK",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
    database: "SQLite",
    jwt: process.env.JWT_SECRET ? "Configurado" : "NO CONFIGURADO",
    cors: process.env.FRONTEND_URL || "http://localhost:5173",
  });
});

// Rutas - Con prefijo /api explícito (Passenger NO lo agrega automáticamente)
app.use("/api/auth", authRoutes);
app.use("/api/clientes", clientesRoutes);
app.use("/api/paquetes", paquetesRoutes);
app.use("/api/reservas", reservasRoutes);
app.use("/api/facturacion", facturacionRoutes);
app.use("/api/alojamientos", alojamientosRoutes);
app.use("/api/autos", autosRoutes);
app.use("/api/circuitos", circuitosRoutes);
app.use("/api/cruceros", crucerosRoutes);
app.use("/api/cupos-mercado", cuposMercadoRoutes);
app.use("/api/excursiones", excursionesRoutes);
app.use("/api/salidas-grupales", salidasGrupalesRoutes);
app.use("/api/seguros", segurosRoutes);
app.use("/api/transfers", transfersRoutes);
app.use("/api/trenes", trenesRoutes);
app.use("/api/stats", clickStatsRoutes);
app.use("/api/users", usersRoutes);

// Ruta de prueba en /api
app.get("/api", (req, res) => {
  res.json({ message: "API Mercado Turismo funcionando" });
});

// Ruta raíz
app.get("/", (req, res) => {
  res.json({
    message: "API Mercado Turismo",
    version: "1.0.0",
    endpoints: [
      "/api/auth",
      "/api/paquetes",
      "/api/cupos-mercado",
      "/api/clientes",
      "/api/users",
    ],
  });
});

// Catch-all para rutas no encontradas - Devolver JSON, NO HTML
app.use((req, res) => {
  console.log(`⚠️  [404] Ruta no encontrada: ${req.method} ${req.path}`);
  res.status(404).json({
    success: false,
    message: "Ruta no encontrada",
    path: req.path,
    method: req.method,
    timestamp: new Date().toISOString(),
  });
});

// Manejo de errores - SIEMPRE devolver JSON
app.use((err, req, res, next) => {
  console.error("\n" + "❌".repeat(30));
  console.error("❌ ERROR EN EL SERVIDOR:");
  console.error("❌".repeat(30));
  console.error("📍 Ruta:", req.method, req.path);
  console.error("📝 Error:", err.message);
  console.error("📚 Stack:", err.stack);
  console.error("❌".repeat(30) + "\n");

  // Asegurar que la respuesta sea JSON incluso en caso de error
  res.setHeader("Content-Type", "application/json");

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Error del servidor",
    error: process.env.NODE_ENV === "production" ? undefined : err.stack,
    path: req.path,
    timestamp: new Date().toISOString(),
  });
});

// IMPORTANTE: Para Phusion Passenger (WNPower), NO llamar a app.listen()
// Passenger maneja el puerto automáticamente
// Solo escuchar en desarrollo local

if (require.main === module) {
  // Solo si se ejecuta directamente (desarrollo local)
  const server = app.listen(PORT, () => {
    console.log("\n" + "✅".repeat(30));
    console.log("✅ SERVIDOR INICIADO CORRECTAMENTE (DESARROLLO)");
    console.log("✅".repeat(30));
    console.log(`🚀 Puerto: ${PORT}`);
    console.log(`🌍 Entorno: ${process.env.NODE_ENV || "development"}`);
    console.log(
      `📡 CORS habilitado para: ${process.env.FRONTEND_URL || "http://localhost:5173"}`,
    );
    console.log(`🔗 API disponible en: http://localhost:${PORT}/api`);
    console.log("✅".repeat(30) + "\n");
  });

  // Manejo de errores no capturados (solo en desarrollo)
  process.on("uncaughtException", (error) => {
    console.error("\n💥 UNCAUGHT EXCEPTION:", error);
    console.error("Stack:", error.stack);
    process.exit(1);
  });

  process.on("unhandledRejection", (reason, promise) => {
    console.error("\n💥 UNHANDLED REJECTION:", reason);
    console.error("Promise:", promise);
  });
} else {
  // Ejecutándose bajo Passenger
  console.log("\n" + "✅".repeat(30));
  console.log("✅ APLICACIÓN CARGADA PARA PASSENGER");
  console.log("✅".repeat(30));
  console.log(`🌍 Entorno: ${process.env.NODE_ENV || "development"}`);
  console.log(
    `📡 CORS habilitado para: ${process.env.FRONTEND_URL || "http://localhost:5173"}`,
  );
  console.log(
    `🔒 JWT: ${process.env.JWT_SECRET ? "Configurado" : "NO CONFIGURADO"}`,
  );
  console.log("✅".repeat(30) + "\n");

  // En producción, loguear errores pero no matar el proceso
  process.on("uncaughtException", (error) => {
    console.error("\n💥 UNCAUGHT EXCEPTION (producción):", error);
    console.error("Stack:", error.stack);
    // NO llamar a process.exit() en producción
  });

  process.on("unhandledRejection", (reason, promise) => {
    console.error("\n💥 UNHANDLED REJECTION (producción):", reason);
    console.error("Promise:", promise);
  });
}

// CRÍTICO: Exportar la app para Passenger
module.exports = app;

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
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
app.use(limiter);

// Middlewares básicos
const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Asegurar que todas las respuestas sean JSON
app.use((req, res, next) => {
  res.setHeader("Content-Type", "application/json");
  next();
});

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
    message: "Ruta no encontrada",
    path: req.path,
    method: req.method,
    timestamp: new Date().toISOString(),
  });
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error("\n" + "❌".repeat(30));
  console.error("❌ ERROR EN EL SERVIDOR:");
  console.error("❌".repeat(30));
  console.error("📍 Ruta:", req.method, req.path);
  console.error("📝 Error:", err.message);
  console.error("📚 Stack:", err.stack);
  console.error("❌".repeat(30) + "\n");

  res.status(err.status || 500).json({
    message: "Error del servidor",
    error: err.message,
    path: req.path,
    timestamp: new Date().toISOString(),
  });
});

// Para Phusion Passenger (WNPower), el puerto lo asigna el sistema automáticamente
// Si no hay PORT definido, usa 3001 para desarrollo local
const server = app.listen(PORT, () => {
  console.log("\n" + "✅".repeat(30));
  console.log("✅ SERVIDOR INICIADO CORRECTAMENTE");
  console.log("✅".repeat(30));
  console.log(`🚀 Puerto: ${PORT}`);
  console.log(`🌍 Entorno: ${process.env.NODE_ENV || "development"}`);
  console.log(
    `📡 CORS habilitado para: ${process.env.FRONTEND_URL || "http://localhost:5173"}`,
  );
  console.log(`🔗 API disponible en: http://localhost:${PORT}/api`);
  console.log("✅".repeat(30) + "\n");
});

// Manejo de errores no capturados
process.on("uncaughtException", (error) => {
  console.error("\n💥 UNCAUGHT EXCEPTION:", error);
  console.error("Stack:", error.stack);
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("\n💥 UNHANDLED REJECTION:", reason);
  console.error("Promise:", promise);
});

module.exports = app;

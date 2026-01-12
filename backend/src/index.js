import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/database.js";

// Importar rutas
import authRoutes from "./routes/auth.routes.js";
import clientesRoutes from "./routes/clientes.routes.js";
import paquetesRoutes from "./routes/paquetes.routes.js";
import reservasRoutes from "./routes/reservas.routes.js";
import facturacionRoutes from "./routes/facturacion.routes.js";
import alojamientosRoutes from "./routes/alojamientos.routes.js";
import autosRoutes from "./routes/autos.routes.js";
import circuitosRoutes from "./routes/circuitos.routes.js";
import crucerosRoutes from "./routes/cruceros.routes.js";
import cuposRoutes from "./routes/cupos.routes.js";
import excursionesRoutes from "./routes/excursiones.routes.js";
import pasajesRoutes from "./routes/pasajes.routes.js";
import salidasGrupalesRoutes from "./routes/salidasGrupales.routes.js";
import segurosRoutes from "./routes/seguros.routes.js";
import transfersRoutes from "./routes/transfers.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Conectar a la base de datos
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use("/api/auth", authRoutes);
app.use("/api/clientes", clientesRoutes);
app.use("/api/paquetes", paquetesRoutes);
app.use("/api/reservas", reservasRoutes);
app.use("/api/facturacion", facturacionRoutes);
app.use("/api/alojamientos", alojamientosRoutes);
app.use("/api/autos", autosRoutes);
app.use("/api/circuitos", circuitosRoutes);
app.use("/api/cruceros", crucerosRoutes);
app.use("/api/cupos", cuposRoutes);
app.use("/api/excursiones", excursionesRoutes);
app.use("/api/pasajes", pasajesRoutes);
app.use("/api/salidas-grupales", salidasGrupalesRoutes);
app.use("/api/seguros", segurosRoutes);
app.use("/api/transfers", transfersRoutes);

// Ruta de prueba
app.get("/", (req, res) => {
  res.json({ message: "API Mercado Turismo funcionando" });
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Error del servidor", error: err.message });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});

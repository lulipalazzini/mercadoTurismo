const jwt = require("jsonwebtoken");
const User = require("../models/User.model");

const verifyToken = async (req, res, next) => {
  console.log("\n🔐 [AUTH MIDDLEWARE] Verificando token...");
  const token = req.header("Authorization")?.replace("Bearer ", "");
  console.log(`   Token presente: ${token ? "Sí" : "No"}`);
  console.log(`   Authorization header: ${req.header("Authorization")}`);

  if (!token) {
    console.log("❌ [AUTH MIDDLEWARE] No hay token");
    return res
      .status(401)
      .json({ message: "No hay token, autorización denegada" });
  }

  try {
    console.log("   Verificando token con JWT_SECRET...");
    console.log(
      `   JWT_SECRET presente: ${process.env.JWT_SECRET ? "Sí" : "No"}`,
    );
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    console.log(
      `✅ [AUTH MIDDLEWARE] Token válido - Usuario ID: ${decoded.id}, Role: ${decoded.role}`,
    );

    // 🔐 Verificar si el usuario está activo (solo para no-admins)
    if (decoded.role !== "admin" && decoded.role !== "sysadmin") {
      const usuario = await User.findByPk(decoded.id, {
        attributes: ["id", "activo", "nombre", "email"],
      });

      if (!usuario) {
        console.log("❌ [AUTH MIDDLEWARE] Usuario no encontrado en BD");
        return res.status(401).json({ message: "Usuario no encontrado" });
      }

      if (!usuario.activo) {
        console.log(
          `⚠️ [AUTH MIDDLEWARE] Usuario inactivo: ${usuario.email}`,
        );
        return res.status(403).json({
          message:
            "Tu cuenta está pendiente de activación por un administrador",
          cuentaInactiva: true,
        });
      }

      console.log(`   Usuario activo: ${usuario.email}`);
    }

    next();
  } catch (error) {
    console.error("❌ [AUTH MIDDLEWARE] Error al verificar token:");
    console.error("   Tipo:", error.name);
    console.error("   Mensaje:", error.message);
    res.status(401).json({ message: "Token no válido", error: error.message });
  }
};

const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin" && req.user.role !== "sysadmin") {
    return res
      .status(403)
      .json({ message: "Acceso denegado. Se requiere rol de administrador" });
  }
  next();
};

const isSysAdmin = (req, res, next) => {
  if (req.user.role !== "sysadmin") {
    return res
      .status(403)
      .json({ message: "Acceso denegado. Se requiere rol de SysAdmin" });
  }
  next();
};

const isOperador = (req, res, next) => {
  if (req.user.role !== "operador") {
    return res
      .status(403)
      .json({ message: "Acceso denegado. Se requiere rol de operador" });
  }
  next();
};

const isAgencia = (req, res, next) => {
  if (req.user.role !== "agencia") {
    return res
      .status(403)
      .json({ message: "Acceso denegado. Se requiere rol de agencia" });
  }
  next();
};

const canPublishCupos = (req, res, next) => {
  // ADMIN tiene acceso total
  if (req.user.role === "admin" || req.user.role === "sysadmin") {
    return next();
  }

  // Operadores y agencias pueden publicar
  if (req.user.role !== "operador" && req.user.role !== "agencia") {
    return res
      .status(403)
      .json({ message: "Solo operadores y agencias pueden publicar cupos" });
  }
  next();
};

const canViewMarketplace = (req, res, next) => {
  // ADMIN tiene acceso total
  if (req.user.role === "admin" || req.user.role === "sysadmin") {
    return next();
  }

  // Agencias y operadores pueden ver el marketplace
  if (req.user.role !== "agencia" && req.user.role !== "operador") {
    return res
      .status(403)
      .json({ message: "Solo agencias y operadores pueden ver el marketplace de cupos" });
  }
  next();
};

module.exports = {
  verifyToken,
  isAdmin,
  isSysAdmin,
  isOperador,
  isAgencia,
  canPublishCupos,
  canViewMarketplace,
};

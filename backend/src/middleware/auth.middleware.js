import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res
      .status(401)
      .json({ message: "No hay token, autorización denegada" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Token no válido" });
  }
};

export const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin" && req.user.role !== "sysadmin") {
    return res
      .status(403)
      .json({ message: "Acceso denegado. Se requiere rol de administrador" });
  }
  next();
};

export const isSysAdmin = (req, res, next) => {
  if (req.user.role !== "sysadmin") {
    return res
      .status(403)
      .json({ message: "Acceso denegado. Se requiere rol de SysAdmin" });
  }
  next();
};

export const isOperador = (req, res, next) => {
  if (req.user.role !== "operador") {
    return res
      .status(403)
      .json({ message: "Acceso denegado. Se requiere rol de operador" });
  }
  next();
};

export const isAgencia = (req, res, next) => {
  if (req.user.role !== "agencia") {
    return res
      .status(403)
      .json({ message: "Acceso denegado. Se requiere rol de agencia" });
  }
  next();
};

export const canPublishCupos = (req, res, next) => {
  if (req.user.role !== "operador" && req.user.role !== "agencia") {
    return res
      .status(403)
      .json({ message: "Solo operadores y agencias pueden publicar cupos" });
  }
  next();
};

export const canViewMarketplace = (req, res, next) => {
  if (req.user.role !== "agencia") {
    return res
      .status(403)
      .json({ message: "Solo agencias pueden ver el marketplace de cupos" });
  }
  next();
};

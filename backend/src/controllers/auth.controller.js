const jwt = require("jsonwebtoken");
const User = require("../models/User.model");
const {
  validateCUIT,
  validateEmail,
  validateInternationalPhone,
} = require("../services/validation.service");

const register = async (req, res) => {
  try {
    console.log("\n🔐 [AUTH] Intentando registrar usuario...");
    const { nombre, email, password, role, telefono, direccion } = req.body;
    console.log(`   Email: ${email}`);
    console.log(`   Role: ${role || "user"}`);

    // Validaciones
    if (!nombre || !email || !password) {
      console.log("❌ [AUTH] Faltan campos requeridos");
      return res.status(400).json({
        message: "Nombre, email y contraseña son requeridos",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "La contraseña debe tener al menos 6 caracteres",
      });
    }

    // Verificar si el usuario ya existe
    console.log(`   Verificando si email existe...`);
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      console.log("❌ [AUTH] Email ya registrado");
      return res.status(400).json({ message: "El email ya está registrado" });
    }

    // Crear nuevo usuario
    console.log("   Creando nuevo usuario...");
    const user = await User.create({
      nombre,
      email,
      password,
      role: role || "user",
      telefono,
      direccion,
    });
    console.log(`✅ [AUTH] Usuario creado exitosamente: ID ${user.id}`);

    // Generar token
    console.log("   Generando token JWT...");
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || "secret_key_default",
      { expiresIn: "7d" },
    );
    console.log("✅ [AUTH] Token generado exitosamente");

    res.status(201).json({
      message: "Usuario registrado exitosamente",
      token,
      user: {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("❌ [AUTH] Error en register:");
    console.error("   Tipo:", error.name);
    console.error("   Mensaje:", error.message);
    console.error("   Stack:", error.stack);

    if (error.name === "SequelizeValidationError") {
      console.error("   Errores de validación:", error.errors);
      return res.status(400).json({
        message: "Error de validación",
        errors: error.errors.map((e) => e.message),
      });
    }
    res
      .status(500)
      .json({ message: "Error al registrar usuario", error: error.message });
  }
};

/**
 * Registro profesional B2B (nuevo flujo)
 * POST /api/auth/register-b2b
 */
const registerB2B = async (req, res) => {
  try {
    console.log("\n🏢 [AUTH B2B] Intentando registrar usuario profesional...");

    const {
      // Paso 1: Datos básicos
      email,
      telefono,
      password,
      countryCode,
      acceptedTerms,

      // Paso 2: Identidad fiscal/comercial
      entityType,
      nombre,
      razonSocial,

      // Argentina
      cuit,
      condicionIVA,

      // Exterior
      taxId,
      taxType,

      // Paso 3: Datos del negocio
      provincia,
      ciudad,
      codigoPostal,
      domicilioFiscal,
      domicilioFisico,
      oficinaVirtual,
      whatsapp,
      nombreComercial,
    } = req.body;

    console.log(`   Email: ${email}`);
    console.log(`   País: ${countryCode}`);
    console.log(`   Tipo: ${entityType}`);

    // ========== VALIDACIONES OBLIGATORIAS ==========

    // Validar campos básicos
    if (!email || !password || !telefono || !countryCode) {
      return res.status(400).json({
        message: "Email, contraseña, teléfono y país son campos obligatorios",
      });
    }

    if (!acceptedTerms) {
      return res.status(400).json({
        message: "Debe aceptar los términos y condiciones",
      });
    }

    // Validar email
    if (!validateEmail(email)) {
      return res.status(400).json({
        message: "Email inválido",
      });
    }

    // Validar teléfono internacional
    const phoneValidation = validateInternationalPhone(telefono);
    if (!phoneValidation.valid) {
      return res.status(400).json({
        message: phoneValidation.error,
      });
    }

    // Validar contraseña
    if (password.length < 6) {
      return res.status(400).json({
        message: "La contraseña debe tener al menos 6 caracteres",
      });
    }

    // Verificar que el email no exista
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({
        message: "El email ya está registrado",
      });
    }

    // ========== VALIDACIONES ESPECÍFICAS POR PAÍS ==========

    let fiscalData = {};
    let validationStatus = "pending";

    if (countryCode === "AR") {
      // ARGENTINA - Validación estricta
      if (!cuit || !entityType || !condicionIVA) {
        return res.status(400).json({
          message: "CUIT, tipo de persona y condición IVA son obligatorios",
        });
      }

      // Validar CUIT
      const cuitValidation = validateCUIT(cuit);
      if (!cuitValidation.valid) {
        return res.status(400).json({
          message: cuitValidation.error,
        });
      }

      fiscalData = {
        cuit: cuitValidation.formatted,
        condicionIVA,
        validated: true,
      };

      validationStatus = "validated";
    } else {
      // EXTERIOR - Validación declarativa
      if (!taxId || !taxType) {
        return res.status(400).json({
          message:
            "Número fiscal y tipo de identificación son obligatorios para usuarios del exterior",
        });
      }

      fiscalData = {
        taxId,
        taxType,
        validated: false, // No validamos contra entidades extranjeras
      };

      validationStatus = "incomplete"; // Requiere revisión manual
    }

    // ========== CREAR USUARIO B2B ==========

    const businessData = {
      provincia,
      ciudad,
      codigoPostal,
      domicilioFiscal,
      domicilioFisico,
      oficinaVirtual: oficinaVirtual || false,
      whatsapp,
      nombreComercial,
    };

    const newUser = await User.create({
      nombre: nombre || razonSocial,
      email,
      password,
      telefono: phoneValidation.formatted,
      razonSocial,
      userType: "B2B",
      countryCode,
      entityType,
      fiscalData,
      businessData,
      validationStatus,
      role: "agencia", // Rol por defecto para B2B
    });

    console.log(`✅ [AUTH B2B] Usuario B2B creado: ID ${newUser.id}`);

    // Generar token
    const token = jwt.sign(
      { id: newUser.id, role: newUser.role, userType: "B2B" },
      process.env.JWT_SECRET || "secret_key_default",
      { expiresIn: "7d" },
    );

    res.status(201).json({
      success: true,
      message: "Registro profesional completado exitosamente",
      token,
      user: {
        id: newUser.id,
        nombre: newUser.nombre,
        email: newUser.email,
        role: newUser.role,
        userType: newUser.userType,
        countryCode: newUser.countryCode,
        validationStatus: newUser.validationStatus,
      },
    });
  } catch (error) {
    console.error("❌ [AUTH B2B] Error en registerB2B:");
    console.error("   Mensaje:", error.message);
    console.error("   Stack:", error.stack);

    if (error.name === "SequelizeValidationError") {
      return res.status(400).json({
        message: "Error de validación",
        errors: error.errors.map((e) => e.message),
      });
    }

    res.status(500).json({
      message: "Error al registrar usuario profesional",
      error: error.message,
    });
  }
};

const login = async (req, res) => {
  // Asegurar que SIEMPRE devolvemos JSON, incluso en errores críticos
  res.setHeader("Content-Type", "application/json");

  try {
    console.log("\n🔑 [AUTH] Intentando login...");
    console.log(`   Timestamp: ${new Date().toISOString()}`);
    console.log(`   IP: ${req.ip}`);

    const { email, password } = req.body;
    console.log(`   Email: ${email}`);
    console.log(`   Body recibido:`, {
      email: email ? "✓" : "✗",
      password: password ? "✓" : "✗",
    });

    // Validaciones
    if (!email || !password) {
      console.log("❌ [AUTH] Faltan credenciales");
      return res.status(400).json({
        success: false,
        message: "Email y contraseña son requeridos",
      });
    }

    // Validar formato de email básico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log("❌ [AUTH] Email inválido");
      return res.status(400).json({
        success: false,
        message: "Formato de email inválido",
      });
    }

    // Buscar usuario
    console.log("   Buscando usuario en BD...");
    const user = await User.findOne({ where: { email } });

    if (!user) {
      console.log("❌ [AUTH] Usuario no encontrado");
      return res.status(401).json({
        success: false,
        message: "Credenciales inválidas",
      });
    }
    console.log(`   Usuario encontrado: ID ${user.id}, Role: ${user.role}`);

    // Verificar password
    console.log("   Verificando contraseña...");
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      console.log("❌ [AUTH] Contraseña incorrecta");
      return res.status(401).json({
        success: false,
        message: "Credenciales inválidas",
      });
    }
    console.log("✅ [AUTH] Contraseña válida");

    // 🔐 Verificar si el usuario está activo (solo para no-admins)
    if (user.role !== "admin" && user.role !== "sysadmin") {
      if (!user.activo) {
        console.log(
          `⚠️ [AUTH] Usuario inactivo intenta login: ${user.email}`,
        );
        return res.status(403).json({
          success: false,
          message:
            "Tu cuenta está pendiente de activación por un administrador. Te notificaremos cuando esté lista.",
          cuentaInactiva: true,
        });
      }
    }

    // Verificar JWT_SECRET
    if (!process.env.JWT_SECRET) {
      console.error("❌ [AUTH] JWT_SECRET NO CONFIGURADO");
      return res.status(500).json({
        success: false,
        message: "Error de configuración del servidor",
      });
    }

    // Generar token
    console.log("   Generando token JWT...");
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );
    console.log("✅ [AUTH] Login exitoso - Token generado");

    const response = {
      success: true,
      message: "Login exitoso",
      token,
      user: {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        role: user.role,
        fotoPerfil: user.fotoPerfil,
      },
    };

    console.log("   Enviando respuesta exitosa");
    return res.status(200).json(response);
  } catch (error) {
    console.error("\n" + "❌".repeat(30));
    console.error("❌ [AUTH] ERROR CRÍTICO EN LOGIN");
    console.error("❌".repeat(30));
    console.error("   Tipo:", error.name);
    console.error("   Mensaje:", error.message);
    console.error("   Stack:", error.stack);
    console.error("❌".repeat(30) + "\n");

    // CRÍTICO: Asegurar que SIEMPRE devolvemos JSON
    res.setHeader("Content-Type", "application/json");

    // Identificar tipo de error
    if (error.name === "SequelizeDatabaseError") {
      console.error("   Error de base de datos:", error.message);
      return res.status(500).json({
        success: false,
        message: "Error de base de datos",
        error:
          process.env.NODE_ENV === "production" ? undefined : error.message,
      });
    }

    if (error.name === "JsonWebTokenError") {
      console.error("   Error de JWT:", error.message);
      return res.status(500).json({
        success: false,
        message: "Error al generar token de autenticación",
        error:
          process.env.NODE_ENV === "production" ? undefined : error.message,
      });
    }

    // Error genérico
    return res.status(500).json({
      success: false,
      message: "Error al iniciar sesión",
      error: process.env.NODE_ENV === "production" ? undefined : error.message,
    });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ["password"] },
    });
    res.json(user);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener perfil", error: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, email, currentPassword, newPassword, fotoPerfil } =
      req.body;

    // Verificar que el usuario solo pueda actualizar su propia información
    if (req.user.id !== parseInt(id) && req.user.role !== "admin") {
      return res.status(403).json({
        message: "No tienes permiso para actualizar este usuario",
      });
    }

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Si está cambiando la contraseña
    if (currentPassword && newPassword) {
      // Verificar contraseña actual
      const isMatch = await user.comparePassword(currentPassword);
      if (!isMatch) {
        return res
          .status(401)
          .json({ message: "Contraseña actual incorrecta" });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({
          message: "La nueva contraseña debe tener al menos 6 caracteres",
        });
      }

      user.password = newPassword;
    }

    // Actualizar otros campos si fueron proporcionados
    if (nombre) user.nombre = nombre;
    if (email) {
      // Verificar que el email no esté en uso por otro usuario
      const existingUser = await User.findOne({
        where: { email },
      });
      if (existingUser && existingUser.id !== user.id) {
        return res.status(400).json({
          message: "El email ya está en uso por otro usuario",
        });
      }
      user.email = email;
    }
    if (fotoPerfil !== undefined) user.fotoPerfil = fotoPerfil;

    await user.save();

    res.json({
      message: "Usuario actualizado exitosamente",
      user: {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        role: user.role,
        fotoPerfil: user.fotoPerfil,
      },
    });
  } catch (error) {
    console.error("Error en updateUser:", error);
    res.status(500).json({
      message: "Error al actualizar usuario",
      error: error.message,
    });
  }
};

const verifyAdminPassword = async (req, res) => {
  try {
    const { password } = req.body;
    const userId = req.user.id;

    if (!password) {
      return res.status(400).json({
        message: "La contraseña es requerida",
      });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    if (user.role !== "admin") {
      return res.status(403).json({
        message: "No tienes permisos de administrador",
      });
    }

    const isValid = await user.compareAdminPassword(password);
    if (!isValid) {
      return res.status(401).json({
        message: "Contraseña de administrador incorrecta",
      });
    }

    res.json({
      message: "Contraseña verificada correctamente",
      verified: true,
    });
  } catch (error) {
    console.error("Error en verifyAdminPassword:", error);
    res.status(500).json({
      message: "Error al verificar contraseña",
      error: error.message,
    });
  }
};

module.exports = {
  register,
  registerB2B, // Nuevo endpoint B2B
  login,
  getProfile,
  updateUser,
  verifyAdminPassword,
};

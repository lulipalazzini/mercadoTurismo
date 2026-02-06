const { DataTypes } = require("sequelize");
const bcrypt = require("bcryptjs");
const { sequelize } = require("../config/database");

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: "El nombre es requerido" },
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: { msg: "Email inválido" },
        notEmpty: { msg: "El email es requerido" },
      },
      set(value) {
        this.setDataValue("email", value.toLowerCase().trim());
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: "La contraseña es requerida" },
        len: {
          args: [6, 100],
          msg: "La contraseña debe tener al menos 6 caracteres",
        },
      },
    },
    role: {
      type: DataTypes.ENUM("admin", "sysadmin", "agencia", "operador"),
      defaultValue: "operador",
      allowNull: false,
    },
    agenciaId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment:
        "ID de la agencia a la que pertenece (solo para operador de agencia)",
    },
    telefono: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "Número de teléfono para contacto (WhatsApp)",
    },
    direccion: {
      type: DataTypes.STRING,
    },
    razonSocial: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "Razón social del vendedor (para operadores y agencias)",
    },
    fotoPerfil: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "URL o base64 de la foto de perfil del usuario",
    },
    passwordAdmin: {
      type: DataTypes.STRING,
      allowNull: true,
      comment:
        "Contraseña adicional para acceder a funciones de admin en el dashboard",
    },
    // ============ CAMPOS B2B ============
    userType: {
      type: DataTypes.ENUM("B2C", "B2B"),
      defaultValue: "B2C",
      allowNull: false,
      comment: "Tipo de usuario: B2C (consumidor final) o B2B (profesional)",
    },
    countryCode: {
      type: DataTypes.STRING(3),
      allowNull: true,
      comment: "Código ISO del país desde donde opera (AR, BR, UY, etc)",
    },
    entityType: {
      type: DataTypes.ENUM(
        "fisica",
        "juridica",
        "empresa",
        "independiente",
        "agencia",
        "operador",
        "proveedor",
      ),
      allowNull: true,
      comment:
        "Tipo de entidad: física/jurídica (AR) o empresa/independiente (Exterior)",
    },
    // Datos fiscales/comerciales (JSON flexible)
    fiscalData: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: `Datos fiscales según país:
        Argentina: { cuit, condicionIVA, actividades }
        Exterior: { taxId, taxType, businessRegistry }`,
    },
    // Datos del negocio (JSON flexible)
    businessData: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: `Datos comerciales:
        { provincia, ciudad, codigoPostal, domicilioFiscal, domicilioFisico, 
          oficinaVirtual, whatsapp, nombreComercial, actividadesPrincipales }`,
    },
    // Estado de validación
    validationStatus: {
      type: DataTypes.ENUM("pending", "validated", "rejected", "incomplete"),
      defaultValue: "pending",
      allowNull: false,
      comment:
        "Estado de validación de datos fiscales/comerciales del usuario B2B",
    },
    validationNotes: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment:
        "Notas sobre la validación (razones de rechazo, datos faltantes, etc)",
    },
    validatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: "Fecha y hora de validación exitosa",
    },
    // ============ CAMPOS DE ROLES B2B AVANZADOS ============
    businessModel: {
      type: DataTypes.ENUM(
        "solo_pasajeros", // Vende exclusivamente a pasajeros finales
        "solo_agencias", // Vende exclusivamente a otras agencias
        "mixto", // Vende a ambos
      ),
      allowNull: true,
      comment: "Define a quién vende el usuario B2B",
    },
    serviceType: {
      type: DataTypes.ENUM(
        "intermediario", // Solo intermedia, no produce
        "productor", // Presta servicios propios (hoteles, tours, etc)
        "mixto", // Intermedia Y produce
      ),
      allowNull: true,
      comment: "Define si el usuario produce servicios o solo intermedia",
    },
    isVisibleToPassengers: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      comment:
        "Si true, aparece en búsquedas B2C. Si false, solo visible para B2B",
    },
    calculatedRole: {
      type: DataTypes.ENUM("agencia", "operador"),
      allowNull: true,
      comment:
        "Rol calculado automáticamente basado en businessModel y serviceType",
    },
  },
  {
    timestamps: true,
    hooks: {
      beforeCreate: async (user) => {
        if (user.password) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
        if (user.passwordAdmin) {
          const salt = await bcrypt.genSalt(10);
          user.passwordAdmin = await bcrypt.hash(user.passwordAdmin, salt);
        }
        // Calcular rol automáticamente
        if (user.userType === "B2B") {
          user.calculatedRole = user.calculateB2BRole();
          user.isVisibleToPassengers =
            user.calculatedRole === "agencia" &&
            user.businessModel === "solo_pasajeros";
        }
      },
      beforeUpdate: async (user) => {
        if (user.changed("password")) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
        if (user.changed("passwordAdmin")) {
          const salt = await bcrypt.genSalt(10);
          user.passwordAdmin = await bcrypt.hash(user.passwordAdmin, salt);
        }
        // Recalcular rol si cambiaron los campos relevantes
        if (
          user.userType === "B2B" &&
          (user.changed("businessModel") || user.changed("serviceType"))
        ) {
          user.calculatedRole = user.calculateB2BRole();
          user.isVisibleToPassengers =
            user.calculatedRole === "agencia" &&
            user.businessModel === "solo_pasajeros";
        }
      },
    },
  },
);

// Método para comparar passwords
User.prototype.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Método para comparar password de admin
User.prototype.compareAdminPassword = async function (candidatePassword) {
  if (!this.passwordAdmin) return false;
  return await bcrypt.compare(candidatePassword, this.passwordAdmin);
};

/**
 * Calcula el rol B2B basado en las reglas de negocio
 *
 * AGENCIA: Solo si cumple TODAS:
 * - Vende solo a pasajeros (solo_pasajeros)
 * - Es intermediario puro (intermediario)
 *
 * OPERADOR/PROVEEDOR: Si cumple al menos UNA:
 * - Vende a agencias (solo_agencias o mixto)
 * - Produce servicios (productor o mixto)
 */
User.prototype.calculateB2BRole = function () {
  // Si no tiene datos B2B, es operador por defecto
  if (!this.businessModel || !this.serviceType) {
    return "operador";
  }

  // AGENCIA: Solo pasajeros + Solo intermediario
  if (
    this.businessModel === "solo_pasajeros" &&
    this.serviceType === "intermediario"
  ) {
    return "agencia";
  }

  // OPERADOR/PROVEEDOR: Cualquier otro caso
  return "operador";
};

/**
 * Verifica si el usuario puede ver publicaciones de otros usuarios
 * Solo pueden ver publicaciones ajenas en el Mercado de Cupos
 */
User.prototype.canSeeOthersPublications = function (module) {
  // Excepción: Mercado de Cupos es visible para todos
  if (module === "cuposMercado") {
    return true;
  }
  // En todos los demás módulos, solo ven lo propio
  return false;
};

module.exports = User;

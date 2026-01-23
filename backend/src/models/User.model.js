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

module.exports = User;

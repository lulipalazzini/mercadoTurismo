import { DataTypes } from "sequelize";
import bcrypt from "bcryptjs";
import { sequelize } from "../config/database.js";

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
      type: DataTypes.ENUM("admin", "agencia", "operador_agencia", "operador_independiente"),
      defaultValue: "operador_independiente",
      allowNull: false,
    },
    agenciaId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "ID de la agencia a la que pertenece (solo para operador_agencia)",
    },
    telefono: {
      type: DataTypes.STRING,
    },
    direccion: {
      type: DataTypes.STRING,
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
      },
      beforeUpdate: async (user) => {
        if (user.changed("password")) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
    },
  }
);

// Método para comparar passwords
User.prototype.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

export default User;

const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Cliente = sequelize.define(
  "Cliente",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "Users",
        key: "id",
      },
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true,
        notEmpty: true,
      },
      set(value) {
        this.setDataValue("email", value.toLowerCase().trim());
      },
    },
    telefono: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    direccion: {
      type: DataTypes.STRING,
    },
    dni: {
      type: DataTypes.STRING,
    },
    fechaNacimiento: {
      type: DataTypes.DATE,
    },
    nacionalidad: {
      type: DataTypes.STRING,
    },
    notas: {
      type: DataTypes.TEXT,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = Cliente;

const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Auto = sequelize.define(
  "Auto",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    marca: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    modelo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    categoria: {
      type: DataTypes.ENUM(
        "economico",
        "compacto",
        "sedan",
        "suv",
        "lujo",
        "van",
      ),
      allowNull: false,
      defaultValue: "economico",
    },
    año: {
      type: DataTypes.INTEGER,
      validate: {
        min: 2000,
        max: 2100,
      },
    },
    capacidadPasajeros: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 15,
      },
    },
    transmision: {
      type: DataTypes.ENUM("manual", "automatico"),
      allowNull: false,
      defaultValue: "manual",
    },
    combustible: {
      type: DataTypes.ENUM("gasolina", "diesel", "electrico", "hibrido"),
      allowNull: false,
      defaultValue: "gasolina",
    },
    precioDia: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    ubicacion: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    descripcion: {
      type: DataTypes.TEXT,
    },
    caracteristicas: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
    imagenes: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
    vendedorId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "Users",
        key: "id",
      },
      comment: "ID del vendedor que publicó este auto",
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "Users",
        key: "id",
      },
      comment: "ID del usuario propietario (owner) - usado para filtrado de ownership B2B",
    },
    disponible: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    tableName: "autos",
    timestamps: true,
  },
);

const User = require("./User.model");
Auto.belongsTo(User, {
  foreignKey: "vendedorId",
  as: "vendedor",
});

module.exports = Auto;

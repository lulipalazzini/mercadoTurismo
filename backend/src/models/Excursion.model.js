const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Excursion = sequelize.define(
  "Excursion",
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
        notEmpty: true,
      },
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    destino: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    tipo: {
      type: DataTypes.ENUM(
        "cultural",
        "aventura",
        "naturaleza",
        "gastronomica",
        "deportiva",
        "otra",
      ),
      allowNull: false,
      defaultValue: "cultural",
    },
    duracion: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "Duración en horas",
      validate: {
        min: 1,
      },
    },
    precio: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    incluye: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
    noIncluye: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
    horario: {
      type: DataTypes.STRING,
      comment: "Ej: 9:00 AM - 5:00 PM",
    },
    puntoEncuentro: {
      type: DataTypes.STRING,
    },
    cupoMaximo: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
      },
    },
    cupoDisponible: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    edadMinima: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    nivelDificultad: {
      type: DataTypes.ENUM("facil", "moderado", "dificil"),
      defaultValue: "facil",
    },
    idiomas: {
      type: DataTypes.JSON,
      defaultValue: ["español"],
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
      comment: "ID del vendedor que publicó esta excursión",
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
    activo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    tableName: "excursiones",
    timestamps: true,
  },
);

const User = require("./User.model");
Excursion.belongsTo(User, {
  foreignKey: "vendedorId",
  as: "vendedor",
});

module.exports = Excursion;

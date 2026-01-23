const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Alojamiento = sequelize.define(
  "Alojamiento",
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
    tipo: {
      type: DataTypes.ENUM(
        "hotel",
        "hostel",
        "apartamento",
        "resort",
        "cabaña",
        "otro",
      ),
      allowNull: false,
      defaultValue: "hotel",
    },
    ubicacion: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    direccion: {
      type: DataTypes.STRING,
    },
    estrellas: {
      type: DataTypes.INTEGER,
      validate: {
        min: 1,
        max: 5,
      },
    },
    descripcion: {
      type: DataTypes.TEXT,
    },
    precioNoche: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    habitacionesDisponibles: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0,
      },
    },
    servicios: {
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
      comment: "ID del vendedor que publicó este alojamiento",
    },
    activo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    tableName: "alojamientos",
    timestamps: true,
  },
);

// Asociaciones
const User = require("./User.model");
Alojamiento.belongsTo(User, {
  foreignKey: "vendedorId",
  as: "vendedor",
});

module.exports = Alojamiento;

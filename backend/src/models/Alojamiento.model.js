import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

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
        "otro"
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
    activo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    tableName: "alojamientos",
    timestamps: true,
  }
);

export default Alojamiento;

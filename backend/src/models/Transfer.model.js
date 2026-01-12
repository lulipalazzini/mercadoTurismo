import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

const Transfer = sequelize.define(
  "Transfer",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    tipo: {
      type: DataTypes.ENUM('aeropuerto-hotel', 'hotel-aeropuerto', 'interhotel', 'punto-a-punto'),
      allowNull: false,
      defaultValue: 'aeropuerto-hotel',
    },
    origen: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    destino: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    vehiculo: {
      type: DataTypes.ENUM('sedan', 'van', 'minibus', 'bus'),
      allowNull: false,
      defaultValue: 'sedan',
    },
    capacidadPasajeros: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 50,
      },
    },
    precio: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    duracionEstimada: {
      type: DataTypes.INTEGER,
      comment: 'Duración en minutos',
    },
    servicioCompartido: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    descripcion: {
      type: DataTypes.TEXT,
    },
    incluye: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
    disponible: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    tableName: "transfers",
    timestamps: true,
  }
);

export default Transfer;

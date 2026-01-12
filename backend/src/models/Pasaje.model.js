import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

const Pasaje = sequelize.define(
  "Pasaje",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    tipo: {
      type: DataTypes.ENUM("aereo", "terrestre", "maritimo"),
      allowNull: false,
      defaultValue: "aereo",
    },
    origen: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    destino: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    aerolinea: {
      type: DataTypes.STRING,
    },
    numeroVuelo: {
      type: DataTypes.STRING,
    },
    fechaSalida: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    fechaLlegada: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    horaSalida: {
      type: DataTypes.TIME,
    },
    horaLlegada: {
      type: DataTypes.TIME,
    },
    clase: {
      type: DataTypes.ENUM("economica", "ejecutiva", "primera"),
      defaultValue: "economica",
    },
    precio: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    asientosDisponibles: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0,
      },
    },
    escalas: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: {
        min: 0,
      },
    },
    equipajeIncluido: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    descripcion: {
      type: DataTypes.TEXT,
    },
    activo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    tableName: "pasajes",
    timestamps: true,
  }
);

export default Pasaje;

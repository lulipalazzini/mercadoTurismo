import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

const Circuito = sequelize.define(
  "Circuito",
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
    destinos: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [],
      comment: "Array de ciudades/países del circuito",
    },
    duracion: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
      },
      comment: "Duración en días",
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
      comment: "Lista de servicios incluidos",
    },
    noIncluye: {
      type: DataTypes.JSON,
      defaultValue: [],
      comment: "Lista de servicios no incluidos",
    },
    itinerario: {
      type: DataTypes.JSON,
      defaultValue: [],
      comment: "Detalle día a día del circuito",
    },
    fechaInicio: {
      type: DataTypes.DATE,
    },
    fechaFin: {
      type: DataTypes.DATE,
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
    nivelDificultad: {
      type: DataTypes.ENUM("facil", "moderado", "dificil"),
      defaultValue: "moderado",
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
    tableName: "circuitos",
    timestamps: true,
  }
);

export default Circuito;

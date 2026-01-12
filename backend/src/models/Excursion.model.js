import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

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
      type: DataTypes.ENUM('cultural', 'aventura', 'naturaleza', 'gastronomica', 'deportiva', 'otra'),
      allowNull: false,
      defaultValue: 'cultural',
    },
    duracion: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: 'Duración en horas',
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
      comment: 'Ej: 9:00 AM - 5:00 PM',
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
      type: DataTypes.ENUM('facil', 'moderado', 'dificil'),
      defaultValue: 'facil',
    },
    idiomas: {
      type: DataTypes.JSON,
      defaultValue: ['español'],
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
    tableName: "excursiones",
    timestamps: true,
  }
);

export default Excursion;

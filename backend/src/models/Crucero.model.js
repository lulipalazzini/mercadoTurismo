import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

const Crucero = sequelize.define(
  "Crucero",
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
    naviera: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: "Nombre de la compañía naviera",
    },
    barco: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: "Nombre del barco",
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    itinerario: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [],
      comment: "Puertos y destinos del crucero",
    },
    duracion: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "Duración en noches",
      validate: {
        min: 1,
      },
    },
    fechaSalida: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    fechaRegreso: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    puertoSalida: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    puertoLlegada: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    precioDesde: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0,
      },
      comment: "Precio mínimo según categoría de cabina",
    },
    tiposCabina: {
      type: DataTypes.JSON,
      defaultValue: [],
      comment: "Array con tipos y precios de cabinas",
    },
    incluye: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
    noIncluye: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
    serviciosABordo: {
      type: DataTypes.JSON,
      defaultValue: [],
      comment: "Restaurantes, piscinas, gimnasio, etc.",
    },
    capacidadTotal: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    cabinasDisponibles: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 0,
      },
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
    tableName: "cruceros",
    timestamps: true,
  }
);

export default Crucero;

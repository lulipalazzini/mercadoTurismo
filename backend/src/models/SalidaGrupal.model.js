const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const SalidaGrupal = sequelize.define(
  "SalidaGrupal",
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
    fechaSalida: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    fechaRegreso: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    duracion: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "Duración en días",
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
      comment: "Servicios incluidos",
    },
    noIncluye: {
      type: DataTypes.JSON,
      defaultValue: [],
      comment: "Servicios no incluidos",
    },
    itinerario: {
      type: DataTypes.JSON,
      defaultValue: [],
      comment: "Detalle día a día",
    },
    cupoMinimo: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
      },
      comment: "Cupo mínimo para confirmar salida",
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
    estado: {
      type: DataTypes.ENUM("disponible", "confirmada", "completa", "cancelada"),
      defaultValue: "disponible",
    },
    acompañante: {
      type: DataTypes.STRING,
      comment: "Nombre del guía o coordinador",
    },
    requisitos: {
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
      comment: "ID del vendedor que publicó esta salida grupal",
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
    isPublic: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      comment: "Si true, visible para usuarios B2C no autenticados",
    },
  },
  {
    tableName: "salidas_grupales",
    timestamps: true,
  },
);

const User = require("./User.model");
SalidaGrupal.belongsTo(User, {
  foreignKey: "vendedorId",
  as: "vendedor",
});

module.exports = SalidaGrupal;

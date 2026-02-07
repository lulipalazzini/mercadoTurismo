const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Seguro = sequelize.define(
  "Seguro",
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
    aseguradora: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: "Nombre de la compañía aseguradora",
    },
    tipo: {
      type: DataTypes.ENUM(
        "viaje",
        "medico",
        "cancelacion",
        "equipaje",
        "asistencia",
        "integral",
      ),
      allowNull: false,
      defaultValue: "viaje",
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    cobertura: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [],
      comment: "Lista de coberturas incluidas",
    },
    montoCobertura: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      comment: "Monto máximo de cobertura",
    },
    precio: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0,
      },
      comment: "Precio del seguro",
    },
    duracionMaxima: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "Duración máxima en días",
      validate: {
        min: 1,
      },
    },
    edadMinima: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    edadMaxima: {
      type: DataTypes.INTEGER,
      defaultValue: 99,
    },
    destinosIncluidos: {
      type: DataTypes.JSON,
      defaultValue: [],
      comment: "Países o regiones cubiertas",
    },
    exclusiones: {
      type: DataTypes.JSON,
      defaultValue: [],
      comment: "Situaciones no cubiertas",
    },
    requisitos: {
      type: DataTypes.JSON,
      defaultValue: [],
      comment: "Documentos o condiciones requeridas",
    },
    contactoEmergencia: {
      type: DataTypes.STRING,
      comment: "Teléfono de asistencia 24/7",
    },
    poliza: {
      type: DataTypes.STRING,
      comment: "Número o referencia de póliza",
    },
    imagenes: {
      type: DataTypes.JSON,
      defaultValue: [],
      comment: "Array de URLs de imágenes del seguro",
    },
    vendedorId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "Users",
        key: "id",
      },
      comment: "ID del vendedor que publicó este seguro",
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "Users",
        key: "id",
      },
      comment:
        "ID del usuario propietario (owner) - usado para filtrado de ownership B2B",
    },
    published_by_user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Users",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "RESTRICT",
      comment: "ID del publicador - CONTROL ESTRICTO DE SEGURIDAD",
    },
    activo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    tableName: "seguros",
    timestamps: true,
  },
);

const User = require("./User.model");
Seguro.belongsTo(User, {
  foreignKey: "vendedorId",
  as: "vendedor",
});

module.exports = Seguro;

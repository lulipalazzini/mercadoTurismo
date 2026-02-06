const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const FacturacionAnotador = sequelize.define(
  "FacturacionAnotador",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "user_id",
      comment: "ID del usuario que creó el registro",
    },
    cliente: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: "Nombre del cliente",
    },
    concepto: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: "Concepto de la facturación",
    },
    fecha: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      comment: "Fecha de la factura",
    },
    importe: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      comment: "Importe de la factura",
      validate: {
        min: 0,
      },
    },
    moneda: {
      type: DataTypes.STRING(10),
      allowNull: false,
      defaultValue: "ARS",
      comment: "Moneda del importe",
    },
    estado: {
      type: DataTypes.ENUM("pendiente", "emitida", "cobrada"),
      allowNull: false,
      defaultValue: "pendiente",
      comment: "Estado de la factura",
    },
    observaciones: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "Observaciones adicionales",
    },
  },
  {
    tableName: "facturacion_anotador",
    timestamps: true,
    indexes: [
      {
        fields: ["user_id"],
      },
      {
        fields: ["estado"],
      },
      {
        fields: ["fecha"],
      },
    ],
  },
);

module.exports = FacturacionAnotador;

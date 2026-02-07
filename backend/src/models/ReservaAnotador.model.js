const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const ReservaAnotador = sequelize.define(
  "ReservaAnotador",
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
    servicio: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: "Descripción del servicio reservado",
    },
    fecha: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      comment: "Fecha de la reserva",
    },
    monto: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      comment: "Monto de la reserva",
      validate: {
        min: 0,
      },
    },
    moneda: {
      type: DataTypes.STRING(10),
      allowNull: false,
      defaultValue: "ARS",
      comment: "Moneda del monto",
    },
    estado: {
      type: DataTypes.ENUM("pendiente", "confirmada", "cancelada"),
      allowNull: false,
      defaultValue: "pendiente",
      comment: "Estado de la reserva",
    },
    observaciones: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "Observaciones adicionales",
    },
  },
  {
    tableName: "reservas_anotador",
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

module.exports = ReservaAnotador;

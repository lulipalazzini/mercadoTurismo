const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");
const Cliente = require("./Cliente.model");
const Paquete = require("./Paquete.model");
const User = require("./User.model");

const Reserva = sequelize.define(
  "Reserva",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    clienteId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Cliente,
        key: "id",
      },
    },
    paqueteId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Paquete,
        key: "id",
      },
    },
    numeroPersonas: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
      },
    },
    precioTotal: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    estado: {
      type: DataTypes.ENUM(
        "pendiente",
        "confirmada",
        "cancelada",
        "completada"
      ),
      defaultValue: "pendiente",
    },
    fechaReserva: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    observaciones: {
      type: DataTypes.TEXT,
    },
    metodoPago: {
      type: DataTypes.ENUM("efectivo", "tarjeta", "transferencia"),
      allowNull: false,
    },
    pagoRealizado: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    createdById: {
      type: DataTypes.INTEGER,
      references: {
        model: User,
        key: "id",
      },
    },
  },
  {
    timestamps: true,
  }
);

// Definir relaciones
Reserva.belongsTo(Cliente, { foreignKey: "clienteId", as: "cliente" });
Reserva.belongsTo(Paquete, { foreignKey: "paqueteId", as: "paquete" });
Reserva.belongsTo(User, { foreignKey: "createdById", as: "createdBy" });

module.exports = Reserva;

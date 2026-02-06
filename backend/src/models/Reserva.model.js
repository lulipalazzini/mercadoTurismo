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
      comment: "Total de pasajeros (adultos + menores) - campo legado",
    },
    adultos: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      validate: {
        min: 1,
      },
      comment: "Número de adultos (18+ años)",
    },
    menores: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0,
      },
      comment: "Número de menores (0-17 años)",
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
    hooks: {
      // Calcular numeroPersonas automáticamente antes de crear/actualizar
      beforeValidate: (reserva) => {
        if (reserva.adultos !== undefined && reserva.menores !== undefined) {
          reserva.numeroPersonas = reserva.adultos + reserva.menores;
        }
      },
    },
  }
);

// Definir relaciones
Reserva.belongsTo(Cliente, { foreignKey: "clienteId", as: "cliente" });
Reserva.belongsTo(Paquete, { foreignKey: "paqueteId", as: "paquete" });
Reserva.belongsTo(User, { foreignKey: "createdById", as: "createdBy" });

module.exports = Reserva;

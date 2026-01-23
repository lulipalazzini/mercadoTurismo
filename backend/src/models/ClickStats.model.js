const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const ClickStats = sequelize.define(
  "ClickStats",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    cardType: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: "Tipo de card: alojamiento, auto, paquete, crucero, etc.",
    },
    serviceId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "ID del servicio específico (si aplica)",
    },
    serviceName: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "Nombre del servicio específico",
    },
    clicks: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
    },
  },
  {
    tableName: "click_stats",
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["cardType", "serviceId"],
        name: "unique_card_service",
      },
    ],
  },
);

module.exports = ClickStats;

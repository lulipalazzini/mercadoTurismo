import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

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
      unique: true,
      comment: "Tipo de card: alojamiento, auto, paquete, crucero, etc.",
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
  }
);

export default ClickStats;

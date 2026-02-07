const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

/**
 * Modelo para tracking detallado de clicks en publicaciones
 * Registra cada click individual con información del usuario y contexto
 */
const ClickTracking = sequelize.define(
  "ClickTracking",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "ID del usuario que hizo click (null si no autenticado)",
    },
    empresaId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "ID de la empresa del usuario (si aplica)",
    },
    modulo: {
      type: DataTypes.STRING,
      allowNull: false,
      comment:
        "Módulo: paquetes, alojamientos, autos, transfers, cruceros, etc.",
    },
    publicacionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "ID de la publicación clickeada",
    },
    publicacionTitulo: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "Título/nombre de la publicación para referencia",
    },
    propietarioId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "ID del usuario dueño de la publicación",
    },
    propietarioEmpresa: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "Empresa del propietario de la publicación",
    },
    accion: {
      type: DataTypes.STRING,
      defaultValue: "view",
      comment: "Tipo de acción: view, whatsapp, detail, share, etc.",
    },
    contexto: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "dashboard, minorista, landing, search, etc.",
    },
    ipAddress: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "IP del usuario que hizo click",
    },
    userAgent: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "User agent del navegador",
    },
    metadata: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: "Información adicional en formato JSON",
    },
  },
  {
    tableName: "click_tracking",
    timestamps: true,
    indexes: [
      { fields: ["userId"] },
      { fields: ["empresaId"] },
      { fields: ["modulo"] },
      { fields: ["publicacionId"] },
      { fields: ["propietarioId"] },
      { fields: ["createdAt"] },
      { fields: ["modulo", "publicacionId"] },
      { fields: ["userId", "modulo"] },
    ],
  },
);

module.exports = ClickTracking;

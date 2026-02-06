const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

/**
 * Modelo para tracking de movimientos y actividad
 * Registra todas las acciones de creación, edición y eliminación
 */
const ActivityLog = sequelize.define(
  "ActivityLog",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "ID del usuario que realizó la acción",
    },
    userName: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "Nombre del usuario para referencia",
    },
    empresaId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "ID de la empresa del usuario",
    },
    empresaNombre: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "Nombre de la empresa para referencia",
    },
    modulo: {
      type: DataTypes.STRING,
      allowNull: false,
      comment:
        "Módulo afectado: paquetes, alojamientos, usuarios, clientes, etc.",
    },
    accion: {
      type: DataTypes.ENUM("create", "update", "delete", "login", "logout"),
      allowNull: false,
      comment: "Tipo de acción realizada",
    },
    entidadId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment:
        "ID de la entidad afectada (publicación, usuario, cliente, etc.)",
    },
    entidadTitulo: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "Título o nombre de la entidad para referencia",
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "Descripción detallada de la acción",
    },
    cambios: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: "Objeto JSON con los cambios realizados (before/after)",
    },
    ipAddress: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "IP desde donde se realizó la acción",
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
    tableName: "activity_log",
    timestamps: true,
    updatedAt: false, // Los logs no se actualizan, solo se crean
    indexes: [
      { fields: ["userId"] },
      { fields: ["empresaId"] },
      { fields: ["modulo"] },
      { fields: ["accion"] },
      { fields: ["entidadId"] },
      { fields: ["createdAt"] },
      { fields: ["userId", "modulo"] },
      { fields: ["modulo", "accion"] },
    ],
  },
);

module.exports = ActivityLog;

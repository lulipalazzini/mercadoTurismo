import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

const CupoMercado = sequelize.define(
  "CupoMercado",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    tipoProducto: {
      type: DataTypes.ENUM("aereo"),
      allowNull: false,
      defaultValue: "aereo",
      comment: "Tipo de producto - Solo cupos aéreos",
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: false,
      comment: "Descripción del cupo",
    },
    cantidad: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 0,
      },
      comment: "Cantidad de cupos disponibles",
    },
    precioMayorista: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0,
      },
      comment: "Precio para mayoristas (mercado de cupos)",
    },
    precioMinorista: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0,
      },
      comment: "Precio para minoristas (venta al público)",
    },
    fechaVencimiento: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      comment: "Fecha de vencimiento del cupo",
    },
    observaciones: {
      type: DataTypes.TEXT,
      comment: "Observaciones adicionales",
    },
    estado: {
      type: DataTypes.ENUM("disponible", "vendido", "vencido"),
      defaultValue: "disponible",
      comment: "Estado del cupo en el mercado",
    },
    usuarioVendedorId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "ID del usuario que publicó/vendió el cupo",
    },
    usuarioCompradorId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "ID del usuario que compró el cupo",
    },
  },
  {
    tableName: "cupos_mercado",
    timestamps: true,
  },
);

export default CupoMercado;

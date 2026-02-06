const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Transfer = sequelize.define(
  "Transfer",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    tipo: {
      type: DataTypes.ENUM(
        "aeropuerto-hotel",
        "hotel-aeropuerto",
        "interhotel",
        "punto-a-punto",
      ),
      allowNull: false,
      defaultValue: "aeropuerto-hotel",
    },
    origen: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    destino: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    vehiculo: {
      type: DataTypes.ENUM("sedan", "van", "minibus", "bus"),
      allowNull: false,
      defaultValue: "sedan",
    },
    capacidadPasajeros: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 50,
      },
    },
    precio: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    duracionEstimada: {
      type: DataTypes.INTEGER,
      comment: "Duración en minutos",
    },
    tipoServicio: {
      type: DataTypes.ENUM("privado", "compartido"),
      allowNull: false,
      defaultValue: "privado",
      comment: "Tipo de servicio: privado o compartido",
    },
    servicioCompartido: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      comment: "[OBSOLETO] Usar tipoServicio en su lugar",
    },
    tipoDestino: {
      type: DataTypes.ENUM("ciudad", "hotel", "direccion"),
      allowNull: false,
      defaultValue: "ciudad",
      comment: "Tipo de destino para filtrado",
    },
    descripcion: {
      type: DataTypes.TEXT,
    },
    incluye: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
    imagenes: {
      type: DataTypes.JSON,
      defaultValue: [],
      comment: "Array de URLs de imágenes del transfer",
    },
    vendedorId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "Users",
        key: "id",
      },
      comment: "ID del vendedor que publicó este transfer",
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
    disponible: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    tableName: "transfers",
    timestamps: true,
  },
);

const User = require("./User.model");
Transfer.belongsTo(User, {
  foreignKey: "vendedorId",
  as: "vendedor",
});

module.exports = Transfer;

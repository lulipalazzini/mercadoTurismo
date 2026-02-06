const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Paquete = sequelize.define(
  "Paquete",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    destino: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    duracion: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
      },
      comment: "Duración en días",
    },
    noches: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 0,
      },
      comment: "Cantidad de noches del paquete",
    },
    precio: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    cupoMaximo: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 1,
      },
      comment: "[OBSOLETO] Campo legacy, no usar en nuevos paquetes",
    },
    cupoDisponible: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 0,
      },
      comment: "[OBSOLETO] Campo legacy, no usar en nuevos paquetes",
    },
    fechaInicio: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    fechaFin: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    incluye: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
    imagenes: {
      type: DataTypes.JSON,
      defaultValue: [],
      comment: "Array de URLs de imágenes del paquete",
    },
    vendedorId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "Users",
        key: "id",
      },
      comment: "ID del vendedor que publicó este paquete",
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "Users",
        key: "id",
      },
      comment: "ID del usuario propietario (owner) - usado para filtrado de ownership B2B",
    },
    activo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    createdBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "Users",
        key: "id",
      },
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    timestamps: true,
    paranoid: true, // Habilita soft delete automático
  },
);

// Definir asociaciones después de crear el modelo
Paquete.associate = (models) => {
  Paquete.belongsTo(models.User, {
    foreignKey: "createdBy",
    as: "creator",
  });
};

const User = require("./User.model");
Paquete.belongsTo(User, {
  foreignKey: "vendedorId",
  as: "vendedor",
});

module.exports = Paquete;

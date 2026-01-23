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
      allowNull: false,
      validate: {
        min: 1,
      },
    },
    cupoDisponible: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 0,
      },
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
    imagen: {
      type: DataTypes.STRING,
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

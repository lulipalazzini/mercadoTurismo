const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Circuito = sequelize.define(
  "Circuito",
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
    destinos: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [],
      comment: "Array de ciudades/países del circuito",
    },
    duracion: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
      },
      comment: "Duración en días",
    },
    precio: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    incluye: {
      type: DataTypes.JSON,
      defaultValue: [],
      comment: "Lista de servicios incluidos",
    },
    noIncluye: {
      type: DataTypes.JSON,
      defaultValue: [],
      comment: "Lista de servicios no incluidos",
    },
    itinerario: {
      type: DataTypes.JSON,
      defaultValue: [],
      comment: "Detalle día a día del circuito",
    },
    fechaInicio: {
      type: DataTypes.DATE,
    },
    fechaFin: {
      type: DataTypes.DATE,
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
    nivelDificultad: {
      type: DataTypes.ENUM("facil", "moderado", "dificil"),
      defaultValue: "moderado",
    },
    imagenes: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
    vendedorId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "Users",
        key: "id",
      },
      comment: "ID del vendedor que publicó este circuito",
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
    published_by_user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Users",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "RESTRICT",
      comment: "ID del publicador - CONTROL ESTRICTO DE SEGURIDAD",
    },
    activo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    destacado: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      comment: "Indica si la publicación está destacada en el Hero",
    },
  },
  {
    tableName: "circuitos",
    timestamps: true,
  },
);

const User = require("./User.model");
Circuito.belongsTo(User, {
  foreignKey: "vendedorId",
  as: "vendedor",
});

module.exports = Circuito;

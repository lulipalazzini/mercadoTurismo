const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Tren = sequelize.define(
  "Tren",
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
      comment: "Nombre del servicio de tren",
    },
    empresa: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: "Empresa operadora del tren",
    },
    tipo: {
      type: DataTypes.ENUM(
        "alta-velocidad",
        "regional",
        "turistico",
        "nocturno",
        "suburbano",
      ),
      allowNull: false,
      defaultValue: "regional",
      comment: "Tipo de servicio ferroviario",
    },
    clase: {
      type: DataTypes.ENUM(
        "economica",
        "primera",
        "ejecutiva",
        "premium",
        "suite",
      ),
      allowNull: false,
      defaultValue: "economica",
      comment: "Clase de servicio disponible",
    },
    origen: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: "Estación de origen",
    },
    destino: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: "Estación de destino",
    },
    duracionHoras: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      validate: {
        min: 0.1,
      },
      comment: "Duración del viaje en horas",
    },
    distanciaKm: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 1,
      },
      comment: "Distancia del recorrido en kilómetros",
    },
    frecuenciaSemanal: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 1,
        max: 50,
      },
      comment: "Cantidad de servicios por semana",
    },
    horarioSalida: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "Horario de salida (formato HH:MM)",
    },
    horarioLlegada: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "Horario de llegada (formato HH:MM)",
    },
    precio: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0,
      },
      comment: "Precio del boleto",
    },
    moneda: {
      type: DataTypes.ENUM("USD", "EUR", "ARS", "BRL", "CLP"),
      defaultValue: "USD",
      allowNull: false,
      comment: "Moneda del precio",
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "Descripción del servicio",
    },
    paradas: {
      type: DataTypes.JSON,
      defaultValue: [],
      comment: "Array de estaciones intermedias",
    },
    servicios: {
      type: DataTypes.JSON,
      defaultValue: [],
      comment: "Servicios incluidos (wifi, comida, etc)",
    },
    imagenes: {
      type: DataTypes.JSON,
      defaultValue: [],
      comment: "Array de URLs de imágenes del tren",
    },
    politicaCancelacion: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "Política de cancelación y reembolso",
    },
    requisitos: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "Requisitos para abordar (documentos, restricciones)",
    },
    vendedorId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "Users",
        key: "id",
      },
      comment: "ID del vendedor que publicó este tren",
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "Users",
        key: "id",
      },
      comment: "ID del usuario propietario - usado para filtrado B2B",
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
    isPublic: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      comment: "Si true, visible para usuarios B2C no autenticados",
    },
    activo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      comment: "Si false, el tren no aparece en búsquedas",
    },
  },
  {
    tableName: "trenes",
    timestamps: true,
  },
);

const User = require("./User.model");
Tren.belongsTo(User, {
  foreignKey: "vendedorId",
  as: "vendedor",
});

module.exports = Tren;

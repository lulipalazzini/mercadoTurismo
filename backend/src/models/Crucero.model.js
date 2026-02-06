const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Crucero = sequelize.define(
  "Crucero",
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
    naviera: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: "Nombre de la compañía naviera",
    },
    barco: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: "Nombre del barco",
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    itinerario: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [],
      comment: "Puertos y destinos del crucero",
    },
    duracion: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "Duración en noches",
      validate: {
        min: 1,
      },
    },
    fechaSalida: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    fechaRegreso: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    puertoSalida: {
      type: DataTypes.STRING,
      allowNull: false,
      comment:
        "Puerto de salida explícito (DIFERENTE de puertos en itinerario)",
    },
    puertosDestino: {
      type: DataTypes.JSON,
      defaultValue: [],
      comment: "Lista de puertos destino principales del crucero",
    },
    puertoLlegada: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    mesSalida: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 12,
      },
      comment: "Mes de salida (1-12) para filtros",
    },
    duracionDias: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "Duración en DÍAS (no noches)",
      validate: {
        min: 1,
      },
    },
    moneda: {
      type: DataTypes.ENUM("USD", "ARS", "EUR"),
      allowNull: false,
      defaultValue: "USD",
      comment: "Moneda de los importes",
    },
    importeAdulto: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0,
      },
      comment: "Importe por pasajero adulto (+18 años)",
    },
    importeMenor: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0,
      },
      comment: "Importe por pasajero menor (0-17 años)",
    },
    precioDesde: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      validate: {
        min: 0,
      },
      comment: "[OBSOLETO] Usar importeAdulto e importeMenor",
    },
    tiposCabina: {
      type: DataTypes.JSON,
      defaultValue: [],
      comment: "Array con tipos y precios de cabinas",
    },
    incluye: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
    noIncluye: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
    serviciosABordo: {
      type: DataTypes.JSON,
      defaultValue: [],
      comment: "Restaurantes, piscinas, gimnasio, etc.",
    },
    capacidadTotal: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    cabinasDisponibles: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 0,
      },
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
      comment: "ID del vendedor que publicó este crucero",
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
  },
  {
    tableName: "cruceros",
    timestamps: true,
  },
);

const User = require("./User.model");
Crucero.belongsTo(User, {
  foreignKey: "vendedorId",
  as: "vendedor",
});

module.exports = Crucero;

import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

const Cupo = sequelize.define(
  "Cupo",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    tipoServicio: {
      type: DataTypes.ENUM(
        "paquete",
        "alojamiento",
        "excursion",
        "circuito",
        "salida_grupal",
        "crucero",
        "pasaje",
        "otro"
      ),
      allowNull: false,
      comment: "Tipo de servicio al que pertenece el cupo",
    },
    servicioId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "ID del servicio relacionado",
    },
    fecha: {
      type: DataTypes.DATE,
      allowNull: false,
      comment: "Fecha específica del cupo",
    },
    cupoTotal: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 0,
      },
      comment: "Cupo total disponible",
    },
    cupoReservado: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0,
      },
      comment: "Cupo ya reservado",
    },
    cupoDisponible: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 0,
      },
      comment: "Cupo disponible (total - reservado)",
    },
    precioAjustado: {
      type: DataTypes.DECIMAL(10, 2),
      comment: "Precio específico para esta fecha (opcional)",
    },
    estado: {
      type: DataTypes.ENUM("disponible", "limitado", "agotado", "bloqueado"),
      defaultValue: "disponible",
    },
    notas: {
      type: DataTypes.TEXT,
      comment: "Observaciones o notas adicionales",
    },
  },
  {
    tableName: "cupos",
    timestamps: true,
    indexes: [
      {
        fields: ["tipoServicio", "servicioId", "fecha"],
        unique: true,
      },
    ],
  }
);

// Hook para calcular cupo disponible automáticamente
Cupo.beforeSave((cupo) => {
  cupo.cupoDisponible = cupo.cupoTotal - cupo.cupoReservado;

  // Actualizar estado según disponibilidad
  if (cupo.cupoDisponible === 0) {
    cupo.estado = "agotado";
  } else if (cupo.cupoDisponible <= cupo.cupoTotal * 0.2) {
    cupo.estado = "limitado";
  } else if (cupo.estado !== "bloqueado") {
    cupo.estado = "disponible";
  }
});

export default Cupo;

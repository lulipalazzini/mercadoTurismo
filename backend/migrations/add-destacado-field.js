/**
 * Migración: Agregar campo "destacado" a todas las tablas de publicaciones
 * Fecha: 2026-02-07
 * Descripción: Agrega columna BOOLEAN destacado con default FALSE a todas las tablas
 */

const { DataTypes } = require("sequelize");

module.exports = {
  async up(queryInterface) {
    console.log("\n🔄 Iniciando migración: Agregar campo destacado...");

    const tablas = [
      "Paquetes",
      "alojamientos",
      "autos",
      "transfers",
      "cruceros",
      "excursiones",
      "salidas_grupales",
      "circuitos",
      "trenes",
      "seguros",
    ];

    for (const tabla of tablas) {
      try {
        // Verificar si la columna ya existe
        const tableDescription = await queryInterface.describeTable(tabla);

        if (!tableDescription.destacado) {
          await queryInterface.addColumn(tabla, "destacado", {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false,
            comment: "Indica si la publicación está destacada en el Hero",
          });
          console.log(`✅ Campo "destacado" agregado a tabla: ${tabla}`);
        } else {
          console.log(`⏭️  Campo "destacado" ya existe en tabla: ${tabla}`);
        }
      } catch (error) {
        console.error(`❌ Error al agregar campo a ${tabla}:`, error.message);
        // Continuar con las demás tablas
      }
    }

    console.log("✅ Migración completada exitosamente\n");
  },

  async down(queryInterface) {
    console.log("\n🔄 Revertiendo migración: Eliminar campo destacado...");

    const tablas = [
      "Paquetes",
      "alojamientos",
      "autos",
      "transfers",
      "cruceros",
      "excursiones",
      "salidas_grupales",
      "circuitos",
      "trenes",
      "seguros",
    ];

    for (const tabla of tablas) {
      try {
        await queryInterface.removeColumn(tabla, "destacado");
        console.log(`✅ Campo "destacado" eliminado de tabla: ${tabla}`);
      } catch (error) {
        console.error(`❌ Error al eliminar campo de ${tabla}:`, error.message);
      }
    }

    console.log("✅ Reversión completada\n");
  },
};

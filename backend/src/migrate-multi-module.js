/**
 * Script de migración para actualización multi-módulo
 * Agrega nuevos campos a: Cruceros, Paquetes, Transfers
 * 
 * CAMPOS NUEVOS:
 * 
 * CRUCEROS:
 * - mesSalida (INTEGER 1-12) - Mes de salida para filtros
 * - duracionDias (INTEGER) - Duración en DÍAS (reemplaza duracion que era noches)
 * - puertosDestino (TEXT JSON) - Puertos destino principales
 * - moneda (VARCHAR) - Moneda del precio (USD/ARS/EUR)
 * - importeAdulto (DECIMAL) - Precio para adultos (+18)
 * - importeMenor (DECIMAL) - Precio para menores (0-17)
 * 
 * PAQUETES:
 * - noches (INTEGER) - Cantidad de noches
 * 
 * TRANSFERS:
 * - tipoServicio (VARCHAR) - Tipo de servicio (privado/compartido)
 * - tipoDestino (VARCHAR) - Tipo de destino (ciudad/hotel/direccion)
 * 
 * NOTA: Campos marcados como OBSOLETO en models se mantienen pero pueden ser NULL
 */

const sequelize = require("./config/database");
const { QueryInterface } = require("sequelize");

async function runMigration() {
  const queryInterface = sequelize.getQueryInterface();

  try {
    console.log("🚀 Iniciando migración multi-módulo...\n");

    // ========================================
    // CRUCEROS
    // ========================================
    console.log("🚢 Actualizando tabla Cruceros...");

    // Verificar si las columnas ya existen antes de agregarlas
    const crucerosTable = await queryInterface.describeTable("Cruceros");

    if (!crucerosTable.mesSalida) {
      await queryInterface.addColumn("Cruceros", "mesSalida", {
        type: sequelize.Sequelize.INTEGER,
        allowNull: true,
        comment: "Mes de salida (1-12) para filtros",
      });
      console.log("  ✅ Agregada columna: mesSalida");
    }

    if (!crucerosTable.duracionDias) {
      await queryInterface.addColumn("Cruceros", "duracionDias", {
        type: sequelize.Sequelize.INTEGER,
        allowNull: true,
        comment: "Duración en DÍAS (no noches)",
      });
      console.log("  ✅ Agregada columna: duracionDias");
    }

    if (!crucerosTable.puertosDestino) {
      await queryInterface.addColumn("Cruceros", "puertosDestino", {
        type: sequelize.Sequelize.TEXT,
        allowNull: true,
        comment: "JSON: Puertos destino principales",
      });
      console.log("  ✅ Agregada columna: puertosDestino");
    }

    if (!crucerosTable.moneda) {
      await queryInterface.addColumn("Cruceros", "moneda", {
        type: sequelize.Sequelize.STRING(3),
        allowNull: true,
        defaultValue: "USD",
        comment: "Moneda: USD, ARS, EUR",
      });
      console.log("  ✅ Agregada columna: moneda");
    }

    if (!crucerosTable.importeAdulto) {
      await queryInterface.addColumn("Cruceros", "importeAdulto", {
        type: sequelize.Sequelize.DECIMAL(10, 2),
        allowNull: true,
        comment: "Precio para adultos (+18 años)",
      });
      console.log("  ✅ Agregada columna: importeAdulto");
    }

    if (!crucerosTable.importeMenor) {
      await queryInterface.addColumn("Cruceros", "importeMenor", {
        type: sequelize.Sequelize.DECIMAL(10, 2),
        allowNull: true,
        comment: "Precio para menores (0-17 años)",
      });
      console.log("  ✅ Agregada columna: importeMenor");
    }

    // Marcar precioDesde como nullable (OBSOLETO)
    if (crucerosTable.precioDesde && crucerosTable.precioDesde.allowNull === false) {
      await queryInterface.changeColumn("Cruceros", "precioDesde", {
        type: sequelize.Sequelize.DECIMAL(10, 2),
        allowNull: true,
        comment: "OBSOLETO - Usar importeAdulto/importeMenor",
      });
      console.log("  ✅ Actualizada columna: precioDesde (ahora nullable - OBSOLETO)");
    }

    console.log("✅ Cruceros actualizado\n");

    // ========================================
    // PAQUETES
    // ========================================
    console.log("📦 Actualizando tabla Paquetes...");

    const paquetesTable = await queryInterface.describeTable("Paquetes");

    if (!paquetesTable.noches) {
      await queryInterface.addColumn("Paquetes", "noches", {
        type: sequelize.Sequelize.INTEGER,
        allowNull: true,
        comment: "Cantidad de noches del paquete",
      });
      console.log("  ✅ Agregada columna: noches");
    }

    // Marcar cupoMaximo y cupoDisponible como nullable (OBSOLETO)
    if (paquetesTable.cupoMaximo && paquetesTable.cupoMaximo.allowNull === false) {
      await queryInterface.changeColumn("Paquetes", "cupoMaximo", {
        type: sequelize.Sequelize.INTEGER,
        allowNull: true,
        comment: "OBSOLETO - Ya no se usa sistema de cupos",
      });
      console.log("  ✅ Actualizada columna: cupoMaximo (ahora nullable - OBSOLETO)");
    }

    if (paquetesTable.cupoDisponible && paquetesTable.cupoDisponible.allowNull === false) {
      await queryInterface.changeColumn("Paquetes", "cupoDisponible", {
        type: sequelize.Sequelize.INTEGER,
        allowNull: true,
        comment: "OBSOLETO - Ya no se usa sistema de cupos",
      });
      console.log("  ✅ Actualizada columna: cupoDisponible (ahora nullable - OBSOLETO)");
    }

    console.log("✅ Paquetes actualizado\n");

    // ========================================
    // TRANSFERS
    // ========================================
    console.log("🚗 Actualizando tabla Transfers...");

    const transfersTable = await queryInterface.describeTable("Transfers");

    if (!transfersTable.tipoServicio) {
      await queryInterface.addColumn("Transfers", "tipoServicio", {
        type: sequelize.Sequelize.STRING(20),
        allowNull: true,
        defaultValue: "privado",
        comment: "Tipo de servicio: privado, compartido",
      });
      console.log("  ✅ Agregada columna: tipoServicio");
    }

    if (!transfersTable.tipoDestino) {
      await queryInterface.addColumn("Transfers", "tipoDestino", {
        type: sequelize.Sequelize.STRING(20),
        allowNull: true,
        defaultValue: "ciudad",
        comment: "Tipo de destino: ciudad, hotel, direccion",
      });
      console.log("  ✅ Agregada columna: tipoDestino");
    }

    // Marcar servicioCompartido como nullable (OBSOLETO)
    if (transfersTable.servicioCompartido && transfersTable.servicioCompartido.allowNull === false) {
      await queryInterface.changeColumn("Transfers", "servicioCompartido", {
        type: sequelize.Sequelize.BOOLEAN,
        allowNull: true,
        comment: "OBSOLETO - Usar tipoServicio",
      });
      console.log("  ✅ Actualizada columna: servicioCompartido (ahora nullable - OBSOLETO)");
    }

    console.log("✅ Transfers actualizado\n");

    // ========================================
    // RESUMEN
    // ========================================
    console.log("✨ Migración completada exitosamente!\n");
    console.log("📊 RESUMEN DE CAMBIOS:");
    console.log("  🚢 Cruceros: 6 campos nuevos (mesSalida, duracionDias, puertosDestino, moneda, importeAdulto, importeMenor)");
    console.log("  📦 Paquetes: 1 campo nuevo (noches), 2 campos OBSOLETOS (cupoMaximo, cupoDisponible)");
    console.log("  🚗 Transfers: 2 campos nuevos (tipoServicio, tipoDestino), 1 campo OBSOLETO (servicioCompartido)");
    console.log("\n⚠️  IMPORTANTE:");
    console.log("  - Los campos marcados como OBSOLETO se mantienen por compatibilidad");
    console.log("  - Actualizar registros existentes según sea necesario");
    console.log("  - Verificar que los formularios del dashboard incluyan los nuevos campos");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error durante la migración:", error);
    process.exit(1);
  }
}

// Ejecutar migración
runMigration();

const { sequelize } = require("./src/config/database");

async function fullDatabaseMigration() {
  try {
    console.log("🔍 DIAGNÓSTICO Y MIGRACIÓN COMPLETA DE BASE DE DATOS\n");
    console.log("=".repeat(60));

    // ========== TABLA USERS ==========
    console.log("\n📋 TABLA: Users");
    const userColumns = [
      {
        name: "userType",
        sql: `ALTER TABLE Users ADD COLUMN userType TEXT DEFAULT 'B2C'`,
      },
      {
        name: "countryCode",
        sql: `ALTER TABLE Users ADD COLUMN countryCode TEXT`,
      },
      {
        name: "entityType",
        sql: `ALTER TABLE Users ADD COLUMN entityType TEXT`,
      },
      {
        name: "fiscalData",
        sql: `ALTER TABLE Users ADD COLUMN fiscalData TEXT`,
      },
      {
        name: "businessData",
        sql: `ALTER TABLE Users ADD COLUMN businessData TEXT`,
      },
      {
        name: "validationStatus",
        sql: `ALTER TABLE Users ADD COLUMN validationStatus TEXT DEFAULT 'pending'`,
      },
      {
        name: "validationNotes",
        sql: `ALTER TABLE Users ADD COLUMN validationNotes TEXT`,
      },
      {
        name: "validatedAt",
        sql: `ALTER TABLE Users ADD COLUMN validatedAt DATETIME`,
      },
      {
        name: "businessModel",
        sql: `ALTER TABLE Users ADD COLUMN businessModel TEXT`,
      },
      {
        name: "serviceType",
        sql: `ALTER TABLE Users ADD COLUMN serviceType TEXT`,
      },
      {
        name: "isVisibleToPassengers",
        sql: `ALTER TABLE Users ADD COLUMN isVisibleToPassengers BOOLEAN DEFAULT 0`,
      },
      {
        name: "calculatedRole",
        sql: `ALTER TABLE Users ADD COLUMN calculatedRole TEXT`,
      },
    ];

    for (const col of userColumns) {
      try {
        await sequelize.query(col.sql);
        console.log(`   ✅ ${col.name} agregada`);
      } catch (err) {
        if (err.message.includes("duplicate column name")) {
          console.log(`   ℹ️  ${col.name} ya existe`);
        } else {
          console.log(`   ⚠️  ${col.name}: ${err.message}`);
        }
      }
    }

    // ========== TABLAS DE PRODUCTOS ==========
    const productTables = [
      "Paquetes",
      "Cruceros",
      "Transfers",
      "Autos",
      "Alojamientos",
      "Excursiones",
      "Seguros",
      "Circuitos",
    ];

    for (const table of productTables) {
      console.log(`\n📋 TABLA: ${table}`);

      const columns = [
        {
          name: "userId",
          sql: `ALTER TABLE ${table} ADD COLUMN userId INTEGER`,
        },
        {
          name: "isPublic",
          sql: `ALTER TABLE ${table} ADD COLUMN isPublic BOOLEAN DEFAULT 0`,
        },
        {
          name: "activo",
          sql: `ALTER TABLE ${table} ADD COLUMN activo BOOLEAN DEFAULT 1`,
        },
      ];

      // Columnas específicas por tabla
      if (table === "Paquetes") {
        columns.push({
          name: "noches",
          sql: `ALTER TABLE ${table} ADD COLUMN noches INTEGER`,
        });
      }

      if (table === "Cruceros") {
        columns.push(
          {
            name: "mesSalida",
            sql: `ALTER TABLE ${table} ADD COLUMN mesSalida INTEGER`,
          },
          {
            name: "duracionDias",
            sql: `ALTER TABLE ${table} ADD COLUMN duracionDias INTEGER`,
          },
          {
            name: "puertosDestino",
            sql: `ALTER TABLE ${table} ADD COLUMN puertosDestino TEXT`,
          },
          {
            name: "moneda",
            sql: `ALTER TABLE ${table} ADD COLUMN moneda TEXT DEFAULT 'USD'`,
          },
          {
            name: "importeAdulto",
            sql: `ALTER TABLE ${table} ADD COLUMN importeAdulto REAL`,
          },
          {
            name: "importeMenor",
            sql: `ALTER TABLE ${table} ADD COLUMN importeMenor REAL`,
          },
        );
      }

      if (table === "Transfers") {
        columns.push(
          {
            name: "tipoServicio",
            sql: `ALTER TABLE ${table} ADD COLUMN tipoServicio TEXT DEFAULT 'privado'`,
          },
          {
            name: "tipoDestino",
            sql: `ALTER TABLE ${table} ADD COLUMN tipoDestino TEXT DEFAULT 'ciudad'`,
          },
        );
      }

      for (const col of columns) {
        try {
          await sequelize.query(col.sql);
          console.log(`   ✅ ${col.name} agregada`);
        } catch (err) {
          if (err.message.includes("duplicate column name")) {
            console.log(`   ℹ️  ${col.name} ya existe`);
          } else if (err.message.includes("no such table")) {
            console.log(`   ⚠️  Tabla ${table} no existe en la base de datos`);
            break;
          } else {
            console.log(`   ⚠️  ${col.name}: ${err.message}`);
          }
        }
      }
    }

    // ========== VERIFICAR ESTRUCTURA FINAL ==========
    console.log("\n" + "=".repeat(60));
    console.log("📊 VERIFICACIÓN FINAL");
    console.log("=".repeat(60));

    try {
      const [usersInfo] = await sequelize.query(`PRAGMA table_info(Users)`);
      console.log(`\n✅ Users tiene ${usersInfo.length} columnas`);

      for (const table of productTables) {
        try {
          const [tableInfo] = await sequelize.query(
            `PRAGMA table_info(${table})`,
          );
          console.log(`✅ ${table} tiene ${tableInfo.length} columnas`);
        } catch (err) {
          console.log(`⚠️  ${table} no existe`);
        }
      }
    } catch (err) {
      console.error("Error en verificación:", err.message);
    }

    console.log("\n" + "=".repeat(60));
    console.log("✅ MIGRACIÓN COMPLETA FINALIZADA");
    console.log("=".repeat(60));
    process.exit(0);
  } catch (error) {
    console.error("❌ ERROR CRÍTICO:", error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

fullDatabaseMigration();

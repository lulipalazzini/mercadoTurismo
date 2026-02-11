const { sequelize } = require("../src/config/database");
const { QueryTypes } = require("sequelize");
const Tren = require("../src/models/Tren.model");

const resolveTableName = async (logicalName) => {
  const rows = await sequelize.query(
    "SELECT name FROM sqlite_master WHERE type='table' AND lower(name) = lower(?)",
    {
      type: QueryTypes.SELECT,
      replacements: [logicalName],
    },
  );
  return rows.length > 0 ? rows[0].name : null;
};

const ensureColumn = async (logicalTable, column, sqlType, defaultSql) => {
  const table = await resolveTableName(logicalTable);
  if (!table) {
    console.log(
      `⚠️  Tabla '${logicalTable}' no existe. Se omitió columna '${column}'.`,
    );
    return;
  }

  const rows = await sequelize.query(`PRAGMA table_info(${table})`, {
    type: QueryTypes.SELECT,
  });

  const exists = rows.some((row) => row.name === column);
  if (exists) {
    console.log(`✅ ${table}.${column} ya existe`);
    return;
  }

  const defaultClause = defaultSql ? ` DEFAULT ${defaultSql}` : "";
  await sequelize.query(
    `ALTER TABLE ${table} ADD COLUMN ${column} ${sqlType}${defaultClause}`,
  );
  console.log(`✅ Columna agregada: ${table}.${column}`);
};

const ensureTrenesTable = async () => {
  const existing = await resolveTableName("trenes");
  if (existing) {
    console.log("✅ Tabla 'trenes' ya existe");
    return;
  }

  console.log("🛤️  Creando tabla 'trenes'...");
  await Tren.sync();
  console.log("✅ Tabla 'trenes' creada");
};

const run = async () => {
  try {
    console.log("🔧 Migración: agregar columnas imagenes + tabla trenes\n");

    await ensureColumn("seguros", "imagenes", "TEXT", "'[]'");
    await ensureColumn("transfers", "imagenes", "TEXT", "'[]'");
    await ensureColumn("paquetes", "imagenes", "TEXT", "'[]'");

    await ensureTrenesTable();

    console.log("\n✅ Migración completada");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error en migración:", error.message);
    process.exit(1);
  }
};

run();

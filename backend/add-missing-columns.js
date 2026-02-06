const { sequelize } = require('./src/config/database');

async function addMissingColumns() {
  try {
    console.log('🔧 Agregando columnas faltantes...\n');
    
    const tables = [
      'Paquetes',
      'Cruceros', 
      'Transfers',
      'Autos',
      'Alojamientos',
      'Excursiones',
      'Seguros',
      'SalidasGrupales',
      'Circuitos'
    ];
    
    for (const table of tables) {
      console.log(`📋 Tabla: ${table}`);
      
      // Agregar userId
      try {
        await sequelize.query(`ALTER TABLE ${table} ADD COLUMN userId INTEGER`);
        console.log(`   ✅ userId agregada`);
      } catch (err) {
        if (err.message.includes('duplicate column name')) {
          console.log(`   ℹ️  userId ya existe`);
        } else {
          console.log(`   ⚠️  Error userId: ${err.message}`);
        }
      }
      
      // Agregar isPublic
      try {
        await sequelize.query(`ALTER TABLE ${table} ADD COLUMN isPublic BOOLEAN DEFAULT 0`);
        console.log(`   ✅ isPublic agregada`);
      } catch (err) {
        if (err.message.includes('duplicate column name')) {
          console.log(`   ℹ️  isPublic ya existe`);
        } else {
          console.log(`   ⚠️  Error isPublic: ${err.message}`);
        }
      }
      
      console.log('');
    }
    
    console.log('✅ Proceso completado');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error general:', error.message);
    process.exit(1);
  }
}

addMissingColumns();

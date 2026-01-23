#!/usr/bin/env node

/**
 * Script de verificación pre-deploy
 * Verifica que todos los archivos estén correctamente convertidos a CommonJS
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 VERIFICACIÓN PRE-DEPLOY\n');
console.log('Verificando que todo esté listo para deploy en WNPower...\n');

let errores = 0;
let advertencias = 0;

// 1. Verificar package.json
console.log('1️⃣  Verificando package.json...');
try {
  const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  
  if (pkg.type === 'module') {
    console.log('   ❌ ERROR: package.json tiene "type": "module"');
    console.log('      Debe eliminarse para compatibilidad con Passenger');
    errores++;
  } else {
    console.log('   ✅ package.json correcto (sin "type": "module")');
  }
  
  if (pkg.main !== 'app.js') {
    console.log('   ⚠️  ADVERTENCIA: "main" no es "app.js"');
    console.log(`      Valor actual: "${pkg.main}"`);
    advertencias++;
  } else {
    console.log('   ✅ Entry point correcto (app.js)');
  }
} catch (err) {
  console.log('   ❌ ERROR: No se puede leer package.json');
  errores++;
}

// 2. Verificar app.js
console.log('\n2️⃣  Verificando app.js...');
try {
  const appContent = fs.readFileSync('app.js', 'utf8');
  
  if (appContent.includes('import(') || appContent.includes('await import')) {
    console.log('   ❌ ERROR: app.js usa import() dinámico');
    console.log('      Debe usar require() para Passenger');
    errores++;
  } else if (appContent.includes('require(')) {
    console.log('   ✅ app.js usa require() correctamente');
  } else {
    console.log('   ⚠️  ADVERTENCIA: No se encontró require() en app.js');
    advertencias++;
  }
  
  if (appContent.includes('import ') && appContent.includes(' from ')) {
    console.log('   ❌ ERROR: app.js usa sintaxis import/from (ESM)');
    errores++;
  }
} catch (err) {
  console.log('   ❌ ERROR: No se puede leer app.js');
  errores++;
}

// 3. Verificar archivos en src/
console.log('\n3️⃣  Verificando archivos en src/...');
const directorios = ['src/models', 'src/routes', 'src/controllers', 'src/middleware', 'src/config'];
let archivosRevisados = 0;
let archivosConProblemas = 0;

directorios.forEach(dir => {
  if (!fs.existsSync(dir)) return;
  
  const archivos = fs.readdirSync(dir).filter(f => f.endsWith('.js'));
  archivos.forEach(archivo => {
    archivosRevisados++;
    const rutaCompleta = path.join(dir, archivo);
    const contenido = fs.readFileSync(rutaCompleta, 'utf8');
    
    // Verificar imports ESM
    if (contenido.match(/^import .+ from /m)) {
      console.log(`   ❌ ${rutaCompleta}: Contiene import/from (ESM)`);
      archivosConProblemas++;
      errores++;
    }
    
    // Verificar exports ESM
    if (contenido.match(/^export (default|const|{)/m)) {
      console.log(`   ❌ ${rutaCompleta}: Contiene export (ESM)`);
      archivosConProblemas++;
      errores++;
    }
    
    // Verificar extensiones .js en require
    if (contenido.match(/require\(["']\..*\.js["']\)/)) {
      console.log(`   ⚠️  ${rutaCompleta}: require() con extensión .js`);
      console.log(`      Recomendación: Eliminar .js de los paths locales`);
      archivosConProblemas++;
      advertencias++;
    }
  });
});

console.log(`   Archivos revisados: ${archivosRevisados}`);
if (archivosConProblemas === 0) {
  console.log('   ✅ Todos los archivos usan CommonJS correctamente');
} else {
  console.log(`   ❌ ${archivosConProblemas} archivo(s) con problemas`);
}

// 4. Verificar node_modules
console.log('\n4️⃣  Verificando node_modules...');
if (fs.existsSync('node_modules')) {
  console.log('   ✅ node_modules existe');
  console.log('   ℹ️  Recuerda: NO subir node_modules al servidor');
  console.log('      Ejecutar npm install en el servidor');
} else {
  console.log('   ⚠️  node_modules no existe');
  console.log('      Ejecutar: npm install');
  advertencias++;
}

// 5. Verificar .env
console.log('\n5️⃣  Verificando .env...');
if (fs.existsSync('.env')) {
  console.log('   ✅ .env existe localmente');
  console.log('   ℹ️  Recuerda: Configurar variables en WNPower Panel');
  const envContent = fs.readFileSync('.env', 'utf8');
  const requiredVars = ['JWT_SECRET', 'FRONTEND_URL'];
  requiredVars.forEach(varName => {
    if (envContent.includes(varName)) {
      console.log(`      ✓ ${varName} definido`);
    } else {
      console.log(`      ⚠️  ${varName} NO definido`);
      advertencias++;
    }
  });
} else {
  console.log('   ⚠️  .env no existe');
  console.log('      Asegúrate de configurar variables en WNPower');
  advertencias++;
}

// 6. Verificar .gitignore
console.log('\n6️⃣  Verificando .gitignore...');
if (fs.existsSync('.gitignore')) {
  const gitignoreContent = fs.readFileSync('.gitignore', 'utf8');
  const shouldIgnore = ['node_modules', '.env', 'database.sqlite'];
  shouldIgnore.forEach(item => {
    if (gitignoreContent.includes(item)) {
      console.log(`   ✓ ${item} en .gitignore`);
    } else {
      console.log(`   ⚠️  ${item} NO en .gitignore`);
      advertencias++;
    }
  });
} else {
  console.log('   ⚠️  .gitignore no existe');
  advertencias++;
}

// Resumen final
console.log('\n' + '='.repeat(60));
console.log('📊 RESUMEN DE VERIFICACIÓN');
console.log('='.repeat(60));

if (errores === 0 && advertencias === 0) {
  console.log('✅ ¡TODO PERFECTO! Listo para deploy');
  console.log('\nPróximos pasos:');
  console.log('1. git add .');
  console.log('2. git commit -m "Fix: Convertir a CommonJS para WNPower"');
  console.log('3. git push');
  console.log('4. En el servidor: git pull && npm install && touch tmp/restart.txt');
  process.exit(0);
} else {
  console.log(`❌ ${errores} error(es) encontrado(s)`);
  console.log(`⚠️  ${advertencias} advertencia(s) encontrada(s)`);
  
  if (errores > 0) {
    console.log('\n⚠️  ACCIÓN REQUERIDA: Corregir errores antes de deploy');
    process.exit(1);
  } else {
    console.log('\n⚠️  Las advertencias no impiden el deploy, pero revisa la documentación');
    process.exit(0);
  }
}

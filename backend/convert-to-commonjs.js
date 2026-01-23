const fs = require('fs');
const path = require('path');

console.log('🔄 Convirtiendo archivos de ESM a CommonJS...\n');

// Directorios a procesar
const directories = [
  'src/models',
  'src/routes',
  'src/controllers',
  'src/middleware'
];

let totalConverted = 0;

// Función para convertir un archivo
function convertFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;
    
    // 1. Convertir imports de librerías y archivos
    // import { X, Y } from "module" -> const { X, Y } = require("module")
    content = content.replace(
      /import\s+{([^}]+)}\s+from\s+["']([^"']+)["'];?/g,
      (match, imports, module) => {
        // Remover .js de las rutas locales
        const cleanModule = module.replace(/\.js$/, '');
        return `const {${imports}} = require("${cleanModule}");`;
      }
    );
    
    // import X from "module" -> const X = require("module")
    content = content.replace(
      /import\s+(\w+)\s+from\s+["']([^"']+)["'];?/g,
      (match, name, module) => {
        // Remover .js de las rutas locales
        const cleanModule = module.replace(/\.js$/, '');
        return `const ${name} = require("${cleanModule}");`;
      }
    );
    
    // import "module" -> require("module")
    content = content.replace(
      /import\s+["']([^"']+)["'];?/g,
      (match, module) => {
        const cleanModule = module.replace(/\.js$/, '');
        return `require("${cleanModule}");`;
      }
    );
    
    // 2. Convertir exports
    // export default X -> module.exports = X
    content = content.replace(
      /export\s+default\s+(\w+);?/g,
      'module.exports = $1;'
    );
    
    // export { X, Y } -> module.exports = { X, Y }
    content = content.replace(
      /export\s+{([^}]+)};?/g,
      'module.exports = {$1};'
    );
    
    // export const X = ... -> const X = ...; module.exports.X = X;
    // Este patrón es más complejo, se maneja al final del archivo
    const exportConstMatches = content.match(/export\s+const\s+(\w+)\s*=/g);
    if (exportConstMatches) {
      const exports = [];
      content = content.replace(
        /export\s+const\s+(\w+)\s*=/g,
        (match, name) => {
          exports.push(name);
          return `const ${name} =`;
        }
      );
      
      // Agregar exports al final si no existe module.exports
      if (!content.includes('module.exports =') && exports.length > 0) {
        const exportsList = exports.map(name => `  ${name}`).join(',\n');
        content += `\n\nmodule.exports = {\n${exportsList}\n};\n`;
      }
    }
    
    // Solo escribir si hubo cambios
    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ ${filePath}`);
      totalConverted++;
    }
  } catch (error) {
    console.error(`❌ Error en ${filePath}: ${error.message}`);
  }
}

// Procesar cada directorio
directories.forEach(dir => {
  const fullPath = path.join(__dirname, dir);
  
  if (!fs.existsSync(fullPath)) {
    console.log(`⚠️  Directorio no encontrado: ${dir}`);
    return;
  }
  
  console.log(`📁 Procesando: ${dir}`);
  
  const files = fs.readdirSync(fullPath);
  files.forEach(file => {
    if (file.endsWith('.js')) {
      const filePath = path.join(fullPath, file);
      convertFile(filePath);
    }
  });
  
  console.log('');
});

console.log(`\n✨ Conversión completada: ${totalConverted} archivos modificados`);
console.log('📋 Recuerda:');
console.log('   1. Revisar los archivos convertidos');
console.log('   2. Probar la aplicación localmente');
console.log('   3. Hacer commit de los cambios\n');

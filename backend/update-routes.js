const fs = require("fs");
const path = require("path");

// Lista de routes a actualizar
const routeFiles = [
  "excursiones.routes.js",
  "autos.routes.js",
  "circuitos.routes.js",
  "salidasGrupales.routes.js",
  "transfers.routes.js",
  "seguros.routes.js",
  "paquetes.routes.js",
];

const routesDir = path.join(__dirname, "../src/routes");

console.log("📝 ACTUALIZANDO ROUTES CON MULTER MIDDLEWARE\n");
console.log("=".repeat(60));

routeFiles.forEach((fileName) => {
  const filePath = path.join(routesDir, fileName);
  
  try {
    let content = fs.readFileSync(filePath, "utf8");
    
    // Verificar si ya tiene upload middleware
    if (content.includes("upload.middleware")) {
      console.log(`⏭️  ${fileName} - Ya actualizado`);
      return;
    }
    
    // Agregar imports de upload middleware después de auth.middleware
    content = content.replace(
      /const \{ verifyToken.*\} = require\("\.\.\/middleware\/auth\.middleware"\);/,
      `$&\nconst {\n  upload,\n  handleMulterError,\n} = require("../middleware/upload.middleware");`
    );
    
    // Actualizar router.post (create)
    content = content.replace(
      /router\.post\("\/", verifyToken, create\w+\);/,
      (match) => {
        const funcName = match.match(/create\w+/)[0];
        return `router.post(\n  "/",\n  verifyToken,\n  upload.array("imagenes", 6),\n  handleMulterError,\n  ${funcName},\n);`;
      }
    );
    
    // Actualizar router.put (update)
    content = content.replace(
      /router\.put\("\/:id", verifyToken, update\w+\);/,
      (match) => {
        const funcName = match.match(/update\w+/)[0];
        return `router.put(\n  "/:id",\n  verifyToken,\n  upload.array("imagenes", 6),\n  handleMulterError,\n  ${funcName},\n);`;
      }
    );
    
    // Escribir archivo actualizado
    fs.writeFileSync(filePath, content, "utf8");
    console.log(`✅ ${fileName} - Actualizado correctamente`);
    
  } catch (error) {
    console.error(`❌ ${fileName} - Error: ${error.message}`);
  }
});

console.log("\n" + "=".repeat(60));
console.log("✅ Actualización de routes completada\n");

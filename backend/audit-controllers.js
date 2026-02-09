const fs = require("fs");
const path = require("path");

const controllersPath = "./src/controllers";
const files = fs.readdirSync(controllersPath);

console.log("🔍 AUDITANDO TODOS LOS CONTROLADORES\n");
console.log("=".repeat(80));

const patterns = {
  nombre: /attributes:.*?nombre/s,
  precio: /attributes:.*?precio/s,
  destino: /attributes:.*?destino/s,
  activo: /where:.*?activo/s,
  disponible: /where:.*?disponible/s,
  vendedor: /as:\s*["']vendedor["']/,
  foreignKey: /foreignKey/,
};

files.forEach((file) => {
  if (!file.endsWith(".controller.js")) return;

  const filePath = path.join(controllersPath, file);
  const content = fs.readFileSync(filePath, "utf8");

  console.log(`\n📋 ${file}`);
  console.log("-".repeat(80));

  // Buscar problemas comunes
  const issues = [];

  // Verificar si usa include con vendedor
  if (content.includes("include") && content.includes("vendedor")) {
    console.log("✅ Usa include con vendedor");
  }

  // Buscar campos que podrían no existir
  if (content.includes("item.nombre") && file.includes("Auto")) {
    issues.push("⚠️  Auto no tiene campo 'nombre'");
  }

  if (content.includes("item.nombre") && file.includes("Transfer")) {
    issues.push("⚠️  Transfer no tiene campo 'nombre'");
  }

  if (content.includes("item.precio") && file.includes("alojamiento")) {
    issues.push("⚠️  Alojamiento usa 'precioNoche' no 'precio'");
  }

  if (content.includes("item.precio") && file.includes("auto")) {
    issues.push("⚠️  Auto usa 'precioDia' no 'precio'");
  }

  if (content.includes("item.precio") && file.includes("crucero")) {
    issues.push("⚠️  Crucero usa 'precioDesde' o 'importeAdulto' no 'precio'");
  }

  if (
    content.includes("activo: true") &&
    (file.includes("auto") || file.includes("transfer"))
  ) {
    issues.push("⚠️  Auto/Transfer usa 'disponible' no 'activo'");
  }

  if (issues.length > 0) {
    issues.forEach((issue) => console.log(issue));
  } else {
    console.log("✅ Sin problemas evidentes");
  }
});

console.log("\n" + "=".repeat(80));
console.log("✅ Auditoría completada\n");

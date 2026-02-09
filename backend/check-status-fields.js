const Paquete = require("./src/models/Paquete.model");
const Alojamiento = require("./src/models/Alojamiento.model");
const Auto = require("./src/models/Auto.model");
const Transfer = require("./src/models/Transfer.model");
const Crucero = require("./src/models/Crucero.model");
const Excursion = require("./src/models/Excursion.model");
const SalidaGrupal = require("./src/models/SalidaGrupal.model");
const Circuito = require("./src/models/Circuito.model");
const Tren = require("./src/models/Tren.model");
const Seguro = require("./src/models/Seguro.model");

console.log("🔍 VERIFICANDO CAMPOS DE ESTADO (activo/disponible)\n");
console.log("=".repeat(70));

const models = [
  { name: "Paquete", model: Paquete },
  { name: "Alojamiento", model: Alojamiento },
  { name: "Auto", model: Auto },
  { name: "Transfer", model: Transfer },
  { name: "Crucero", model: Crucero },
  { name: "Excursion", model: Excursion },
  { name: "SalidaGrupal", model: SalidaGrupal },
  { name: "Circuito", model: Circuito },
  { name: "Tren", model: Tren },
  { name: "Seguro", model: Seguro },
];

models.forEach(({ name, model }) => {
  const attributes = Object.keys(model.rawAttributes);

  const tieneActivo = attributes.includes("activo");
  const tieneDisponible = attributes.includes("disponible");
  const tieneIsPublic = attributes.includes("isPublic");

  console.log(`\n📋 ${name}:`);
  console.log(`   activo: ${tieneActivo ? "✅" : "❌"}`);
  console.log(`   disponible: ${tieneDisponible ? "✅" : "❌"}`);
  console.log(`   isPublic: ${tieneIsPublic ? "✅" : "❌"}`);

  if (!tieneActivo && !tieneDisponible) {
    console.log(`   ⚠️  Sin campo de estado!`);
  } else {
    const campoEstado = tieneActivo ? "activo" : "disponible";
    console.log(`   💡 Usar campo: ${campoEstado}`);
  }
});

console.log("\n" + "=".repeat(70));
console.log("✅ Análisis completado\n");

process.exit(0);

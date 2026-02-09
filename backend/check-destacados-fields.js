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

console.log("🔍 ANALIZANDO CAMPOS DE CADA MODELO PARA DESTACADOS\n");
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

const camposComunes = [
  "nombre",
  "descripcion",
  "precio",
  "destino",
  "imagenes",
  "destacado",
];

models.forEach(({ name, model }) => {
  console.log(`\n📋 ${name}:`);
  const attributes = Object.keys(model.rawAttributes);

  const tiene = {};
  const noTiene = [];

  camposComunes.forEach((campo) => {
    if (attributes.includes(campo)) {
      tiene[campo] = "✅";
    } else {
      noTiene.push(campo);
      tiene[campo] = "❌";
    }
  });

  console.log(`   nombre: ${tiene.nombre}`);
  console.log(`   descripcion: ${tiene.descripcion}`);
  console.log(`   precio: ${tiene.precio}`);
  console.log(`   destino: ${tiene.destino}`);
  console.log(`   imagenes: ${tiene.imagenes}`);
  console.log(`   destacado: ${tiene.destacado}`);

  if (noTiene.length > 0) {
    console.log(`   ⚠️  FALTAN: ${noTiene.join(", ")}`);

    // Buscar campos alternativos
    const altPrecio = attributes.find(
      (a) =>
        a.includes("precio") || a.includes("Precio") || a.includes("importe"),
    );
    const altDescripcion = attributes.find((a) => a.includes("descripcion"));

    if (altPrecio) console.log(`   💡 Alternativa precio: ${altPrecio}`);
    if (altDescripcion)
      console.log(`   💡 Alternativa descripcion: ${altDescripcion}`);
  }
});

console.log("\n" + "=".repeat(70));
console.log("✅ Análisis completado\n");

process.exit(0);

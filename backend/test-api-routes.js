const API_URL = "http://localhost:3001/api";

const tests = [
  { name: "Paquetes", endpoint: "/paquetes" },
  { name: "Paquetes Destacados", endpoint: "/paquetes?destacado=true" },
  { name: "Alojamientos", endpoint: "/alojamientos" },
  { name: "Alojamientos Destacados", endpoint: "/alojamientos?destacado=true" },
  { name: "Autos", endpoint: "/autos" },
  { name: "Autos Destacados", endpoint: "/autos?destacado=true" },
  { name: "Transfers", endpoint: "/transfers" },
  { name: "Transfers Destacados", endpoint: "/transfers?destacado=true" },
  { name: "Cruceros", endpoint: "/cruceros" },
  { name: "Cruceros Destacados", endpoint: "/cruceros?destacado=true" },
  { name: "Excursiones", endpoint: "/excursiones" },
  { name: "Excursiones Destacadas", endpoint: "/excursiones?destacado=true" },
  { name: "Salidas Grupales", endpoint: "/salidas-grupales" },
  { name: "Salidas Destacadas", endpoint: "/salidas-grupales?destacado=true" },
  { name: "Circuitos", endpoint: "/circuitos" },
  { name: "Circuitos Destacados", endpoint: "/circuitos?destacado=true" },
  { name: "Trenes", endpoint: "/trenes" },
  { name: "Trenes Destacados", endpoint: "/trenes?destacado=true" },
  { name: "Seguros", endpoint: "/seguros" },
  { name: "Seguros Destacados", endpoint: "/seguros?destacado=true" },
  { name: "Publicaciones Destacadas", endpoint: "/publicaciones-destacadas" },
  { name: "Tipos Servicios", endpoint: "/tipos-servicios" },
];

async function runTests() {
  console.log("🔍 TESTING TODAS LAS RUTAS API\n");
  console.log("=".repeat(80));

  let passed = 0;
  let failed = 0;
  const errors = [];

  for (const test of tests) {
    try {
      const response = await fetch(`${API_URL}${test.endpoint}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json().catch(() => null);

      if (response.status === 200) {
        const count = data?.total || data?.publicaciones?.length || 0;
        console.log(`✅ ${test.name} - OK (${count} items)`);
        passed++;
      } else {
        console.log(`❌ ${test.name} - ERROR ${response.status}`);
        console.log(`   ${data?.message || data?.error || "Sin mensaje"}`);
        errors.push({ test: test.name, status: response.status, error: data });
        failed++;
      }
    } catch (error) {
      console.log(`❌ ${test.name} - EXCEPTION`);
      console.log(`   ${error.message}`);
      errors.push({ test: test.name, error: error.message });
      failed++;
    }
  }

  console.log("\n" + "=".repeat(80));
  console.log(`📊 RESULTADOS: ${passed} ✅ | ${failed} ❌`);
  console.log("=".repeat(80));

  if (errors.length > 0) {
    console.log("\n❌ ERRORES ENCONTRADOS:\n");
    errors.forEach((err, idx) => {
      console.log(`${idx + 1}. ${err.test}`);
      console.log(
        `   Error: ${JSON.stringify(err.error || err.message, null, 2)}`,
      );
      console.log("");
    });
  } else {
    console.log("\n✨ TODAS LAS RUTAS FUNCIONAN CORRECTAMENTE\n");
  }
}

runTests().catch((err) => {
  console.error("❌ Error ejecutando tests:", err.message);
  process.exit(1);
});

/**
 * Script para probar el endpoint de tracking de clicks
 * Ejecutar con: node test-click-tracking.js
 */

const API_URL = process.env.API_URL || "http://localhost:3001/api";

async function testClickTracking() {
  console.log("\n" + "=".repeat(60));
  console.log("🧪 TESTING CLICK TRACKING");
  console.log("=".repeat(60));
  console.log(`📡 API URL: ${API_URL}`);

  try {
    // Test 1: Incrementar contador de paquete
    console.log("\n📦 Test 1: Incrementar click en paquete");
    const response1 = await fetch(`${API_URL}/stats/increment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        cardType: "paquete",
        serviceId: 123,
        serviceName: "Paquete de prueba",
      }),
    });

    console.log(`   Status: ${response1.status} ${response1.statusText}`);
    console.log(`   Headers:`, Object.fromEntries(response1.headers.entries()));
    
    const data1 = await response1.json();
    console.log(`   Response:`, JSON.stringify(data1, null, 2));

    if (response1.ok) {
      console.log("   ✅ Test 1 PASÓ");
    } else {
      console.log("   ❌ Test 1 FALLÓ");
    }

    // Test 2: Obtener todas las estadísticas
    console.log("\n📊 Test 2: Obtener todas las estadísticas");
    const response2 = await fetch(`${API_URL}/stats`);
    
    console.log(`   Status: ${response2.status} ${response2.statusText}`);
    const data2 = await response2.json();
    console.log(`   Total clicks: ${data2.totalClicks}`);
    console.log(`   Categorías: ${data2.stats?.length || 0}`);

    if (response2.ok) {
      console.log("   ✅ Test 2 PASÓ");
    } else {
      console.log("   ❌ Test 2 FALLÓ");
    }

    // Test 3: Obtener estadísticas de paquete
    console.log("\n📦 Test 3: Obtener estadísticas de paquete");
    const response3 = await fetch(`${API_URL}/stats/paquete`);
    
    console.log(`   Status: ${response3.status} ${response3.statusText}`);
    const data3 = await response3.json();
    console.log(`   Response:`, JSON.stringify(data3, null, 2));

    if (response3.ok) {
      console.log("   ✅ Test 3 PASÓ");
    } else {
      console.log("   ❌ Test 3 FALLÓ");
    }

    // Test 4: Intentar con tipo inválido (debe fallar)
    console.log("\n⚠️  Test 4: Intentar con tipo inválido (debe devolver 400)");
    const response4 = await fetch(`${API_URL}/stats/increment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        cardType: "tipo_invalido",
      }),
    });

    console.log(`   Status: ${response4.status} ${response4.statusText}`);
    const data4 = await response4.json();
    console.log(`   Response:`, JSON.stringify(data4, null, 2));

    if (response4.status === 400) {
      console.log("   ✅ Test 4 PASÓ (error esperado)");
    } else {
      console.log("   ❌ Test 4 FALLÓ");
    }

    console.log("\n" + "=".repeat(60));
    console.log("✅ TODOS LOS TESTS COMPLETADOS");
    console.log("=".repeat(60) + "\n");

  } catch (error) {
    console.error("\n❌ ERROR EN LOS TESTS:");
    console.error("   Mensaje:", error.message);
    console.error("   Stack:", error.stack);
    console.log("=".repeat(60) + "\n");
    process.exit(1);
  }
}

// Ejecutar tests
testClickTracking().catch(console.error);

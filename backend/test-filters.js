/**
 * Script de prueba para verificar los nuevos filtros del backend
 * Prueba los endpoints de Cruceros, Paquetes, Transfers y Autos
 */

const API_BASE_URL = "http://localhost:3003/api";

async function testEndpoint(moduleName, endpoint, filters = {}) {
  console.log(`\n🧪 Probando ${moduleName}...`);
  console.log(`📍 Endpoint: ${endpoint}`);
  
  const params = new URLSearchParams(filters);
  const url = `${API_BASE_URL}${endpoint}${params.toString() ? '?' + params.toString() : ''}`;
  
  console.log(`🔗 URL: ${url}`);
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    
    if (response.ok) {
      console.log(`✅ ${moduleName}: ${data.length} resultados`);
      return { success: true, count: data.length, data };
    } else {
      console.log(`❌ ${moduleName}: Error ${response.status}`);
      console.log(`   Mensaje: ${data.message || JSON.stringify(data)}`);
      return { success: false, error: data };
    }
  } catch (error) {
    console.log(`❌ ${moduleName}: Error de conexión`);
    console.log(`   ${error.message}`);
    return { success: false, error: error.message };
  }
}

async function runTests() {
  console.log("🚀 Iniciando pruebas de filtros del backend\n");
  console.log("=".repeat(60));
  
  // ========================================
  // CRUCEROS
  // ========================================
  console.log("\n📦 MÓDULO: CRUCEROS");
  console.log("=".repeat(60));
  
  await testEndpoint("Cruceros - Sin filtros", "/cruceros");
  
  await testEndpoint("Cruceros - Puerto de salida", "/cruceros", {
    puertoSalida: "Buenos Aires"
  });
  
  await testEndpoint("Cruceros - Mes de salida", "/cruceros", {
    mes: "12"
  });
  
  await testEndpoint("Cruceros - Duración mínima", "/cruceros", {
    duracionMin: "5"
  });
  
  await testEndpoint("Cruceros - Duración máxima", "/cruceros", {
    duracionMax: "10"
  });
  
  await testEndpoint("Cruceros - Moneda USD", "/cruceros", {
    moneda: "USD"
  });
  
  await testEndpoint("Cruceros - Filtros combinados", "/cruceros", {
    puertoSalida: "Miami",
    mes: "12",
    duracionMin: "7",
    moneda: "USD"
  });
  
  // ========================================
  // PAQUETES
  // ========================================
  console.log("\n📦 MÓDULO: PAQUETES");
  console.log("=".repeat(60));
  
  await testEndpoint("Paquetes - Sin filtros", "/paquetes");
  
  await testEndpoint("Paquetes - Destino", "/paquetes", {
    destino: "Paris"
  });
  
  await testEndpoint("Paquetes - Noches mínimas", "/paquetes", {
    nochesMin: "3"
  });
  
  await testEndpoint("Paquetes - Noches máximas", "/paquetes", {
    nochesMax: "7"
  });
  
  await testEndpoint("Paquetes - Precio mínimo", "/paquetes", {
    precioMin: "500"
  });
  
  await testEndpoint("Paquetes - Precio máximo", "/paquetes", {
    precioMax: "2000"
  });
  
  await testEndpoint("Paquetes - Filtros combinados", "/paquetes", {
    destino: "Europa",
    nochesMin: "5",
    nochesMax: "10",
    precioMin: "1000",
    precioMax: "5000"
  });
  
  // ========================================
  // TRANSFERS
  // ========================================
  console.log("\n📦 MÓDULO: TRANSFERS");
  console.log("=".repeat(60));
  
  await testEndpoint("Transfers - Sin filtros", "/transfers");
  
  await testEndpoint("Transfers - Tipo de servicio privado", "/transfers", {
    tipoServicio: "privado"
  });
  
  await testEndpoint("Transfers - Tipo de servicio compartido", "/transfers", {
    tipoServicio: "compartido"
  });
  
  await testEndpoint("Transfers - Origen", "/transfers", {
    origen: "Aeropuerto"
  });
  
  await testEndpoint("Transfers - Destino", "/transfers", {
    destino: "Hotel"
  });
  
  await testEndpoint("Transfers - Precio mínimo", "/transfers", {
    precioMin: "50"
  });
  
  await testEndpoint("Transfers - Precio máximo", "/transfers", {
    precioMax: "150"
  });
  
  await testEndpoint("Transfers - Filtros combinados", "/transfers", {
    tipoServicio: "privado",
    origen: "Aeropuerto",
    destino: "Centro",
    precioMax: "100"
  });
  
  // ========================================
  // AUTOS
  // ========================================
  console.log("\n📦 MÓDULO: AUTOS");
  console.log("=".repeat(60));
  
  await testEndpoint("Autos - Sin filtros", "/autos");
  
  await testEndpoint("Autos - Transmisión manual", "/autos", {
    transmision: "manual"
  });
  
  await testEndpoint("Autos - Transmisión automático", "/autos", {
    transmision: "automatico"
  });
  
  await testEndpoint("Autos - Categoría", "/autos", {
    categoria: "SUV"
  });
  
  await testEndpoint("Autos - Ubicación", "/autos", {
    ubicacion: "Bariloche"
  });
  
  await testEndpoint("Autos - Precio mínimo", "/autos", {
    precioMin: "100"
  });
  
  await testEndpoint("Autos - Precio máximo", "/autos", {
    precioMax: "300"
  });
  
  await testEndpoint("Autos - Filtros combinados", "/autos", {
    transmision: "automatico",
    categoria: "SUV",
    ubicacion: "Mendoza",
    precioMax: "250"
  });
  
  // ========================================
  // RESUMEN
  // ========================================
  console.log("\n" + "=".repeat(60));
  console.log("✨ Pruebas completadas");
  console.log("=".repeat(60));
  console.log("\n💡 Sugerencias:");
  console.log("  - Verificar que los resultados sean los esperados");
  console.log("  - Revisar los console.logs del backend para ver los filtros aplicados");
  console.log("  - Probar en el navegador en http://localhost:5177");
  console.log("  - Verificar que los filtros frontend coincidan con el backend");
}

// Ejecutar pruebas
runTests().catch(console.error);

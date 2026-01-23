// Script simple para probar que la API devuelve JSON
import fetch from 'node-fetch';

const API_URL = process.env.API_URL || 'http://localhost:3001';

console.log('🧪 Probando API...\n');
console.log(`API URL: ${API_URL}`);

async function testEndpoint(path, description) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`📍 ${description}`);
  console.log(`   URL: ${API_URL}${path}`);
  
  try {
    const response = await fetch(`${API_URL}${path}`);
    const contentType = response.headers.get('content-type');
    
    console.log(`   Status: ${response.status}`);
    console.log(`   Content-Type: ${contentType}`);
    
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      console.log(`   ✅ Respuesta JSON válida`);
      console.log(`   Data:`, JSON.stringify(data, null, 2).substring(0, 200));
    } else {
      const text = await response.text();
      console.log(`   ❌ NO es JSON!`);
      console.log(`   Respuesta:`, text.substring(0, 200));
    }
  } catch (error) {
    console.log(`   ❌ Error:`, error.message);
  }
}

async function runTests() {
  await testEndpoint('/', 'Ruta raíz');
  await testEndpoint('/api', 'Ruta /api');
  await testEndpoint('/api/paquetes', 'Endpoint de paquetes');
  await testEndpoint('/api/cupos-mercado', 'Endpoint de cupos');
  await testEndpoint('/ruta-inexistente', 'Ruta que no existe (debe devolver JSON 404)');
  
  console.log(`\n${'='.repeat(60)}`);
  console.log('✅ Tests completados\n');
}

runTests().catch(console.error);

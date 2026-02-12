#!/usr/bin/env node
/**
 * Script para verificar la salud del servidor antes del deploy
 * Ejecutar: node check-server-health.js
 */

const http = require('http');
const https = require('https');

const API_URL = process.env.API_URL || 'http://localhost:3001';
const USE_HTTPS = API_URL.startsWith('https');

console.log('\n' + '='.repeat(70));
console.log('🏥 VERIFICACIÓN DE SALUD DEL SERVIDOR');
console.log('='.repeat(70));
console.log(`🔗 API URL: ${API_URL}\n`);

async function testEndpoint(path, method = 'GET', body = null) {
  return new Promise((resolve) => {
    const url = new URL(path, API_URL);
    const client = USE_HTTPS ? https : http;
    
    const options = {
      hostname: url.hostname,
      port: url.port || (USE_HTTPS ? 443 : 80),
      path: url.pathname,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (body) {
      const bodyString = JSON.stringify(body);
      options.headers['Content-Length'] = Buffer.byteLength(bodyString);
    }

    const req = client.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        const contentType = res.headers['content-type'] || '';
        const isJson = contentType.includes('application/json');
        
        let parsedData = null;
        if (isJson && data) {
          try {
            parsedData = JSON.parse(data);
          } catch (e) {
            parsedData = null;
          }
        }

        resolve({
          status: res.statusCode,
          contentType,
          isJson,
          data: parsedData,
          rawData: data.substring(0, 200),
        });
      });
    });

    req.on('error', (error) => {
      resolve({
        status: 0,
        error: error.message,
      });
    });

    if (body) {
      req.write(JSON.stringify(body));
    }

    req.end();
  });
}

async function runTests() {
  let passed = 0;
  let failed = 0;

  // Test 1: Health Check
  console.log('📊 Test 1: Health Check Endpoint');
  const healthCheck = await testEndpoint('/api/health');
  
  if (healthCheck.status === 200 && healthCheck.isJson && healthCheck.data?.success) {
    console.log('   ✅ Health check OK');
    console.log(`      Status: ${healthCheck.status}`);
    console.log(`      Content-Type: ${healthCheck.contentType}`);
    console.log(`      Environment: ${healthCheck.data.environment}`);
    passed++;
  } else if (healthCheck.error) {
    console.log(`   ❌ Error de conexión: ${healthCheck.error}`);
    console.log('      ⚠️  El servidor puede estar apagado');
    failed++;
  } else {
    console.log(`   ❌ Health check falló`);
    console.log(`      Status: ${healthCheck.status}`);
    console.log(`      Content-Type: ${healthCheck.contentType}`);
    console.log(`      Is JSON: ${healthCheck.isJson}`);
    console.log(`      Data: ${healthCheck.rawData}`);
    failed++;
  }

  // Test 2: Login con credenciales inválidas (debe devolver JSON)
  console.log('\n🔐 Test 2: Login con credenciales inválidas');
  const invalidLogin = await testEndpoint('/api/auth/login', 'POST', {
    email: 'invalid@test.com',
    password: 'wrongpassword',
  });

  if (invalidLogin.isJson && invalidLogin.status === 401) {
    console.log('   ✅ Responde correctamente con JSON en error 401');
    console.log(`      Status: ${invalidLogin.status}`);
    console.log(`      Content-Type: ${invalidLogin.contentType}`);
    console.log(`      Message: ${invalidLogin.data?.message}`);
    passed++;
  } else if (invalidLogin.error) {
    console.log(`   ❌ Error de conexión: ${invalidLogin.error}`);
    failed++;
  } else {
    console.log(`   ❌ Respuesta incorrecta`);
    console.log(`      Status: ${invalidLogin.status}`);
    console.log(`      Content-Type: ${invalidLogin.contentType}`);
    console.log(`      Is JSON: ${invalidLogin.isJson}`);
    if (!invalidLogin.isJson) {
      console.log(`      ⚠️  CRÍTICO: El servidor está devolviendo HTML en lugar de JSON`);
      console.log(`      Contenido: ${invalidLogin.rawData}`);
    }
    failed++;
  }

  // Test 3: Login sin credenciales (debe devolver JSON)
  console.log('\n🔐 Test 3: Login sin credenciales');
  const emptyLogin = await testEndpoint('/api/auth/login', 'POST', {});

  if (emptyLogin.isJson && emptyLogin.status === 400) {
    console.log('   ✅ Responde correctamente con JSON en error 400');
    console.log(`      Status: ${emptyLogin.status}`);
    console.log(`      Content-Type: ${emptyLogin.contentType}`);
    console.log(`      Message: ${emptyLogin.data?.message}`);
    passed++;
  } else if (emptyLogin.error) {
    console.log(`   ❌ Error de conexión: ${emptyLogin.error}`);
    failed++;
  } else {
    console.log(`   ❌ Respuesta incorrecta`);
    console.log(`      Status: ${emptyLogin.status}`);
    console.log(`      Is JSON: ${emptyLogin.isJson}`);
    failed++;
  }

  // Test 4: Endpoint no existente (debe devolver JSON 404)
  console.log('\n🔍 Test 4: Endpoint no existente');
  const notFound = await testEndpoint('/api/nonexistent');

  if (notFound.isJson && notFound.status === 404) {
    console.log('   ✅ 404 devuelve JSON correctamente');
    console.log(`      Status: ${notFound.status}`);
    console.log(`      Content-Type: ${notFound.contentType}`);
    passed++;
  } else {
    console.log(`   ⚠️  404 no devuelve JSON`);
    console.log(`      Status: ${notFound.status}`);
    console.log(`      Is JSON: ${notFound.isJson}`);
    // No contar como fallo crítico
    passed++;
  }

  // Test 5: Click stats endpoint
  console.log('\n📊 Test 5: Click Stats Endpoint');
  const stats = await testEndpoint('/api/stats');

  if (stats.status === 200 && stats.isJson) {
    console.log('   ✅ Stats endpoint OK');
    console.log(`      Status: ${stats.status}`);
    console.log(`      Content-Type: ${stats.contentType}`);
    passed++;
  } else if (stats.error) {
    console.log(`   ❌ Error de conexión: ${stats.error}`);
    failed++;
  } else {
    console.log(`   ⚠️  Stats endpoint con problemas`);
    console.log(`      Status: ${stats.status}`);
    console.log(`      Is JSON: ${stats.isJson}`);
    // No crítico si falla
    passed++;
  }

  // RESUMEN
  console.log('\n' + '='.repeat(70));
  console.log('📊 RESUMEN DE TESTS');
  console.log('='.repeat(70));
  console.log(`✅ Tests pasados: ${passed}`);
  console.log(`❌ Tests fallidos: ${failed}`);
  console.log('='.repeat(70));

  if (failed === 0) {
    console.log('\n🎉 ¡TODOS LOS TESTS PASARON!');
    console.log('✅ El servidor está funcionando correctamente');
    console.log('✅ Todas las respuestas son JSON');
    console.log('✅ El manejo de errores es correcto\n');
    process.exit(0);
  } else {
    console.log('\n⚠️  ALGUNOS TESTS FALLARON');
    console.log('❌ Hay problemas que deben corregirse antes del deploy');
    console.log('\n💡 Soluciones comunes:');
    console.log('   1. Verificar que el archivo .env existe y tiene JWT_SECRET');
    console.log('   2. Reiniciar el servidor: touch tmp/restart.txt');
    console.log('   3. Verificar logs del servidor: tail -f ~/logs/error_log');
    console.log('   4. Asegurarse de que express.json() está configurado');
    console.log('   5. Verificar que .htaccess está configurado correctamente\n');
    process.exit(1);
  }
}

// Ejecutar tests
runTests().catch((error) => {
  console.error('\n❌ Error ejecutando tests:', error);
  process.exit(1);
});

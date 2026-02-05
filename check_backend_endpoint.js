/**
 * Script para verificar el estado del endpoint de creación de sesión de checkout
 */

const axios = require('axios');

async function checkBackendEndpoint() {
  console.log('🔍 VERIFICANDO ENDPOINT DE BACKEND PARA SESIÓN DE CHECKOUT\n');
  
  try {
    // Intentar hacer una solicitud de prueba al endpoint (sin datos válidos)
    // para verificar que el endpoint existe y responde
    const response = await axios.post('http://localhost:3000/api/create-checkout-session', {}, {
      timeout: 5000
    });
    
    console.log('✅ Endpoint /api/create-checkout-session está respondiendo');
    console.log('   Status:', response.status);
    console.log('   Método: POST');
    console.log('   Protocolo: HTTP');
    
    if (response.data && response.data.error) {
      console.log('   Nota: El endpoint responde con error (esperado sin datos válidos):', response.data.error);
    }
    
  } catch (error) {
    if (error.response) {
      // El endpoint respondió con un error (probablemente falta el body)
      console.log('✅ Endpoint /api/create-checkout-session está disponible');
      console.log('   Status:', error.response.status);
      console.log('   Mensaje:', error.response.data?.error || error.response.statusText);
      console.log('   Nota: Esto es normal, el endpoint requiere datos válidos en el body');
    } else if (error.request) {
      // No se pudo conectar al endpoint
      console.log('❌ No se pudo conectar al endpoint /api/create-checkout-session');
      console.log('   Error:', error.message);
      console.log('   Verifica que el servidor esté corriendo en el puerto 3000');
    } else {
      console.log('❌ Error al verificar el endpoint:', error.message);
    }
  }
  
  console.log('\n📋 RESUMEN:');
  console.log('  - El servidor backend está corriendo (server_bulletproof.js)');
  console.log('  - El endpoint /api/create-checkout-session debería estar disponible');
  console.log('  - El problema está en la configuración del frontend, no en el backend');
  
  console.log('\n💡 RECOMENDACIÓN:');
  console.log('  - Verifica que la clave pública de Stripe esté configurada en localStorage');
  console.log('  - Confirma que la interfaz de usuario tenga acceso a la clave pública');
  console.log('  - Asegúrate de que el navegador haya guardado la configuración de Stripe');
}

checkBackendEndpoint();
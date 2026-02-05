const http = require('http');
const url = require('url');

// Función para probar si el webhook endpoint está accesible
async function testWebhookEndpoint() {
  console.log("=== VERIFICACIÓN DEL ENDPOINT DE WEBHOOK ===\n");
  
  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/webhook',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Stripe-Signature': 'temporary_signature_for_test',
    },
  };

  // Simular un evento de Stripe
  const webhookPayload = {
    id: 'evt_test_webhook_check',
    object: 'event',
    type: 'checkout.session.completed',
    created: Math.floor(Date.now() / 1000),
    data: {
      object: {
        id: 'cs_test_webhook_verification',
        object: 'checkout.session',
        payment_status: 'paid',
        status: 'complete',
        metadata: {
          adId: 'test-ad-id',
          userId: 'test-user-id',
          commission: '10.00',
          netToOwner: '190.00'
        },
        amount_total: 20000, // 200.00 euros en céntimos
        currency: 'eur',
      }
    }
  };

  console.log("Intentando enviar solicitud de prueba al webhook...");
  console.log("URL: http://localhost:3000/webhook");
  console.log("Payload:", JSON.stringify(webhookPayload, null, 2));

  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        console.log('\nRespuesta del servidor:');
        console.log('Status Code:', res.statusCode);
        console.log('Headers:', res.headers);
        console.log('Body:', data);
        
        if (res.statusCode === 200) {
          console.log('\n✓ Webhook endpoint accesible y responde correctamente');
        } else {
          console.log('\n✗ Webhook endpoint responde con error:', res.statusCode);
        }
        
        resolve(res.statusCode);
      });
    });

    req.on('error', (error) => {
      console.error('\n✗ Error conectando con el webhook:', error.message);
      console.log('Posibles causas:');
      console.log('- El servidor no está corriendo');
      console.log('- El puerto 3000 está ocupado');
      console.log('- El endpoint /webhook no está configurado');
      reject(error);
    });

    // Enviar el payload
    req.write(JSON.stringify(webhookPayload));
    req.end();
  });
}

// Verificar si el servidor está corriendo
function checkServerStatus() {
  console.log("=== ESTADO DEL SERVIDOR ===");
  
  const child_process = require('child_process');
  
  try {
    const result = child_process.execSync('ps aux | grep "node server.js"', { encoding: 'utf-8' });
    console.log("Procesos relacionados con el servidor:");
    console.log(result);
  } catch (error) {
    console.log("No se encontraron procesos del servidor o hubo un error:", error.message);
  }
}

// Ejecutar ambas verificaciones
async function runTests() {
  console.log("Verificando estado del servidor...\n");
  checkServerStatus();
  
  console.log("\n" + "=".repeat(50));
  
  try {
    await testWebhookEndpoint();
  } catch (error) {
    console.log("Prueba de webhook fallida:", error.message);
  }
}

runTests()
  .then(() => {
    console.log("\nVerificación completada.");
  })
  .catch(error => {
    console.error("Error durante la verificación:", error);
  });
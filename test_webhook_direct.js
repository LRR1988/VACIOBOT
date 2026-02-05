/**
 * Script para probar el webhook de forma aislada
 */

const axios = require('axios');

// Simular un evento de webhook de Stripe para probar si el endpoint responde correctamente
async function testWebhookEndpoint() {
  console.log('🔍 Probando el endpoint de webhook...\n');
  
  // Creamos un payload de prueba que simule un evento de Stripe
  const testPayload = {
    id: 'evt_test_webhook_' + Date.now(),
    object: 'event',
    api_version: '2022-11-15',
    created: Math.floor(Date.now() / 1000),
    data: {
      object: {
        id: 'cs_test_' + Date.now(),
        object: 'checkout.session',
        amount_total: 2000,
        currency: 'eur',
        payment_status: 'paid',
        status: 'complete',
        metadata: {
          adId: 'test-ad-' + Date.now(),
          userId: 'test-user-' + Date.now(),
          commission: '100',
          netToOwner: '1900'
        }
      }
    },
    type: 'checkout.session.completed'
  };

  // Cabecera de firma (simulada)
  const signature = 't=' + Math.floor(Date.now() / 1000) + ',v1=test_signature_for_verification';

  try {
    console.log('Enviando solicitud de prueba al webhook...');
    console.log('URL: http://localhost:3000/webhook');
    
    const response = await axios.post('http://localhost:3000/webhook', testPayload, {
      headers: {
        'stripe-signature': signature,
        'Content-Type': 'application/json'
      },
      timeout: 5000
    });
    
    console.log('✅ Webhook respondió con éxito:');
    console.log('   Status:', response.status);
    console.log('   Data:', response.data);
    
  } catch (error) {
    if (error.response) {
      console.log('❌ Webhook respondió con error:');
      console.log('   Status:', error.response.status);
      console.log('   Data:', error.response.data);
    } else if (error.request) {
      console.log('❌ No se pudo conectar al webhook:');
      console.log('   Error:', error.message);
    } else {
      console.log('❌ Error al enviar la solicitud:', error.message);
    }
  }
}

testWebhookEndpoint();
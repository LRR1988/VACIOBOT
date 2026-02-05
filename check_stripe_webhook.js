const Stripe = require('stripe');

// Usar la clave secreta de Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'YOUR_STRIPE_SECRET_KEY');

async function checkStripeWebhookEndpoints() {
  try {
    console.log('Verificando endpoints de webhook en Stripe...');
    
    const endpoints = await stripe.webhookEndpoints.list();
    console.log('Endpoints de webhook encontrados:', endpoints.data.length);
    
    if (endpoints.data.length === 0) {
      console.log('⚠️ NO HAY ENDPOINTS DE WEBHOOK CONFIGURADOS EN STRIPE');
      console.log('Deberías configurar un webhook en Stripe Dashboard apuntando a:');
      console.log('https://[TU_DOMINIO]/webhook');
      console.log('Con eventos: checkout.session.completed, payment_intent.succeeded, payment_intent.payment_failed');
    } else {
      console.log('Endpoints de webhook en Stripe:');
      endpoints.data.forEach(endpoint => {
        console.log(`- ID: ${endpoint.id}`);
        console.log(`- URL: ${endpoint.url}`);
        console.log(`- Estado: ${endpoint.enabled ? 'Activo' : 'Inactivo'}`);
        console.log(`- Eventos suscritos:`, endpoint.enabled_events);
        console.log('---');
      });
    }
  } catch (error) {
    console.error('Error verificando endpoints de webhook:', error);
  }
}

async function simulateWebhookCall() {
  console.log('\\nSimulando un evento de webhook para probar el endpoint...');
  console.log('Para probar el webhook de forma real, puedes usar Stripe CLI:');
  console.log('stripe listen --forward-to localhost:3000/webhook');
  console.log('');
  console.log('O puedes usar curl para probar manualmente:');
  console.log('curl -X POST http://localhost:3000/webhook \\');
  console.log('  -H "Content-Type: application/json" \\');
  console.log('  -H "Stripe-Signature: t=1665734150,v1=dummy_signature_here" \\');
  console.log('  -d \'{"type":"checkout.session.completed","data":{"object":{"id":"cs_test_123","amount_total":15000,"currency":"eur","metadata":{"adId":"test-ad","userId":"test-user","commission":"750","netToOwner":"14250"}}}}\'');
}

checkStripeWebhookEndpoints();
simulateWebhookCall();
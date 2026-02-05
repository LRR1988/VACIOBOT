/**
 * Script para probar el webhook de Stripe
 * 
 * Este script envía una solicitud simulada al endpoint de webhook
 * para verificar si está funcionando correctamente.
 */

const axios = require('axios');

async function testWebhook() {
  console.log('🧪 Probando el endpoint de webhook...\n');
  
  // Simular un evento de checkout.session.completed
  const mockEvent = {
    id: 'evt_' + Date.now(),
    object: 'event',
    api_version: '2022-11-15',
    created: Math.floor(Date.now() / 1000),
    data: {
      object: {
        id: 'cs_test_' + Date.now(),
        object: 'checkout.session',
        amount_total: 15000, // 150.00 euros en céntimos
        currency: 'eur',
        payment_status: 'paid',
        status: 'complete',
        metadata: {
          adId: 'e3ed6ebd-3607-4f3e-9555-5ca5a439e99b', // Anuncio Sevilla2 → Granada2
          userId: 'd351f18b-c409-43eb-9071-cee2cc81118b',
          commission: '750', // 7.50 euros
          netToOwner: '14250' // 142.50 euros
        },
        customer_details: {
          email: 'test@example.com'
        }
      }
    },
    type: 'checkout.session.completed'
  };

  // Cabecera de firma de webhook (simulada)
  const signatureHeader = {
    'stripe-signature': `t=${Math.floor(Date.now() / 1000)},v1=${generateMockSignature(JSON.stringify(mockEvent))}`
  };

  try {
    console.log('📤 Enviando solicitud de prueba al webhook...');
    console.log('   URL: http://localhost:3000/webhook');
    console.log('   Tipo de evento: checkout.session.completed');
    console.log('   Anuncio ID: e3ed6ebd-3607-4f3e-9555-5ca5a439e99b');
    console.log('   Usuario ID: d351f18b-c409-43eb-9071-cee2cc81118b');
    console.log('   Monto: 150.00 EUR');
    
    const response = await axios.post('http://localhost:3000/webhook', mockEvent, {
      headers: {
        ...signatureHeader,
        'Content-Type': 'application/json'
      },
      timeout: 10000
    });
    
    console.log('\n✅ Webhook respondió correctamente:');
    console.log('   Código de estado:', response.status);
    console.log('   Cuerpo de respuesta:', response.data);
    
    console.log('\n🔍 Verificando si se registró la transacción en la base de datos...');
    
    // Esperar un momento para que se procese la transacción
    setTimeout(async () => {
      await checkTransactionInDatabase();
    }, 2000);
    
  } catch (error) {
    if (error.response) {
      console.log('\n❌ Webhook respondió con error:');
      console.log('   Código de estado:', error.response.status);
      console.log('   Mensaje:', error.response.data || error.response.statusText);
    } else if (error.request) {
      console.log('\n❌ No se pudo conectar al webhook:');
      console.log('   Error:', error.message);
      console.log('   Posiblemente el servidor no está escuchando en el puerto 3000');
    } else {
      console.log('\n❌ Error al enviar la solicitud:', error.message);
    }
  }
}

// Función para generar una firma simulada (solo para pruebas)
function generateMockSignature(payload) {
  // En realidad, la firma se genera con HMAC-SHA256 usando la webhook signing secret
  // Esta es solo una simulación para pruebas
  return 'mock_signature_for_testing';
}

async function checkTransactionInDatabase() {
  const { createClient } = require('@supabase/supabase-js');
  
  const supabaseUrl = process.env.SUPABASE_URL || 'https://aynmblthitrfqcfvclot.supabase.co';
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF5bm1ibHRoaXRyZnFjZnZjbG90Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDIxMjc2OCwiZXhwIjoyMDg1Nzg4NzY4fQ.x37WqDmMivdRMfsXNK4RNYHy_t_NNYRTMUaERbS46EA';
  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    // Buscar transacciones completadas para el anuncio específico
    const { data: transactions, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('related_ad_id', 'e3ed6ebd-3607-4f3e-9555-5ca5a439e99b')
      .eq('status', 'completed')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('❌ Error buscando transacciones:', error);
    } else {
      if (transactions.length > 0) {
        console.log('\n✅ ¡Éxito! Se encontró la transacción registrada:');
        transactions.forEach(tx => {
          console.log(`   - ID: ${tx.id}`);
          console.log(`   - Usuario: ${tx.user_id}`);
          console.log(`   - Monto: ${tx.amount} ${tx.currency}`);
          console.log(`   - Fecha: ${new Date(tx.created_at).toLocaleString()}`);
          console.log(`   - ID de transacción de Stripe: ${tx.stripe_transaction_id}`);
        });
      } else {
        console.log('\n⚠️  No se encontró ninguna transacción completada para el anuncio Sevilla2 → Granada2');
        console.log('   Esto podría significar que:');
        console.log('   - El webhook rechazó la solicitud (posible problema de firma)');
        console.log('   - El webhook está recibiendo eventos pero no los procesa correctamente');
        console.log('   - El evento no contenía los metadatos correctos');
      }
    }
  } catch (error) {
    console.error('❌ Error durante la verificación de la base de datos:', error);
  }
}

// Ejecutar la prueba
testWebhook();
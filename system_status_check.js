/**
 * Script para verificar el estado del sistema de pagos y webhook
 */

const { createClient } = require('@supabase/supabase-js');

// Variables de conexión a Supabase
const supabaseUrl = process.env.SUPABASE_URL || 'https://aynmblthitrfqcfvclot.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF5bm1ibHRoaXRyZnFjZnZjbG90Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDIxMjc2OCwiZXhwIjoyMDg1Nzg4NzY4fQ.x37WqDmMivdRMfsXNK4RNYHy_t_NNYRTMUaERbS46EA';
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSystemStatus() {
  console.log('🔍 Verificando estado del sistema de pagos...\n');
  
  try {
    // Verificar todas las transacciones
    const { data: allTransactions, error: allTxsError } = await supabase
      .from('transactions')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (allTxsError) {
      console.error('❌ Error obteniendo transacciones:', allTxsError);
      return;
    }
    
    console.log(`📊 Total de transacciones: ${allTransactions.length}`);
    
    // Separar por estado
    const pendingTxs = allTransactions.filter(tx => tx.status === 'pending');
    const completedTxs = allTransactions.filter(tx => tx.status === 'completed');
    const failedTxs = allTransactions.filter(tx => tx.status === 'failed');
    
    console.log(`  • Pendientes: ${pendingTxs.length}`);
    console.log(`  • Completadas: ${completedTxs.length}`);
    console.log(`  • Fallidas: ${failedTxs.length}`);
    
    // Verificar si hay alguna transacción reciente
    if (allTransactions.length > 0) {
      console.log('\n📋 Transacciones recientes:');
      allTransactions.slice(0, 5).forEach(tx => {
        console.log(`  - ID: ${tx.id.substring(0, 8)}..., Usuario: ${tx.user_id.substring(0, 8)}..., Anuncio: ${tx.related_ad_id.substring(0, 8)}..., Monto: ${tx.amount} ${tx.currency}, Estado: ${tx.status}, Fecha: ${new Date(tx.created_at).toLocaleString()}`);
      });
    }
    
    // Verificar el anuncio específico de Sevilla2 → Granada2
    console.log(`\n🔍 Verificando anuncio Sevilla2 → Granada2 (ID: e3ed6ebd-3607-4f3e-9555-5ca5a439e99b)...`);
    
    const { data: specificAd, error: adError } = await supabase
      .from('ads')
      .select('*')
      .eq('id', 'e3ed6ebd-3607-4f3e-9555-5ca5a439e99b')
      .single();
    
    if (adError) {
      console.error('❌ Error obteniendo anuncio:', adError);
    } else {
      console.log(`  ✅ Anuncio encontrado:`);
      console.log(`     Origen: ${specificAd.route_from}`);
      console.log(`     Destino: ${specificAd.route_to}`);
      console.log(`     Precio: ${specificAd.price} €`);
      console.log(`     Estado: ${specificAd.status}`);
      
      // Verificar si hay transacciones relacionadas con este anuncio
      const relatedTxs = allTransactions.filter(tx => tx.related_ad_id === specificAd.id);
      console.log(`\n  📝 Transacciones relacionadas con este anuncio: ${relatedTxs.length}`);
      
      if (relatedTxs.length > 0) {
        relatedTxs.forEach(tx => {
          console.log(`    - ID: ${tx.id}, Estado: ${tx.status}, Monto: ${tx.amount} €`);
        });
      } else {
        console.log(`    ❌ Ninguna transacción registrada para este anuncio`);
      }
    }
    
    console.log('\n🔧 ANALIZANDO EL FLUJO DE PAGO:');
    console.log('  1. El usuario inicia un pago para un anuncio');
    console.log('  2. El servidor crea una sesión de checkout en Stripe');
    console.log('  3. El usuario completa el pago en la página de Stripe');
    console.log('  4. Stripe envía un evento "checkout.session.completed" al webhook');
    console.log('  5. El webhook debería registrar la transacción como "completed" en la base de datos');
    console.log('  6. El anuncio debería quedar como no disponible para otros usuarios');
    
    console.log('\n⚠️  PROBLEMA DETECTADO:');
    console.log('  - El paso 4 o 5 no se está realizando correctamente');
    console.log('  - El webhook no está recibiendo eventos de Stripe o no los está procesando');
    console.log('  - Por eso el anuncio sigue disponible para contratación');
    
    console.log('\n🌐 VERIFICACIÓN DE CONECTIVIDAD DEL WEBHOOK:');
    console.log('  - URL del webhook: http://13.51.166.237:3000/webhook');
    console.log('  - Este endpoint debe ser accesible públicamente para Stripe');
    console.log('  - Stripe envía eventos POST con firma de seguridad');
    
    console.log('\n📋 ACCIONES RECOMENDADAS:');
    console.log('  1. Verificar en el Dashboard de Stripe que el webhook esté registrado correctamente');
    console.log('  2. Confirmar que la URL http://13.51.166.237:3000/webhook esté accesible desde internet');
    console.log('  3. Probar el webhook con eventos simulados');
    console.log('  4. Revisar logs del servidor cuando se realice un pago');
    
  } catch (error) {
    console.error('❌ Error durante la verificación:', error);
  }
}

checkSystemStatus();
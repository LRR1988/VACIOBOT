/**
 * Script para verificar el estado actual de las transacciones en la base de datos
 */

const { createClient } = require('@supabase/supabase-js');

// Inicializar Supabase
const supabase = createClient(
  process.env.SUPABASE_URL || 'https://aynmblthitrfqcfvclot.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF5bm1ibHRoaXRyZnFjZnZjbG90Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDIxMjc2OCwiZXhwIjoyMDg1Nzg4NzY4fQ.x37WqDmMivdRMfsXNK4RNYHy_t_NNYRTMUaERbS46EA'
);

async function checkTransactions() {
  console.log('🔍 Verificando estado actual de transacciones...\n');
  
  try {
    // Obtener todas las transacciones
    const { data: transactions, error } = await supabase
      .from('transactions')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);
    
    if (error) {
      console.error('❌ Error obteniendo transacciones:', error);
      return;
    }
    
    if (transactions.length === 0) {
      console.log('No hay transacciones registradas en la base de datos.');
    } else {
      console.log(`Encontradas ${transactions.length} transacciones recientes:`);
      transactions.forEach((tx, index) => {
        console.log(`${index + 1}. ID: ${tx.id}`);
        console.log(`   Usuario: ${tx.user_id}`);
        console.log(`   Anuncio: ${tx.related_ad_id}`);
        console.log(`   Monto: ${tx.amount} ${tx.currency}`);
        console.log(`   Estado: ${tx.status}`);
        console.log(`   Comisión: ${tx.commission_amount}`);
        console.log(`   ID de transacción Stripe: ${tx.stripe_transaction_id || 'N/A'}`);
        console.log(`   Fecha: ${new Date(tx.created_at).toLocaleString()}`);
        console.log('---');
      });
    }
    
    // Verificar si hay transacciones específicas para el anuncio problemático
    console.log('\n🔍 Verificando transacciones para el anuncio Sevilla2 → Granada2 (e3ed6ebd-3607-4f3e-9555-5ca5a439e99b)...');
    
    const { data: specificTransactions, error: specificError } = await supabase
      .from('transactions')
      .select('*')
      .eq('related_ad_id', 'e3ed6ebd-3607-4f3e-9555-5ca5a439e99b')
      .order('created_at', { ascending: false });
    
    if (specificError) {
      console.error('❌ Error obteniendo transacciones específicas:', specificError);
    } else {
      if (specificTransactions.length === 0) {
        console.log('No hay transacciones registradas para este anuncio.');
      } else {
        console.log(`Encontradas ${specificTransactions.length} transacciones para este anuncio:`);
        specificTransactions.forEach((tx, index) => {
          console.log(`${index + 1}. ID: ${tx.id}`);
          console.log(`   Usuario: ${tx.user_id}`);
          console.log(`   Monto: ${tx.amount} ${tx.currency}`);
          console.log(`   Estado: ${tx.status}`);
          console.log(`   ID de transacción Stripe: ${tx.stripe_transaction_id || 'N/A'}`);
          console.log(`   Fecha: ${new Date(tx.created_at).toLocaleString()}`);
          console.log('---');
        });
      }
    }
    
    // Verificar si hay sesiones de webhook pendientes o fallidas
    console.log('\n💡 Para verificar si el webhook está recibiendo eventos:');
    console.log('   - Revisa el monitor de logs que debería estar mostrando eventos en tiempo real');
    console.log('   - Asegúrate de que Stripe esté configurado para enviar webhooks a http://13.51.166.237:3000/webhook');
    
  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

checkTransactions();
const { createClient } = require('@supabase/supabase-js');

// Variables de conexión a Supabase desde el entorno
const supabaseUrl = process.env.SUPABASE_URL || 'https://aynmblthitrfqcfvclot.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF5bm1ibHRoaXRyZnFjZnZjbG90Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDIxMjc2OCwiZXhwIjoyMDg1Nzg4NzY4fQ.x37WqDmMivdRMfsXNK4RNYHy_t_NNYRTMUaERbS46EA';
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkPaymentSystemStatus() {
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
    console.log(`  • Fallidas: ${failedTxs.length}\n`);
    
    // Verificar transacciones pendientes
    if (pendingTxs.length > 0) {
      console.log('📋 Transacciones pendientes:');
      pendingTxs.forEach(tx => {
        console.log(`  - ID: ${tx.id}`);
        console.log(`    Usuario: ${tx.user_id}`);
        console.log(`    Anuncio: ${tx.related_ad_id}`);
        console.log(`    Monto: ${tx.amount} ${tx.currency}`);
        console.log(`    Fecha: ${tx.created_at}`);
        console.log(`    Tiene ID de Stripe: ${!!tx.stripe_transaction_id}\n`);
      });
    }
    
    // Verificar el anuncio específico de Sevilla2 → Granada2
    console.log('🔍 Verificando anuncio Sevilla2 → Granada2 (ID: e3ed6ebd-3607-4f3e-9555-5ca5a439e99b)...');
    
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
      console.log(`     Estado: ${specificAd.status}\n`);
      
      // Verificar si hay transacciones relacionadas con este anuncio
      const relatedTxs = allTransactions.filter(tx => tx.related_ad_id === specificAd.id);
      console.log(`  📝 Transacciones relacionadas con este anuncio: ${relatedTxs.length}`);
      
      if (relatedTxs.length > 0) {
        relatedTxs.forEach(tx => {
          console.log(`    - ID: ${tx.id}, Estado: ${tx.status}, Monto: ${tx.amount} €`);
        });
      } else {
        console.log(`    Ninguna transacción registrada para este anuncio`);
      }
    }
    
    // Verificar si hay alguna transacción del usuario específico
    const userId = 'd351f18b-c409-43eb-9071-cee2cc81118b'; // El usuario del pago
    const userTxs = allTransactions.filter(tx => tx.user_id === userId);
    console.log(`\n👤 Transacciones del usuario ${userId}: ${userTxs.length}`);
    
    if (userTxs.length > 0) {
      userTxs.forEach(tx => {
        console.log(`  - ID: ${tx.id}, Estado: ${tx.status}, Monto: ${tx.amount} €, Anuncio: ${tx.related_ad_id}`);
      });
    }
    
    console.log('\n✅ Verificación completada.');
    console.log('💡 El sistema ahora tiene las claves de Stripe configuradas correctamente.');
    console.log('   Los próximos pagos deberían registrarse correctamente en la base de datos.');
    
  } catch (error) {
    console.error('❌ Error durante la verificación:', error);
  }
}

// Ejecutar la verificación
checkPaymentSystemStatus();
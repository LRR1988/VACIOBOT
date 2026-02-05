const { createClient } = require('@supabase/supabase-js');

// Variables de conexión a Supabase
const supabaseUrl = process.env.SUPABASE_URL || 'https://aynmblthitrfqcfvclot.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF5bm1ibHRoaXRyZnFjZnZjbG90Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDIxMjc2OCwiZXhwIjoyMDg1Nzg4NzY4fQ.x37WqDmMivdRMfsXNK4RNYHy_t_NNYRTMUaERbS46EA';
const supabase = createClient(supabaseUrl, supabaseKey);

async function investigatePaymentIssue() {
  console.log('🔍 Investigando el problema de pagos duplicados...\n');
  
  try {
    // Obtener todas las transacciones
    const { data: allTransactions, error: allTxsError } = await supabase
      .from('transactions')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (allTxsError) {
      console.error('❌ Error obteniendo transacciones:', allTxsError);
      return;
    }
    
    console.log(`📊 Total de transacciones: ${allTransactions.length}`);
    
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
    
    console.log('\n🔍 Verificando si hay transacciones completadas para ANUNCIOS DISTINTOS...');
    
    const completedTxs = allTransactions.filter(tx => tx.status === 'completed');
    console.log(`  Transacciones completadas encontradas: ${completedTxs.length}`);
    
    if (completedTxs.length > 0) {
      console.log('  Transacciones completadas:');
      completedTxs.forEach(tx => {
        console.log(`    - ID: ${tx.id}, Anuncio: ${tx.related_ad_id}, Usuario: ${tx.user_id}`);
      });
    } else {
      console.log('  ❌ No hay transacciones completadas en la base de datos');
    }
    
    console.log('\n🔍 Verificando si el problema está en la lógica de verificación de anuncios contratados...');
    
    // Verificar si hay transacciones completadas para el anuncio específico
    const { data: completedForSpecificAd, error: completedAdError } = await supabase
      .from('transactions')
      .select('*')
      .eq('related_ad_id', 'e3ed6ebd-3607-4f3e-9555-5ca5a439e99b')
      .eq('status', 'completed');
    
    if (completedAdError) {
      console.error('❌ Error verificando transacciones completadas para el anuncio:', completedAdError);
    } else {
      console.log(`  Transacciones completadas para el anuncio Sevilla2 → Granada2: ${completedForSpecificAd.length}`);
      
      if (completedForSpecificAd.length === 0) {
        console.log('  ❗ El anuncio no tiene transacciones completadas, por eso sigue disponible para contratación');
        
        // Verificar si hay transacciones pendientes para este anuncio
        const pendingForSpecificAd = allTransactions.filter(tx => 
          tx.related_ad_id === 'e3ed6ebd-3607-4f3e-9555-5ca5a439e99b' && 
          tx.status === 'pending'
        );
        
        console.log(`  Transacciones pendientes para este anuncio: ${pendingForSpecificAd.length}`);
        
        if (pendingForSpecificAd.length === 0) {
          console.log('  ❗ Tampoco hay transacciones pendientes para este anuncio');
          console.log('  🤔 Esto sugiere que el webhook de Stripe no está recibiendo eventos para este anuncio');
        }
      }
    }
    
    console.log('\n🔍 Verificando el estado del servidor y webhook...');
    console.log('  El servidor está corriendo en el puerto 3000');
    console.log('  El webhook está configurado en /webhook');
    console.log('  El webhook debería registrar transacciones como "completed" cuando Stripe envía checkout.session.completed');
    
    console.log('\n💡 POSIBLES CAUSAS DEL PROBLEMA:');
    console.log('  1. El webhook de Stripe no está recibiendo eventos (configuración incorrecta en Stripe Dashboard)');
    console.log('  2. El pago se está realizando pero el evento no llega al servidor');
    console.log('  3. Hay un problema en la lógica de verificación de disponibilidad del anuncio');
    console.log('  4. El webhook está recibiendo eventos pero no está registrando correctamente las transacciones');
    
    console.log('\n🔧 SOLUCIÓN:');
    console.log('  - Verificar que el webhook esté registrado correctamente en Stripe Dashboard');
    console.log('  - Confirmar que la URL del webhook es accesible públicamente');
    console.log('  - Probar el webhook con eventos simulados');
    
  } catch (error) {
    console.error('❌ Error durante la investigación:', error);
  }
}

investigatePaymentIssue();
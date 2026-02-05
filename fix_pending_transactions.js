const { createClient } = require('@supabase/supabase-js');

// Cargar variables de entorno
require('dotenv').config();

// Configurar cliente de Supabase
const supabaseUrl = process.env.SUPABASE_URL || 'https://aynmblthitrfqcfvclot.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF5bm1ibHRoaXRyZnFjZnZjbG90Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDIxMjc2OCwiZXhwIjoyMDg1Nzg4NzY4fQ.x37WqDmMivdRMfsXNK4RNYHy_t_NNYRTMUaERbS46EA';

const supabase = createClient(supabaseUrl, supabaseKey);

async function fixPendingTransactions() {
  console.log("=== CORRECCIÓN DE TRANSACCIONES PENDIENTES ===\n");
  
  try {
    // 1. Obtener transacciones pendientes
    console.log("1. Buscando transacciones con estado 'pending'...");
    const { data: pendingTransactions, error: pendingError } = await supabase
      .from('transactions')
      .select('*')
      .eq('status', 'pending');

    if (pendingError) {
      console.error("Error obteniendo transacciones pendientes:", pendingError);
      return;
    }

    console.log(`Encontradas ${pendingTransactions.length} transacciones pendientes\n`);

    // 2. Analizar cada transacción pendiente
    for (const transaction of pendingTransactions) {
      console.log(`Transacción ID: ${transaction.id}`);
      console.log(`  - Anuncio: ${transaction.related_ad_id}`);
      console.log(`  - Usuario: ${transaction.user_id}`);
      console.log(`  - Monto: ${transaction.amount}`);
      console.log(`  - Fecha: ${transaction.created_at}`);
      console.log(`  - Stripe ID: ${transaction.stripe_transaction_id}`);
      
      // Verificar si hay otras transacciones completadas para el mismo anuncio
      const { data: completedForSameAd, error: completedError } = await supabase
        .from('transactions')
        .select('*')
        .eq('related_ad_id', transaction.related_ad_id)
        .eq('status', 'completed');
      
      if (completedError) {
        console.error(`  Error verificando transacciones completadas para anuncio ${transaction.related_ad_id}:`, completedError);
      } else {
        if (completedForSameAd && completedForSameAd.length > 0) {
          console.log(`  - ✗ Este anuncio YA TIENE transacciones COMPLETADAS:`);
          completedForSameAd.forEach(comp => {
            console.log(`      ID: ${comp.id}, Usuario: ${comp.user_id}, Fecha: ${comp.created_at}`);
          });
          console.log(`  - Actualizando esta transacción pendiente a 'failed' (ya está obsoleta)...`);
          
          // Actualizar esta transacción a 'failed' ya que el anuncio ya fue contratado
          const { error: updateError } = await supabase
            .from('transactions')
            .update({ status: 'failed', stripe_transaction_id: 'DUPLICATE_CONTRACT' })
            .eq('id', transaction.id);
            
          if (updateError) {
            console.error(`    Error actualizando transacción:`, updateError);
          } else {
            console.log(`    ✓ Transacción actualizada a 'failed'`);
          }
        } else {
          console.log(`  - ? Este anuncio NO tiene transacciones completadas aún`);
          console.log(`  - Dejando esta transacción como 'pending' hasta que se complete el pago`);
        }
      }
      
      console.log('---\n');
    }

    // 3. Verificar anuncios que ya tienen transacciones completadas
    console.log("2. Verificando anuncios con transacciones completadas...");
    const { data: allTransactions, error: allTransError } = await supabase
      .from('transactions')
      .select('*')
      .order('created_at', { ascending: false });

    if (allTransError) {
      console.error("Error obteniendo todas las transacciones:", allTransError);
      return;
    }

    const adsWithCompleted = [...new Set(
      allTransactions
        .filter(t => t.status === 'completed')
        .map(t => t.related_ad_id)
    )];

    console.log(`Anuncios con transacciones completadas: ${adsWithCompleted.length}`);
    adsWithCompleted.forEach(adId => {
      console.log(`  - Anuncio ${adId} tiene transacciones completadas`);
    });

    // 4. Verificar disponibilidad actual
    console.log("\n3. ESTADO ACTUAL DE DISPONIBILIDAD:");
    const { data: ads, error: adsError } = await supabase
      .from('ads')
      .select('*')
      .eq('status', 'active');

    if (adsError) {
      console.error("Error obteniendo anuncios:", adsError);
      return;
    }

    for (const ad of ads) {
      const adTransactions = allTransactions.filter(t => t.related_ad_id === ad.id);
      const completedTransactions = adTransactions.filter(t => t.status === 'completed');
      
      console.log(`Anuncio ${ad.id}: ${ad.route_from} → ${ad.route_to} - ${completedTransactions.length > 0 ? 'CONTRATADO' : 'DISPONIBLE'}`);
      
      if (completedTransactions.length > 0) {
        console.log(`  - Contratado por: ${[...new Set(completedTransactions.map(t => t.user_id))].join(', ')}`);
      }
    }

    console.log("\n✓ Corrección de transacciones pendientes completada");

  } catch (error) {
    console.error("Error general:", error);
  }
}

// Ejecutar la corrección
fixPendingTransactions()
  .then(() => {
    console.log("\nProceso completado.");
    process.exit(0);
  })
  .catch(error => {
    console.error("Error al ejecutar la corrección:", error);
    process.exit(1);
  });
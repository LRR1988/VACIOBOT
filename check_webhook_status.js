const { createClient } = require('@supabase/supabase-js');

// Cargar variables de entorno
require('dotenv').config();

// Configurar cliente de Supabase
const supabaseUrl = process.env.SUPABASE_URL || 'https://aynmblthitrfqcfvclot.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF5bm1ibHRoaXRyZnFjZnZjbG90Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDIxMjc2OCwiZXhwIjoyMDg1Nzg4NzY4fQ.x37WqDmMivdRMfsXNK4RNYHy_t_NNYRTMUaERbS46EA';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkWebhookStatus() {
  console.log("=== VERIFICACIÓN DEL ESTADO DE WEBHOOK Y TRANSACCIONES ===\n");
  
  try {
    // 1. Verificar todas las transacciones en la base de datos
    console.log("1. OBTENIENDO TODAS LAS TRANSACCIONES...");
    const { data: transactions, error: transError } = await supabase
      .from('transactions')
      .select('*')
      .order('created_at', { ascending: false });

    if (transError) {
      console.error("Error obteniendo transacciones:", transError);
      return;
    }

    console.log(`Encontradas ${transactions.length} transacciones:`);
    transactions.forEach((trans, index) => {
      console.log(`  ${index + 1}. ID: ${trans.id}`);
      console.log(`     Usuario: ${trans.user_id}`);
      console.log(`     Anuncio: ${trans.related_ad_id}`);
      console.log(`     Monto: ${trans.amount}`);
      console.log(`     Comisión: ${trans.commission_amount}`);
      console.log(`     Estado: ${trans.status}`);
      console.log(`     Fecha: ${trans.created_at}`);
      console.log(`     Stripe ID: ${trans.stripe_transaction_id}`);
      console.log('---');
    });

    // 2. Verificar anuncios activos
    console.log("\n2. OBTENIENDO ANUNCIOS ACTIVOS...");
    const { data: ads, error: adsError } = await supabase
      .from('ads')
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    if (adsError) {
      console.error("Error obteniendo anuncios:", adsError);
      return;
    }

    console.log(`Encontrados ${ads.length} anuncios activos:`);
    ads.forEach((ad, index) => {
      console.log(`  ${index + 1}. ID: ${ad.id}`);
      console.log(`     Ruta: ${ad.route_from} → ${ad.route_to}`);
      console.log(`     Precio: ${ad.price}€`);
      console.log(`     País: ${ad.country_from} → ${ad.country_to}`);
      console.log(`     Fecha: ${ad.start_date} → ${ad.end_date}`);
      console.log('---');
    });

    // 3. Verificar si hay transacciones completadas para cada anuncio
    console.log("\n3. ANALIZANDO DISPONIBILIDAD DE ANUNCIOS:");
    for (const ad of ads) {
      const relatedTransactions = transactions.filter(t => t.related_ad_id === ad.id);
      const completedTransactions = relatedTransactions.filter(t => t.status === 'completed');
      
      console.log(`\n  Anuncio ${ad.id} (${ad.route_from} → ${ad.route_to}):`);
      console.log(`    Total transacciones: ${relatedTransactions.length}`);
      console.log(`    Transacciones completadas: ${completedTransactions.length}`);
      console.log(`    Disponible: ${completedTransactions.length === 0 ? 'SÍ' : 'NO'}`);
      
      if (completedTransactions.length > 0) {
        console.log(`    Usuarios que contrataron: ${[...new Set(completedTransactions.map(t => t.user_id))].join(', ')}`);
      }
    }

    // 4. Verificar posibles problemas con el webhook
    console.log("\n4. POSIBLES PROBLEMAS CON EL WEBHOOK:");
    
    // Buscar transacciones con estado 'pending' que podrían indicar que el webhook no se completó
    const pendingTransactions = transactions.filter(t => t.status === 'pending');
    console.log(`  Transacciones pendientes: ${pendingTransactions.length}`);
    
    if (pendingTransactions.length > 0) {
      console.log("  Transacciones pendientes (posiblemente el webhook no se completó):");
      pendingTransactions.forEach(trans => {
        console.log(`    - Anuncio: ${trans.related_ad_id}, Usuario: ${trans.user_id}, Fecha: ${trans.created_at}`);
      });
    }

    // 5. Información del servidor
    console.log("\n5. INFORMACIÓN ADICIONAL:");
    console.log("  URL del webhook: http://13.51.166.237:3000/webhook");
    console.log("  Método: POST con body raw application/json");
    console.log("  Clave de webhook: Configurada en STRIPE_WEBHOOK_SECRET");
    
    // 6. Verificar si hay alguna transacción que coincida con el anuncio problemático mencionado anteriormente
    console.log("\n6. BÚSQUEDA DE ANUNCIOS ESPECÍFICOS:");
    const problematicAdIds = ['980dba1d-d385-4b22-8529-5c84b5c16167', '5b95aecb-7cf5-4542-be82-83cb362f9cd3']; // IDs mencionados anteriormente
    
    for (const adId of problematicAdIds) {
      const adTransactions = transactions.filter(t => t.related_ad_id === adId);
      console.log(`  Anuncio ${adId}:`);
      console.log(`    Tiene ${adTransactions.length} transacciones`);
      adTransactions.forEach(t => {
        console.log(`      - Estado: ${t.status}, Fecha: ${t.created_at}`);
      });
    }

  } catch (error) {
    console.error("Error general:", error);
  }
}

// Ejecutar la verificación
checkWebhookStatus()
  .then(() => {
    console.log("\nVerificación completada.");
    process.exit(0);
  })
  .catch(error => {
    console.error("Error al ejecutar la verificación:", error);
    process.exit(1);
  });
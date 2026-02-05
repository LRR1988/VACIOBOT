const { createClient } = require('@supabase/supabase-js');

// Cargar variables de entorno
require('dotenv').config();

// Configurar cliente de Supabase
const supabaseUrl = process.env.SUPABASE_URL || 'https://aynmblthitrfqcfvclot.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF5bm1ibHRoaXRyZnFjZnZjbG90Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDIxMjc2OCwiZXhwIjoyMDg1Nzg4NzY4fQ.x37WqDmMivdRMfsXNK4RNYHy_t_NNYRTMUaERbS46EA';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkAdAvailability() {
  console.log("=== VERIFICACIÓN DE DISPONIBILIDAD DE ANUNCIOS ===\n");
  
  try {
    // Obtener todos los anuncios activos
    console.log("1. Obteniendo anuncios activos...");
    const { data: ads, error: adsError } = await supabase
      .from('ads')
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    if (adsError) {
      console.error("Error obteniendo anuncios:", adsError);
      return;
    }

    console.log(`Encontrados ${ads.length} anuncios activos\n`);

    // Obtener todas las transacciones completadas
    console.log("2. Obteniendo transacciones completadas...");
    const { data: transactions, error: transactionsError } = await supabase
      .from('transactions')
      .select('*')
      .eq('status', 'completed');

    if (transactionsError) {
      console.error("Error obteniendo transacciones:", transactionsError);
      return;
    }

    console.log(`Encontradas ${transactions.length} transacciones completadas\n`);

    // Analizar disponibilidad de anuncios
    console.log("3. Analizando disponibilidad de anuncios...\n");
    
    for (const ad of ads) {
      const relatedTransactions = transactions.filter(t => t.related_ad_id === ad.id);
      const isAvailable = relatedTransactions.length === 0;
      
      console.log(`Anuncio ID: ${ad.id}`);
      console.log(`  Ruta: ${ad.route_from} → ${ad.route_to}`);
      console.log(`  País: ${ad.country_from} → ${ad.country_to}`);
      console.log(`  Precio: ${ad.price}€`);
      console.log(`  Fecha inicio: ${ad.start_date}`);
      console.log(`  Fecha fin: ${ad.end_date}`);
      console.log(`  Contratado: ${relatedTransactions.length > 0 ? 'SÍ' : 'NO'}`);
      console.log(`  Transacciones relacionadas: ${relatedTransactions.length}`);
      if (relatedTransactions.length > 0) {
        console.log(`  Usuarios que contrataron: ${[...new Set(relatedTransactions.map(t => t.user_id))].join(', ')}`);
      }
      console.log(`  Disponible: ${isAvailable ? 'SÍ' : 'NO'}`);
      console.log('---');
    }

    // Análisis estadístico
    console.log("\n4. RESUMEN ESTADÍSTICO:");
    const availableAds = ads.filter(ad => {
      const relatedTransactions = transactions.filter(t => t.related_ad_id === ad.id);
      return relatedTransactions.length === 0;
    });
    
    const unavailableAds = ads.filter(ad => {
      const relatedTransactions = transactions.filter(t => t.related_ad_id === ad.id);
      return relatedTransactions.length > 0;
    });
    
    console.log(`Total anuncios: ${ads.length}`);
    console.log(`Anuncios disponibles: ${availableAds.length}`);
    console.log(`Anuncios no disponibles: ${unavailableAds.length}`);
    
    if (unavailableAds.length > 0) {
      console.log("\nAnuncios NO disponibles:");
      unavailableAds.forEach(ad => {
        console.log(`  - ${ad.route_from} → ${ad.route_to} (ID: ${ad.id})`);
      });
    }
    
  } catch (error) {
    console.error("Error general:", error);
  }
}

// Ejecutar la verificación
checkAdAvailability()
  .then(() => {
    console.log("\nVerificación completada.");
    process.exit(0);
  })
  .catch(error => {
    console.error("Error al ejecutar la verificación:", error);
    process.exit(1);
  });
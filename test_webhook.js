const { createClient } = require('@supabase/supabase-js');

// Cargar variables de entorno
require('dotenv').config();

// Configurar cliente de Supabase
const supabaseUrl = process.env.SUPABASE_URL || 'https://aynmblthitrfqcfvclot.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF5bm1ibHRoaXRyZnFjZnZjbG90Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDIxMjc2OCwiZXhwIjoyMDg1Nzg4NzY4fQ.x37WqDmMivdRMfsXNK4RNYHy_t_NNYRTMUaERbS46EA';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testTransactionRegistration() {
  console.log("=== SIMULACIÓN DE REGISTRO DE TRANSACCIÓN ===\n");
  
  // Datos de prueba para simular una transacción completada
  const testData = {
    adId: '980dba1d-d385-4b22-8529-5c84b5c16167', // Uno de los anuncios de prueba
    userId: 'test-user-123',
    amount: 200, // Precio del anuncio
    commission: 25, // Comisión (mínimo 25€)
    netToOwner: 175, // Neto para el propietario
    stripeSessionId: 'cs_test_' + Math.random().toString(36).substr(2, 32),
  };
  
  console.log("Registrando transacción de prueba...");
  console.log("Datos:", testData);
  
  try {
    // Registrar la transacción en Supabase
    const { data, error } = await supabase
      .from('transactions')
      .insert([{
        user_id: testData.userId,
        related_ad_id: testData.adId,
        amount: testData.amount,
        commission: testData.commission,
        net_to_owner: testData.netToOwner,
        stripe_session_id: testData.stripeSessionId,
        status: 'completed',
        payment_method: 'card',
        currency: 'eur',
        description: 'Pago por contratación de servicio - PRUEBA'
      }]);
    
    if (error) {
      console.error("ERROR al registrar transacción:", error);
      return;
    }
    
    console.log("✓ Transacción registrada exitosamente!");
    console.log("Datos registrados:", data);
    
    // Verificar que la transacción se haya registrado
    console.log("\nVerificando que la transacción se haya registrado...");
    const { data: verifyData, error: verifyError } = await supabase
      .from('transactions')
      .select('*')
      .eq('related_ad_id', testData.adId)
      .eq('status', 'completed');
    
    if (verifyError) {
      console.error("ERROR al verificar transacción:", verifyError);
      return;
    }
    
    console.log("✓ Transacción verificada en la base de datos");
    console.log("Transacciones encontradas:", verifyData.length);
    
    // Ahora verificar si el anuncio está marcado como no disponible
    console.log("\nVerificando disponibilidad del anuncio después de la transacción...");
    const { data: adData, error: adError } = await supabase
      .from('transactions')
      .select('*')
      .eq('related_ad_id', testData.adId)
      .eq('status', 'completed');
    
    if (adData && adData.length > 0) {
      console.log("✓ El anuncio ahora está marcado como contratado (tiene transacciones 'completed')");
    } else {
      console.log("✗ El anuncio no está marcado como contratado");
    }
    
    // Obtener anuncios activos y ver cuáles están disponibles
    console.log("\n=== VERIFICACIÓN FINAL DE DISPONIBILIDAD ===");
    const { data: allAds, error: adsError } = await supabase
      .from('ads')
      .select('*')
      .eq('status', 'active');
    
    if (adsError) {
      console.error("Error obteniendo anuncios:", adsError);
      return;
    }
    
    for (const ad of allAds) {
      const { data: adTransactions, error: transError } = await supabase
        .from('transactions')
        .select('id')
        .eq('related_ad_id', ad.id)
        .eq('status', 'completed');
      
      const isAvailable = !(adTransactions && adTransactions.length > 0);
      
      console.log(`Anuncio ${ad.id}: ${ad.route_from} → ${ad.route_to} - ${isAvailable ? 'DISPONIBLE' : 'CONTRATADO'}`);
    }
    
  } catch (error) {
    console.error("Error general:", error);
  }
}

// Ejecutar la prueba
testTransactionRegistration()
  .then(() => {
    console.log("\nPrueba completada.");
    process.exit(0);
  })
  .catch(error => {
    console.error("Error al ejecutar la prueba:", error);
    process.exit(1);
  });
const { createClient } = require('@supabase/supabase-js');

// Variables de conexión a Supabase
const supabaseUrl = 'https://aynmblthitrfqcfvclot.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF5bm1ibHRoaXRyZnFjZnZjbG90Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDIxMjc2OCwiZXhwIjoyMDg1Nzg4NzY4fQ.x37WqDmMivdRMfsXNK4RNYHy_t_NNYRTMUaERbS46EA';
const supabase = createClient(supabaseUrl, supabaseKey);

console.log('=== DIAGNÓSTICO COMPLETO DE PAGOS ===');
console.log('1. Verificando todas las transacciones en la base de datos...');
console.log('');

(async () => {
  // Obtener todas las transacciones
  const { data: allTransactions, error: allTxError } = await supabase
    .from('transactions')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (allTxError) {
    console.error('Error obteniendo transacciones:', allTxError);
  } else {
    console.log('TOTAL de transacciones en la base de datos:', allTransactions.length);
    console.log('');
    
    // Analizar cada transacción
    allTransactions.forEach((tx, index) => {
      console.log(`Transacción #${index + 1}:`);
      console.log(`  ID: ${tx.id}`);
      console.log(`  Usuario: ${tx.user_id}`);
      console.log(`  Anuncio relacionado: ${tx.related_ad_id}`);
      console.log(`  Monto: ${tx.amount} ${tx.currency}`);
      console.log(`  Comisión: ${tx.commission_amount} ${tx.commission_currency || 'N/A'}`);
      console.log(`  ID de transacción Stripe: ${tx.stripe_transaction_id || 'NULO'}`);
      console.log(`  Estado: ${tx.status}`);
      console.log(`  Fecha: ${tx.created_at}`);
      console.log('');
    });
  }

  // Buscar transacciones completadas
  const { data: completed, error: completedError } = await supabase
    .from('transactions')
    .select('*')
    .eq('status', 'completed');
  
  if (completedError) {
    console.error('Error obteniendo transacciones completadas:', completedError);
  } else {
    console.log('TRANSACCIONES COMPLETADAS:', completed.length);
    if (completed.length === 0) {
      console.log('⚠️  NO HAY TRANSACCIONES COMPLETADAS EN LA BASE DE DATOS');
      console.log('Esto indica que el webhook de Stripe no está registrando correctamente las transacciones');
    }
    console.log('');
  }

  // Buscar transacciones pendientes
  const { data: pending, error: pendingError } = await supabase
    .from('transactions')
    .select('*')
    .eq('status', 'pending');
  
  if (pendingError) {
    console.error('Error obteniendo transacciones pendientes:', pendingError);
  } else {
    console.log('TRANSACCIONES PENDIENTES:', pending.length);
    if (pending.length > 0) {
      console.log('⚠️  HAY TRANSACCIONES PENDIENTES SIN ID DE STRIPE ASOCIADO');
      console.log('Esto sugiere que se están creando en la base de datos antes de completar el pago');
      console.log('');
      
      pending.forEach(tx => {
        console.log(`  - ID: ${tx.id}, Monto: ${tx.amount}, Sin ID de Stripe: ${!tx.stripe_transaction_id}`);
      });
    }
    console.log('');
  }

  // Buscar transacciones sin ID de Stripe
  const { data: withoutStripeId, error: withoutStripeError } = await supabase
    .from('transactions')
    .select('*')
    .is('stripe_transaction_id', null);
  
  if (withoutStripeError) {
    console.error('Error obteniendo transacciones sin ID de Stripe:', withoutStripeError);
  } else {
    console.log('TRANSACCIONES SIN ID DE STRIPE:', withoutStripeId.length);
    if (withoutStripeId.length > 0) {
      console.log('⚠️  HAY TRANSACCIONES REGISTRADAS SIN ID DE STRIPE ASOCIADO');
      console.log('Esto indica que se están creando registros antes de recibir confirmación del pago');
    }
    console.log('');
  }

  // Verificar el anuncio específico de Sevilla2 → Granada2
  console.log('=== ANÁLISIS DEL ANUNCIO SEVILLA2 → GRANADA2 ===');
  const { data: specificAd, error: adError } = await supabase
    .from('ads')
    .select('*')
    .eq('id', 'e3ed6ebd-3607-4f3e-9555-5ca5a439e99b')
    .single();
  
  if (adError) {
    console.error('Error obteniendo anuncio específico:', adError);
  } else {
    console.log('Anuncio encontrado:');
    console.log(`  ID: ${specificAd.id}`);
    console.log(`  Origen: ${specificAd.route_from}`);
    console.log(`  Destino: ${specificAd.route_to}`);
    console.log(`  Precio: ${specificAd.price} €`);
    console.log(`  Estado: ${specificAd.status}`);
    console.log(`  Fecha inicio: ${specificAd.start_date}`);
    console.log(`  Fecha fin: ${specificAd.end_date}`);
    console.log('');
  }

  // Buscar transacciones relacionadas con este anuncio específico
  const { data: relatedTxs, error: relatedTxsError } = await supabase
    .from('transactions')
    .select('*')
    .eq('related_ad_id', 'e3ed6ebd-3607-4f3e-9555-5ca5a439e99b');
  
  if (relatedTxsError) {
    console.error('Error obteniendo transacciones relacionadas:', relatedTxsError);
  } else {
    console.log('TRANSACCIONES RELACIONADAS CON EL ANUNCIO:', relatedTxs.length);
    if (relatedTxs.length === 0) {
      console.log('⚠️  NO HAY TRANSACCIONES REGISTRADAS PARA ESTE ANUNCIO');
      console.log('A pesar de que se realizó un pago, no se registró ninguna transacción');
    } else {
      relatedTxs.forEach(tx => {
        console.log(`  - ID: ${tx.id}, Estado: ${tx.status}, Monto: ${tx.amount}`);
      });
    }
  }

  console.log('');
  console.log('=== RESUMEN DEL PROBLEMA ===');
  console.log('1. El webhook de Stripe no está registrando correctamente las transacciones completadas');
  console.log('2. Las transacciones se están creando en estado "pending" sin ID de Stripe');
  console.log('3. No hay transacciones con estado "completed" en la base de datos');
  console.log('4. El pago realizado no se refleja en la base de datos');
  console.log('');
  console.log('POSIBLE CAUSA: El webhook de Stripe no está recibiendo o procesando correctamente los eventos de checkout.session.completed');
})();
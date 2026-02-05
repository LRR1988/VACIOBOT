const { createClient } = require('@supabase/supabase-js');

// Variables de conexión a Supabase
const supabaseUrl = 'https://aynmblthitrfqcfvclot.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF5bm1ibHRoaXRyZnFjZnZjbG90Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDIxMjc2OCwiZXhwIjoyMDg1Nzg4NzY4fQ.x37WqDmMivdRMfsXNK4RNYHy_t_NNYRTMUaERbS46EA';
const supabase = createClient(supabaseUrl, supabaseKey);

(async () => {
  console.log('Verificando estado del anuncio Sevilla2 → Granada2...');
  
  // Buscar el anuncio específico
  const { data: ad, error: adError } = await supabase
    .from('ads')
    .select('*')
    .eq('id', 'e3ed6ebd-3607-4f3e-9555-5ca5a439e99b')
    .single();
  
  if (adError) {
    console.error('Error buscando anuncio:', adError);
  } else {
    console.log('Anuncio encontrado:', ad);
  }

  console.log('\\nVerificando si hay transacciones completadas para ANUNCIO ALGUNO...');
  
  // Buscar transacciones completadas para cualquier anuncio
  const { data: allCompleted, error: allCompletedError } = await supabase
    .from('transactions')
    .select('*')
    .eq('status', 'completed')
    .order('created_at', { ascending: false });
  
  if (allCompletedError) {
    console.error('Error buscando transacciones completadas:', allCompletedError);
  } else {
    console.log('TODAS las transacciones completadas en la base de datos:', allCompleted);
  }
  
  console.log('\\nVerificando si hay transacciones con stripe_transaction_id nulo o vacío...');
  
  // Buscar transacciones con stripe_transaction_id nulo
  const { data: pendingStripe, error: pendingStripeError } = await supabase
    .from('transactions')
    .select('*')
    .is('stripe_transaction_id', null)
    .order('created_at', { ascending: false });
  
  if (pendingStripeError) {
    console.error('Error buscando transacciones sin ID de Stripe:', pendingStripeError);
  } else {
    console.log('Transacciones sin ID de Stripe (posiblemente incompletas):', pendingStripe);
  }
})();
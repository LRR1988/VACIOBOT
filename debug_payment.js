const { createClient } = require('@supabase/supabase-js');

// Variables de conexión a Supabase
const supabaseUrl = 'https://aynmblthitrfqcfvclot.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF5bm1ibHRoaXRyZnFjZnZjbG90Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDIxMjc2OCwiZXhwIjoyMDg1Nzg4NzY4fQ.x37WqDmMivdRMfsXNK4RNYHy_t_NNYRTMUaERbS46EA';
const supabase = createClient(supabaseUrl, supabaseKey);

(async () => {
  console.log('Buscando transacciones para el anuncio Sevilla2 → Granada2 (ID: e3ed6ebd-3607-4f3e-9555-5ca5a439e99b)...');
  
  // Buscar transacciones relacionadas con el anuncio específico
  const { data: transactions, error: txError } = await supabase
    .from('transactions')
    .select('*')
    .eq('related_ad_id', 'e3ed6ebd-3607-4f3e-9555-5ca5a439e99b')
    .order('created_at', { ascending: false });
  
  if (txError) {
    console.error('Error buscando transacciones:', txError);
  } else {
    console.log('Transacciones encontradas para el anuncio Sevilla2 → Granada2:', transactions);
  }

  console.log('\\nBuscando transacciones para el usuario (ID: d351f18b-c409-43eb-9071-cee2cc81118b)...');
  
  // Buscar transacciones del usuario específico
  const { data: userTransactions, error: userTxError } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', 'd351f18b-c409-43eb-9071-cee2cc81118b')
    .order('created_at', { ascending: false })
    .limit(10);
  
  if (userTxError) {
    console.error('Error buscando transacciones del usuario:', userTxError);
  } else {
    console.log('Transacciones del usuario:', userTransactions);
  }
  
  // También verificar si hay transacciones con estado 'completed' recientes
  console.log('\\nBuscando transacciones completadas recientes...');
  const { data: completedTransactions, error: completedTxError } = await supabase
    .from('transactions')
    .select('*')
    .eq('status', 'completed')
    .order('created_at', { ascending: false })
    .limit(10);
  
  if (completedTxError) {
    console.error('Error buscando transacciones completadas:', completedTxError);
  } else {
    console.log('Transacciones completadas recientes:', completedTransactions);
  }
})();
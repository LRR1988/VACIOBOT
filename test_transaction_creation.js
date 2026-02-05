const { createClient } = require('@supabase/supabase-js');

// Variables de conexión a Supabase
const supabaseUrl = 'https://aynmblthitrfqcfvclot.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF5bm1ibHRoaXRyZnFjZnZjbG90Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDIxMjc2OCwiZXhwIjoyMDg1Nzg4NzY4fQ.x37WqDmMivdRMfsXNK4RNYHy_t_NNYRTMUaERbS46EA';
const supabase = createClient(supabaseUrl, supabaseKey);

(async () => {
  try {
    console.log('Probando inserción manual de transacción...');
    
    // Datos de ejemplo para probar
    const testTransaction = {
      user_id: 'd351f18b-c409-43eb-9071-cee2cc81118b', // ID de usuario de prueba
      related_ad_id: '980dba1d-d385-4b22-8529-5c84b5c16167', // ID del anuncio mencionado
      amount: 200,
      commission: 10,
      net_to_owner: 190,
      stripe_session_id: 'cs_test_example123',
      status: 'completed',
      payment_method: 'card',
      currency: 'eur',
      description: 'Pago por contratación de servicio'
    };
    
    const { data, error } = await supabase
      .from('transactions')
      .insert([testTransaction])
      .select()
      .single();
    
    if (error) {
      console.error('Error insertando transacción de prueba:', error);
    } else {
      console.log('Transacción de prueba insertada exitosamente:', data);
    }
    
    // Luego verificar si podemos encontrar la transacción
    console.log('\nVerificando si la transacción se puede encontrar...');
    const { data: found, error: findError } = await supabase
      .from('transactions')
      .select('id')
      .eq('user_id', 'd351f18b-c409-43eb-9071-cee2cc81118b')
      .eq('related_ad_id', '980dba1d-d385-4b22-8529-5c84b5c16167');
    
    if (findError) {
      console.error('Error buscando transacción:', findError);
    } else {
      console.log('Resultados de búsqueda:', found);
      console.log('¿La transacción existe?', found && found.length > 0);
    }
  } catch (err) {
    console.error('Error general:', err);
  }
})();
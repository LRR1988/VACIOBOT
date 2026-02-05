const { createClient } = require('@supabase/supabase-js');

// Variables de conexión a Supabase
const supabaseUrl = 'https://aynmblthitrfqcfvclot.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF5bm1ibHRoaXRyZnFjZnZjbG90Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDIxMjc2OCwiZXhwIjoyMDg1Nzg4NzY4fQ.x37WqDmMivdRMfsXNK4RNYHy_t_NNYRTMUaERbS46EA';
const supabase = createClient(supabaseUrl, supabaseKey);

(async () => {
  try {
    console.log('Creando una transacción para probar la funcionalidad de contratación...');
    
    // Transacción para el anuncio específico mencionado por el usuario
    const testTransaction = {
      user_id: 'd351f18b-c409-43eb-9071-cee2cc81118b', // Usuario que contrató el servicio
      related_ad_id: '980dba1d-d385-4b22-8529-5c84b5c16167', // Anuncio Barcelona-Madrid mencionado por el usuario
      amount: 200, // Precio del anuncio
      commission: 10, // Comisión (5% de 200)
      net_to_owner: 190, // Monto neto para el propietario
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
      console.error('Error creando transacción de prueba:', error);
    } else {
      console.log('Transacción de prueba creada exitosamente:', data);
    }
    
    // Ahora verificar si la función hasUserHiredAd detectaría esta transacción
    console.log('\nVerificando si la contratación se detecta correctamente...');
    const { data: found, error: findError } = await supabase
      .from('transactions')
      .select('id')
      .eq('user_id', 'd351f18b-c409-43eb-9071-cee2cc81118b')
      .eq('related_ad_id', '980dba1d-d385-4b22-8529-5c84b5c16167');
    
    if (findError) {
      console.error('Error en la verificación:', findError);
    } else {
      console.log('Resultado de verificación:', found);
      console.log('¿Usuario ya contrató este anuncio?', found && found.length > 0);
    }
  } catch (err) {
    console.error('Error general:', err);
  }
})();
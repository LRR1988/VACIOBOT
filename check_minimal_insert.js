const { createClient } = require('@supabase/supabase-js');

// Variables de conexión a Supabase
const supabaseUrl = 'https://aynmblthitrfqcfvclot.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF5bm1ibHRoaXRyZnFjZnZjbG90Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDIxMjc2OCwiZXhwIjoyMDg1Nzg4NzY4fQ.x37WqDmMivdRMfsXNK4RNYHy_t_NNYRTMUaERbS46EA';
const supabase = createClient(supabaseUrl, supabaseKey);

(async () => {
  try {
    console.log('Probando inserción con las columnas requeridas...');
    
    // Intentar insertar con las columnas mínimas requeridas
    const minimalTransaction = {
      user_id: 'd351f18b-c409-43eb-9071-cee2cc81118b',
      related_ad_id: '980dba1d-d385-4b22-8529-5c84b5c16167',
      amount: 100
    };
    
    const { data, error } = await supabase
      .from('transactions')
      .insert([minimalTransaction])
      .select('id')
      .single();
    
    if (error) {
      console.log("Error con columnas mínimas requeridas:", error.message);
      
      // Intentar con más columnas para ver cuáles son requeridas
      const moreCompleteTransaction = {
        user_id: 'd351f18b-c409-43eb-9071-cee2cc81118b',
        related_ad_id: '980dba1d-d385-4b22-8529-5c84b5c16167',
        amount: 100,
        commission: 5,
        net_to_owner: 95
      };
      
      const { data: moreData, error: moreError } = await supabase
        .from('transactions')
        .insert([moreCompleteTransaction])
        .select('id')
        .single();
      
      if (moreError) {
        console.log("Error con más columnas:", moreError.message);
        
        // Intentar con todas las columnas posibles
        const fullTransaction = {
          user_id: 'd351f18b-c409-43eb-9071-cee2cc81118b',
          related_ad_id: '980dba1d-d385-4b22-8529-5c84b5c16167',
          amount: 200,
          commission: 10,
          net_to_owner: 190,
          status: 'pending',
          payment_method: 'card',
          currency: 'eur',
          description: 'Pago por contratación de servicio'
        };
        
        const { data: fullData, error: fullError } = await supabase
          .from('transactions')
          .insert([fullTransaction])
          .select('id')
          .single();
        
        if (fullError) {
          console.log("Error con transacción completa:", fullError.message);
        } else {
          console.log("Transacción completa exitosa:", fullData);
        }
      } else {
        console.log("Transacción con más columnas exitosa:", moreData);
      }
    } else {
      console.log("Inserción mínima exitosa:", data);
    }
  } catch (err) {
    console.error('Error general:', err);
  }
})();
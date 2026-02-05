const { createClient } = require('@supabase/supabase-js');

// Variables de conexión a Supabase
const supabaseUrl = 'https://aynmblthitrfqcfvclot.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF5bm1ibHRoaXRyZnFjZnZjbG90Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDIxMjc2OCwiZXhwIjoyMDg1Nzg4NzY4fQ.x37WqDmMivdRMfsXNK4RNYHy_t_NNYRTMUaERbS46EA';
const supabase = createClient(supabaseUrl, supabaseKey);

(async () => {
  try {
    console.log('Obteniendo estructura de la tabla transactions...');
    
    // Intentar obtener información sobre la tabla
    const { data, error } = await supabase
      .from('transactions')
      .select('*, id')
      .limit(0); // Solo queremos la estructura, no datos
    
    if (error) {
      console.log('Error al obtener la estructura (esto es normal si la tabla está vacía):', error);
      
      // Intentar una consulta diferente para obtener metadatos
      console.log('\nIntentando obtener información sobre las columnas...');
      const { data: columns, error: columnsError } = await supabase.rpc('information_schema.columns', {
        table_name: 'transactions'
      });
      
      if (columnsError) {
        console.log('Error al obtener columnas:', columnsError);
        
        // Como alternativa, vamos a intentar insertar con solo las columnas básicas que normalmente existen
        console.log('\nProbando con columnas mínimas...');
        const minimalTransaction = {
          user_id: 'd351f18b-c409-43eb-9071-cee2cc81118b',
          related_ad_id: '980dba1d-d385-4b22-8529-5c84b5c16167'
        };
        
        const { data: insertData, error: insertError } = await supabase
          .from('transactions')
          .insert([minimalTransaction])
          .select()
          .single();
        
        if (insertError) {
          console.log('Error con inserción mínima:', insertError);
          
          // Intentar con solo las columnas requeridas que existen
          console.log('\nIntentando con una inserción aún más simple...');
          const simpleTransaction = {
            user_id: 'd351f18b-c409-43eb-9071-cee2cc81118b'
          };
          
          const { data: simpleData, error: simpleError } = await supabase
            .from('transactions')
            .insert([simpleTransaction])
            .select()
            .single();
          
          if (simpleError) {
            console.log('Error con inserción simple:', simpleError);
            
            // Si todo falla, solo vamos a hacer una selección básica
            console.log('\nHaciendo una selección básica para ver qué columnas existen...');
            try {
              const { error: selectError } = await supabase.from('transactions').select('id').limit(1);
              if (selectError) {
                console.log('Error en selección de id:', selectError);
              } else {
                console.log('La columna id existe');
              }
            } catch (e) {
              console.log('Error en selección:', e);
            }
          } else {
            console.log('Inserción simple exitosa:', simpleData);
          }
        } else {
          console.log('Inserción mínima exitosa:', insertData);
        }
      } else {
        console.log('Columnas encontradas:', columns);
      }
    } else {
      console.log('Datos obtenidos:', data);
    }
  } catch (err) {
    console.error('Error general:', err);
  }
})();
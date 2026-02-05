const { createClient } = require('@supabase/supabase-js');

// Variables de conexión a Supabase
const supabaseUrl = 'https://aynmblthitrfqcfvclot.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF5bm1ibHRoaXRyZnFjZnZjbG90Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDIxMjc2OCwiZXhwIjoyMDg1Nzg4NzY4fQ.x37WqDmMivdRMfsXNK4RNYHy_t_NNYRTMUaERbS46EA';
const supabase = createClient(supabaseUrl, supabaseKey);

(async () => {
  try {
    console.log('Buscando transacciones recientes...');
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);
    
    if (error) {
      console.error('Error:', error);
    } else {
      console.log('Transacciones encontradas:', data);
      console.log('Número total de transacciones:', data.length);
    }
    
    console.log('\nBuscando anuncios activos...');
    const { data: ads, error: adsError } = await supabase
      .from('ads')
      .select('*')
      .eq('route_to', 'MADRID')
      .limit(5);
    
    if (adsError) {
      console.error('Error buscando anuncios:', adsError);
    } else {
      console.log('Anuncios encontrados con destino MADRID:', ads);
    }
    
    console.log('\nBuscando transacciones para anuncios específicos...');
    for(const ad of ads || []) {
      const { data: adTransactions, error: txError } = await supabase
        .from('transactions')
        .select('*')
        .eq('related_ad_id', ad.id);
      
      if (txError) {
        console.error('Error buscando transacciones para anuncio:', ad.id, txError);
      } else {
        console.log(`Transacciones para anuncio ${ad.id}:`, adTransactions);
      }
    }
  } catch (err) {
    console.error('Error general:', err);
  }
})();
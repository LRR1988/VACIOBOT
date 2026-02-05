const { createClient } = require('@supabase/supabase-js');

// Cargar variables de entorno
require('dotenv').config();

// Configurar cliente de Supabase
const supabaseUrl = process.env.SUPABASE_URL || 'https://aynmblthitrfqcfvclot.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF5bm1ibHRoaXRyZnFjZnZjbG90Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDIxMjc2OCwiZXhwIjoyMDg1Nzg4NzY4fQ.x37WqDmMivdRMfsXNK4RNYHy_t_NNYRTMUaERbS46EA';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkTableColumns() {
  console.log("=== VERIFICACIÓN DE COLUMNAS EN SUPABASE ===\n");
  
  try {
    // Consultar directamente el esquema de información de PostgreSQL
    const { data, error } = await supabase.rpc('get_table_info', {
      table_name: 'transactions'
    });
    
    if (error) {
      console.log("Error usando RPC (posiblemente no existe):", error.message);
      
      // Intentar con una consulta directa a la información del esquema
      console.log("\nConsultando información del esquema...");
      
      // Vamos a usar una consulta SQL directa a través de Supabase
      const query = `
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns 
        WHERE table_name = 'transactions'
        ORDER BY ordinal_position;
      `;
      
      // Supabase no soporta consultas SQL arbitrarias directamente
      // Vamos a probar con una tabla conocida para ver si funciona
      console.log("Probando con tabla 'ads'...");
      const { data: adsData, error: adsError } = await supabase
        .from('ads')
        .select('id, route_from, route_to, price, status')
        .limit(1);
        
      if (adsError) {
        console.error("Error consultando tabla ads:", adsError);
      } else {
        console.log("Tabla 'ads' accesible. Ejemplo:", adsData[0]);
        
        // Ahora probar con la tabla transactions
        console.log("\nProbando con tabla 'transactions'...");
        const { data: transData, error: transError } = await supabase
          .from('transactions')
          .select('*')
          .limit(1);
          
        if (transError) {
          console.error("Error consultando tabla transactions:", transError);
        } else {
          console.log("Tabla 'transactions' accesible. Ejemplo:", transData[0]);
        }
      }
    }
    
  } catch (error) {
    console.error("Error general:", error);
  }
}

// Ejecutar la verificación
checkTableColumns()
  .then(() => {
    console.log("\nVerificación completada.");
    process.exit(0);
  })
  .catch(error => {
    console.error("Error al ejecutar la verificación:", error);
    process.exit(1);
  });
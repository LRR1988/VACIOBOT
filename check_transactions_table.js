const { createClient } = require('@supabase/supabase-js');

// Cargar variables de entorno
require('dotenv').config();

// Configurar cliente de Supabase
const supabaseUrl = process.env.SUPABASE_URL || 'https://aynmblthitrfqcfvclot.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF5bm1ibHRoaXRyZnFjZnZjbG90Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDIxMjc2OCwiZXhwIjoyMDg1Nzg4NzY4fQ.x37WqDmMivdRMfsXNK4RNYHy_t_NNYRTMUaERbS46EA';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkTransactionsTable() {
  console.log("=== VERIFICACIÓN DE LA ESTRUCTURA DE LA TABLA TRANSACTIONS ===\n");
  
  try {
    // Realizar una consulta vacía para obtener la estructura
    const { data, error, count, status, statusText } = await supabase
      .from('transactions')
      .select('*', { count: 'exact', head: true });

    if (error) {
      console.error("Error al consultar la tabla:", error);
      console.log("Detalle del error:", error.message, error.details, error.hint);
      return;
    }

    console.log("✓ Consulta HEAD exitosa");
    console.log("Total de registros:", count);
    
    // Ahora hacer una consulta real para obtener algunos datos
    const { data: sampleData, error: sampleError } = await supabase
      .from('transactions')
      .select('*')
      .limit(1);

    if (sampleError) {
      console.error("Error al obtener datos de muestra:", sampleError);
    } else if (sampleData && sampleData.length > 0) {
      console.log("\n✓ Datos de muestra obtenidos:");
      console.log("Estructura de ejemplo:", Object.keys(sampleData[0]));
      console.log("Campos disponibles:", Object.keys(sampleData[0]));
      console.log("\nContenido del primer registro:", JSON.stringify(sampleData[0], null, 2));
    } else {
      console.log("\n✓ Tabla existe pero está vacía o no hay registros coincidentes");
      console.log("No hay datos de muestra disponibles");
    }
  } catch (error) {
    console.error("Error general:", error);
  }
}

checkTransactionsTable()
  .then(() => {
    console.log("\nVerificación completada.");
    process.exit(0);
  })
  .catch(error => {
    console.error("Error:", error);
    process.exit(1);
  });
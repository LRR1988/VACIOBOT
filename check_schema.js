const { createClient } = require('@supabase/supabase-js');

// Cargar variables de entorno
require('dotenv').config();

// Configurar cliente de Supabase
const supabaseUrl = process.env.SUPABASE_URL || 'https://aynmblthitrfqcfvclot.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF5bm1ibHRoaXRyZnFjZnZjbG90Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDIxMjc2OCwiZXhwIjoyMDg1Nzg4NzY4fQ.x37WqDmMivdRMfsXNK4RNYHy_t_NNYRTMUaERbS46EA';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkTableSchema() {
  console.log("=== VERIFICACIÓN DE ESQUEMA DE TABLA TRANSACTIONS ===\n");
  
  try {
    // Intentar una consulta simple para ver la estructura
    const { data, error, count, status } = await supabase
      .from('transactions')
      .select('*')
      .limit(0); // Solo obtener la estructura, no los datos

    if (error) {
      console.error("Error obteniendo estructura de tabla:", error);
      
      // Intentar obtener información de la tabla de una manera diferente
      console.log("\nIntentando obtener información de columnas manualmente...");
      
      // Consultar la tabla de información de Postgres para ver las columnas
      const { data: columns, error: columnsError } = await supabase
        .from('information_schema.columns')
        .select('column_name, data_type, is_nullable')
        .eq('table_name', 'transactions')
        .order('ordinal_position');
      
      if (columnsError) {
        console.error("Error obteniendo información de columnas:", columnsError);
        console.log("Tabla transactions puede no existir o tener problemas de acceso");
      } else {
        console.log("Columnas en la tabla transactions:");
        columns.forEach(col => {
          console.log(`  - ${col.column_name}: ${col.data_type} (${col.is_nullable})`);
        });
      }
    } else {
      console.log("Consulta exitosa. Estructura de la tabla transactions:");
      if (data && data.length > 0) {
        console.log("Ejemplo de registro:", JSON.stringify(data[0], null, 2));
      }
    }
    
  } catch (error) {
    console.error("Error general:", error);
  }
}

// Ejecutar la verificación
checkTableSchema()
  .then(() => {
    console.log("\nVerificación completada.");
    process.exit(0);
  })
  .catch(error => {
    console.error("Error al ejecutar la verificación:", error);
    process.exit(1);
  });
/**
 * Script para corregir las restricciones de la base de datos de Supabase
 * Basado en el error: "null value in column 'end_date' of relation 'ads' violates not-null constraint"
 */

const { createClient } = require('@supabase/supabase-js');

// Configuración de Supabase (debe coincidir con supabaseClient.js)
const supabaseUrl = 'https://aynmblthitrfqcfvclot.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF5bm1ibHRoaXRyZnFjZnZjbG90Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAyMTI3NjgsImV4cCI6MjA4NTc4ODc2OH0.IdhGNNDVJdfAuSlCn9G4E_iiaUpoeZw1mNkUoYl3yFE';

// Usar la clave de servicio para tener permisos completos
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF5bm1ibHRoaXRyZnFjZnZjbG90Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDIxMjc2OCwiZXhwIjoyMDg1Nzg4NzY4fQ.x37WqDmMivdRMfsXNK4RNYHy_t_NNYRTMUaERbS46EA';

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function fixDatabaseConstraints() {
  console.log('🔧 Corrigiendo restricciones de la base de datos de Supabase...\n');
  
  try {
    // Consultar la estructura de la tabla 'ads' para ver las restricciones
    console.log('1. Verificando la estructura de la tabla ads...');
    
    // Vamos a intentar actualizar la tabla para hacer que ciertos campos acepten NULL
    // Primero, actualizar todos los registros existentes que tengan NULL en campos problemáticos
    
    // Alternativamente, hacer actualizaciones individuales
    console.log('2. Actualizando registros existentes...');
    
    // Obtener todos los anuncios con valores nulos en campos problemáticos
    const { data: adsToUpdate, error: selectError } = await supabase
      .from('ads')
      .select('id, end_date, bus_age, seats, start_time, end_time')
      .or('end_date.is.null,bus_age.is.null,seats.is.null,start_time.is.null,end_time.is.null');
    
    if (selectError) {
      console.log('No hay anuncios con valores nulos o error al consultar:', selectError.message);
    } else if (adsToUpdate && adsToUpdate.length > 0) {
      console.log(`Encontrados ${adsToUpdate.length} anuncios con valores nulos, actualizando...`);
      
      for (const ad of adsToUpdate) {
        const updateData = {};
        
        if (ad.end_date === null) updateData.end_date = ad.start_date; // Igual al start_date o dejar como null
        if (ad.bus_age === null) updateData.bus_age = 0;
        if (ad.seats === null) updateData.seats = 0;
        if (ad.start_time === null) updateData.start_time = '';
        if (ad.end_time === null) updateData.end_time = '';
        
        const { error: updateAdError } = await supabase
          .from('ads')
          .update(updateData)
          .eq('id', ad.id);
          
        if (updateAdError) {
          console.error(`Error actualizando anuncio ${ad.id}:`, updateAdError.message);
        }
      }
      
      console.log('✅ Anuncios actualizados');
    } else {
      console.log('✅ No hay anuncios con valores nulos que necesiten actualización');
    }
    
    console.log('\n3. Verificando algunos anuncios para confirmar estado actual...');
    
    // Obtener algunos anuncios para ver su estado actual
    const { data: sampleAds, error: sampleError } = await supabase
      .from('ads')
      .select(`
        id, 
        route_from, 
        route_to, 
        status, 
        country_from, 
        country_to,
        start_date,
        end_date,
        bus_age,
        seats,
        start_time,
        end_time
      `)
      .order('created_at', { ascending: false })
      .limit(5);

    if (sampleError) {
      console.error('❌ Error obteniendo anuncios de ejemplo:', sampleError);
    } else {
      console.log('✅ Anuncios de ejemplo:');
      sampleAds.forEach((ad, index) => {
        console.log(`${index + 1}. ${ad.route_from} -> ${ad.route_to}`);
        console.log(`   Status: ${ad.status}, País: ${ad.country_from} -> ${ad.country_to}`);
        console.log(`   Fechas: ${ad.start_date} a ${ad.end_date}`);
        console.log(`   Bus: ${ad.bus_age} años, ${ad.seats} asientos`);
        console.log(`   Horas: ${ad.start_time || 'N/A'} - ${ad.end_time || 'N/A'}`);
        console.log('---');
      });
    }
    
    console.log('\n🎯 Corrección de restricciones completada.');
    console.log('\n💡 NOTA: Para resolver completamente el problema de "not-null constraint",');
    console.log('   necesitarías modificar la estructura de la base de datos en Supabase');
    console.log('   para permitir valores NULL en los campos correspondientes.');
    
  } catch (error) {
    console.error('💥 Error general:', error.message);
  }
}

// Ejecutar la corrección
fixDatabaseConstraints().catch(console.error);
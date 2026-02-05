/**
 * Script para probar la conexión con Supabase y verificar el problema con los anuncios
 */

import { createClient } from '@supabase/supabase-js';

// Configuración de Supabase (debe coincidir con supabaseClient.js)
const supabaseUrl = 'https://aynmblthitrfqcfvclot.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF5bm1ibHRoaXRyZnFjZnZjbG90Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAyMTI3NjgsImV4cCI6MjA4NTc4ODc2OH0.IdhGNNDVJdfAuSlCn9G4E_iiaUpoeZw1mNkUoYl3yFE';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testSupabaseConnection() {
  console.log('🔌 Probando conexión con Supabase...\n');
  
  try {
    // Intentar obtener todos los anuncios
    console.log('1. Obteniendo todos los anuncios...');
    const { data: allAds, error: adsError } = await supabase
      .from('ads')
      .select(`
        *,
        users (
          username,
          company_name
        )
      `)
      .order('created_at', { ascending: false })
      .limit(10); // Limitar a 10 para ver algunos ejemplos

    if (adsError) {
      console.error('❌ Error obteniendo anuncios:', adsError);
    } else {
      console.log(`✅ Anuncios encontrados: ${allAds.length}`);
      
      if (allAds.length > 0) {
        console.log('\n📋 Primeros anuncios encontrados:');
        allAds.slice(0, 3).forEach((ad, index) => {
          console.log(`  ${index + 1}. ID: ${ad.id}, Título: ${ad.route_from} -> ${ad.route_to}`);
          console.log(`     Usuario: ${ad.users?.username || ad.user_id}`);
          console.log(`     Estado: ${ad.status}`);
          console.log(`     País de origen: ${ad.country_from || 'N/A'}`);
          console.log(`     País de destino: ${ad.country_to || 'N/A'}`);
          console.log(`     Fecha creación: ${ad.created_at}`);
          console.log('---');
        });
      } else {
        console.log('ℹ️ No hay anuncios en la base de datos');
      }
    }
    
    // Intentar obtener usuarios
    console.log('\n2. Obteniendo usuarios...');
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('*')
      .limit(10);

    if (usersError) {
      console.error('❌ Error obteniendo usuarios:', usersError);
    } else {
      console.log(`✅ Usuarios encontrados: ${users.length}`);
      
      if (users.length > 0) {
        console.log('\n👥 Usuarios encontrados:');
        users.forEach((user, index) => {
          console.log(`  ${index + 1}. ID: ${user.id}, Username: ${user.username}, Role: ${user.role}`);
        });
      }
    }
    
    // Probar creación de un anuncio de prueba (si hay usuarios)
    if (users && users.length > 0) {
      console.log('\n3. Probando creación de anuncio de prueba...');
      const sampleUser = users[0];
      
      const { data: newAd, error: insertError } = await supabase
        .from('ads')
        .insert([{
          user_id: sampleUser.id,
          ad_type: 'offer',
          route_from: 'Prueba',
          route_to: 'Destino',
          country_from: 'ES',  // Campo nuevo
          country_to: 'FR',    // Campo nuevo
          start_date: new Date().toISOString(),
          price: 100,
          status: 'active',
          bus_count: 1,
          country: 'ES'
        }])
        .select()
        .single();

      if (insertError) {
        console.error('❌ Error creando anuncio de prueba:', insertError);
        console.log('💡 Esto podría indicar que los campos country_from y country_to no existen en la tabla');
      } else {
        console.log(`✅ Anuncio de prueba creado con ID: ${newAd.id}`);
        
        // Intentar obtener el anuncio recién creado
        console.log('\n4. Verificando anuncio recién creado...');
        const { data: createdAd, error: selectError } = await supabase
          .from('ads')
          .select('*')
          .eq('id', newAd.id)
          .single();

        if (selectError) {
          console.error('❌ Error obteniendo anuncio recién creado:', selectError);
        } else {
          console.log('✅ Anuncio recién creado encontrado en la base de datos');
          console.log(`   Estado: ${createdAd.status}`);
          console.log(`   País de origen: ${createdAd.country_from || 'N/A'}`);
          console.log(`   País de destino: ${createdAd.country_to || 'N/A'}`);
        }
      }
    }
    
    console.log('\n🎯 Prueba de conexión completada.');
    
  } catch (error) {
    console.error('💥 Error general:', error.message);
  }
}

// Ejecutar la prueba
testSupabaseConnection().catch(console.error);
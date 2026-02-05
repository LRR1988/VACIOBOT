/**
 * Script para depurar exactamente cómo se consultan los anuncios en la aplicación
 * Simulando la misma lógica que se usa en los componentes
 */

const { createClient } = require('@supabase/supabase-js');

// Configuración de Supabase (debe coincidir con supabaseClient.js)
const supabaseUrl = 'https://aynmblthitrfqcfvclot.supabase.co';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF5bm1ibHRoaXRyZnFjZnZjbG90Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDIxMjc2OCwiZXhwIjoyMDg1Nzg4NzY4fQ.x37WqDmMivdRMfsXNK4RNYHy_t_NNYRTMUaERbS46EA';

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function debugAdsQuery() {
  console.log('🔍 Depurando la consulta exacta de anuncios como lo hace la aplicación...\n');
  
  try {
    // Simular la función getAds() del archivo database.js
    console.log('1. Ejecutando consulta como la función getAds():');
    console.log('   SELECT *, users (username, company_name) FROM ads WHERE status = "active"');
    
    const { data: adsFromDb, error: adsError } = await supabase
      .from('ads')
      .select(`
        *,
        users (
          username,
          company_name
        )
      `)
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    if (adsError) {
      console.error('❌ Error en la consulta principal:', adsError);
      return;
    }

    console.log(`✅ Anuncios obtenidos directamente de la DB: ${adsFromDb.length}`);
    
    // Mostrar información detallada de los anuncios
    console.log('\n📋 Detalles de los anuncios:');
    adsFromDb.forEach((ad, index) => {
      console.log(`${index + 1}. ID: ${ad.id}`);
      console.log(`   Ruta: ${ad.route_from} -> ${ad.route_to}`);
      console.log(`   Usuario: ${ad.users?.username || ad.user_id}`);
      console.log(`   País: ${ad.country_from || 'N/A'} -> ${ad.country_to || 'N/A'}`);
      console.log(`   Fecha: ${ad.start_date} a ${ad.end_date || 'N/A'}`);
      console.log(`   Precio: ${ad.price}`);
      console.log(`   Estado: ${ad.status}`);
      console.log(`   Fecha creación: ${ad.created_at}`);
      console.log('---');
    });
    
    // Simular la función getUserAds() para el usuario empresa1
    console.log('\n2. Buscando anuncios del usuario "empresa1":');
    const empresa1 = adsFromDb.find(ad => ad.users?.username === 'empresa1');
    if (empresa1) {
      const { data: userAds, error: userAdsError } = await supabase
        .from('ads')
        .select('*')
        .eq('user_id', empresa1.user_id)
        .order('created_at', { ascending: false });

      if (userAdsError) {
        console.error('❌ Error obteniendo anuncios del usuario:', userAdsError);
      } else {
        console.log(`✅ Anuncios del usuario "empresa1": ${userAds.length}`);
        
        userAds.forEach((ad, index) => {
          console.log(`   ${index + 1}. ${ad.route_from} -> ${ad.route_to} | Estado: ${ad.status} | Fecha: ${ad.created_at}`);
        });
      }
    } else {
      // Buscar directamente al usuario empresa1
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id')
        .eq('username', 'empresa1')
        .single();
        
      if (userError) {
        console.error('❌ Error obteniendo usuario empresa1:', userError);
      } else if (userData) {
        const { data: userAds, error: userAdsError } = await supabase
          .from('ads')
          .select('*')
          .eq('user_id', userData.id)
          .order('created_at', { ascending: false });

        if (userAdsError) {
          console.error('❌ Error obteniendo anuncios del usuario:', userAdsError);
        } else {
          console.log(`✅ Anuncios del usuario "empresa1" (ID: ${userData.id}): ${userAds.length}`);
          
          userAds.forEach((ad, index) => {
            console.log(`   ${index + 1}. ${ad.route_from} -> ${ad.route_to} | Estado: ${ad.status} | Fecha: ${ad.created_at}`);
          });
        }
      }
    }
    
    // Simular la función getUserAds() para el usuario empresa2
    console.log('\n3. Buscando anuncios del usuario "empresa2":');
    const { data: userData2, error: userError2 } = await supabase
      .from('users')
      .select('id')
      .eq('username', 'empresa2')
      .single();
      
    if (userError2) {
      console.error('❌ Error obteniendo usuario empresa2:', userError2);
    } else if (userData2) {
      const { data: userAds2, error: userAdsError2 } = await supabase
        .from('ads')
        .select('*')
        .eq('user_id', userData2.id)
        .order('created_at', { ascending: false });

      if (userAdsError2) {
        console.error('❌ Error obteniendo anuncios del usuario:', userAdsError2);
      } else {
        console.log(`✅ Anuncios del usuario "empresa2" (ID: ${userData2.id}): ${userAds2.length}`);
        
        userAds2.forEach((ad, index) => {
          console.log(`   ${index + 1}. ${ad.route_from} -> ${ad.route_to} | Estado: ${ad.status} | Fecha: ${ad.created_at}`);
        });
      }
    }
    
    // Verificar si hay anuncios nuevos creados recientemente
    console.log('\n4. Anuncios creados en las últimas 2 horas:');
    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString();
    const recentAds = adsFromDb.filter(ad => ad.created_at >= twoHoursAgo);
    
    console.log(`✅ Anuncios recientes: ${recentAds.length}`);
    recentAds.forEach((ad, index) => {
      console.log(`   ${index + 1}. [${ad.users?.username}] ${ad.route_from} -> ${ad.route_to} | ${ad.created_at}`);
    });
    
    console.log('\n🎯 Análisis completado.');
    console.log('\n💡 CONCLUSIÓN: Si los anuncios están en la base de datos pero no se muestran en la aplicación,');
    console.log('   el problema está en la capa de frontend o en la lógica de renderizado, no en la base de datos.');
    
  } catch (error) {
    console.error('💥 Error general:', error.message);
  }
}

// Ejecutar la depuración
debugAdsQuery().catch(console.error);
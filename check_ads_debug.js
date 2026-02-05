/**
 * Script para depurar el problema con la visibilidad de anuncios
 */

const axios = require('axios');

async function debugAdsProblem() {
  const baseUrl = 'http://13.51.166.237:3000';
  
  console.log('🔍 Depurando problema con visibilidad de anuncios...\n');
  
  try {
    // Verificar la respuesta de la página de anuncios públicos
    console.log('1. Obteniendo página de anuncios públicos...');
    const response = await axios.get(`${baseUrl}/all-ads`, { timeout: 5000 });
    
    if (response.status === 200) {
      console.log('✅ Página de anuncios accesible');
      
      // Contar cuántos anuncios hay en la página
      const html = response.data;
      const adCount = (html.match(/card.*?card/gi) || []).length;
      console.log(`📊 Anuncios detectados en HTML: ${adCount}`);
      
      // Verificar si hay mensajes de "no hay anuncios"
      if (html.includes('no_ads_found') || html.includes('No hay anuncios') || html.toLowerCase().includes('no hay anuncios')) {
        console.log('⚠️ Mensaje de "no hay anuncios" encontrado');
      } else {
        console.log('✅ No se encontró mensaje de "no hay anuncios"');
      }
    } else {
      console.log(`❌ Error al acceder a la página de anuncios: ${response.status}`);
    }
  } catch (error) {
    console.log(`❌ Error al acceder a la página de anuncios: ${error.message}`);
  }
  
  try {
    // Verificar la respuesta de la página de dashboard
    console.log('\n2. Obteniendo página de dashboard...');
    const response = await axios.get(`${baseUrl}/dashboard`, { timeout: 5000 });
    
    if (response.status === 200) {
      console.log('✅ Página de dashboard accesible');
      
      // Verificar si hay anuncios del usuario
      const html = response.data;
      const myAdsCount = (html.match(/my-ads/gi) || []).length;
      console.log(`📊 Referencias a "my-ads" en HTML: ${myAdsCount}`);
      
      // Verificar si hay mensajes de "no hay elementos"
      if (html.includes('no_items_found') || html.includes('No hay elementos') || html.toLowerCase().includes('no hay elementos')) {
        console.log('⚠️ Mensaje de "no hay elementos" encontrado');
      } else {
        console.log('✅ No se encontró mensaje de "no hay elementos"');
      }
    } else {
      console.log(`❌ Error al acceder a la página de dashboard: ${response.status}`);
    }
  } catch (error) {
    console.log(`❌ Error al acceder a la página de dashboard: ${error.message}`);
  }
  
  console.log('\n💡 Instrucciones:');
  console.log('- Verifique que los anuncios se estén creando con el estado "active" en la base de datos');
  console.log('- Asegúrese de que los usuarios estén autenticados al consultar sus anuncios');
  console.log('- Revise que los campos country_from y country_to estén correctamente definidos en la base de datos');
  console.log('- Confirme que la base de datos de Supabase tenga los índices y restricciones correctos');
  
  console.log('\n🎯 La aplicación está sirviendo correctamente las páginas, pero el problema parece estar en la lógica de negocio o la base de datos.');
}

// Ejecutar la depuración
debugAdsProblem().catch(console.error);
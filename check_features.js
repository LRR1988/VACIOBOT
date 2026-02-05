/**
 * Script para verificar las funcionalidades específicas de la aplicación Travabus
 */

const axios = require('axios');

async function checkFeatures() {
  const baseUrl = 'http://13.51.166.237:3000';
  
  console.log('🚀 Verificando funcionalidades específicas de Travabus...\n');
  
  // Verificar que la página principal tenga el título correcto
  try {
    const response = await axios.get(baseUrl, { timeout: 5000 });
    const html = response.data;
    
    if (html.includes('Travabus')) {
      console.log('✅ Página principal: Título correcto encontrado');
    } else {
      console.log('❌ Página principal: Título no encontrado');
    }
    
    if (html.includes('Conectamos rutas, optimizamos viajes')) {
      console.log('✅ Página principal: Subtítulo correcto encontrado');
    } else {
      console.log('❌ Página principal: Subtítulo no encontrado');
    }
    
    if (html.includes('Ver Anuncios')) {
      console.log('✅ Página principal: Enlace "Ver Anuncios" encontrado');
    } else {
      console.log('❌ Página principal: Enlace "Ver Anuncios" no encontrado');
    }
    
    if (html.includes('Publica Rutas')) {
      console.log('✅ Página principal: Sección "Publica Rutas" encontrada');
    } else {
      console.log('❌ Página principal: Sección "Publica Rutas" no encontrada');
    }
    
  } catch (error) {
    console.log('❌ Error al verificar la página principal:', error.message);
  }
  
  // Verificar que la página de anuncios públicos funcione
  try {
    const response = await axios.get(`${baseUrl}/all-ads`, { timeout: 5000 });
    const html = response.data;
    
    if (html.includes('Anuncios Disponibles')) {
      console.log('✅ Página de anuncios públicos: Encabezado encontrado');
    } else {
      console.log('❌ Página de anuncios públicos: Encabezado no encontrado');
    }
    
    if (html.includes('Reservar')) {
      console.log('✅ Página de anuncios públicos: Botón "Reservar" encontrado');
    } else {
      console.log('❌ Página de anuncios públicos: Botón "Reservar" no encontrado');
    }
    
  } catch (error) {
    console.log('❌ Error al verificar la página de anuncios públicos:', error.message);
  }
  
  // Verificar que la página de publicación funcione
  try {
    const response = await axios.get(`${baseUrl}/publish`, { timeout: 5000 });
    const html = response.data;
    
    if (html.includes('Publicar Anuncio')) {
      console.log('✅ Página de publicación: Encabezado encontrado');
    } else {
      console.log('❌ Página de publicación: Encabezado no encontrado');
    }
    
    if (html.includes('Precio, impuestos y otros gastos incluidos')) {
      console.log('✅ Página de publicación: Campo de precio actualizado encontrado');
    } else {
      console.log('❌ Página de publicación: Campo de precio actualizado no encontrado');
    }
    
    if (html.includes('País de origen')) {
      console.log('✅ Página de publicación: Campo de país de origen encontrado');
    } else {
      console.log('❌ Página de publicación: Campo de país de origen no encontrado');
    }
    
    if (html.includes('País de destino')) {
      console.log('✅ Página de publicación: Campo de país de destino encontrado');
    } else {
      console.log('❌ Página de publicación: Campo de país de destino no encontrado');
    }
    
  } catch (error) {
    console.log('❌ Error al verificar la página de publicación:', error.message);
  }
  
  // Verificar que la página de pagos funcione
  try {
    const response = await axios.get(`${baseUrl}/payments`, { timeout: 5000 });
    const html = response.data;
    
    if (html.includes('Gestión de Pagos')) {
      console.log('✅ Página de pagos: Encabezado encontrado');
    } else {
      console.log('❌ Página de pagos: Encabezado no encontrado');
    }
    
    if (html.includes('Mis Anuncios')) {
      console.log('✅ Página de pagos: Sección "Mis Anuncios" encontrada');
    } else {
      console.log('❌ Página de pagos: Sección "Mis Anuncios" no encontrada');
    }
    
    if (html.includes('Transacciones')) {
      console.log('✅ Página de pagos: Sección "Transacciones" encontrada');
    } else {
      console.log('❌ Página de pagos: Sección "Transacciones" no encontrada');
    }
    
  } catch (error) {
    console.log('❌ Error al verificar la página de pagos:', error.message);
  }
  
  console.log('\n🎯 Verificación de funcionalidades completada.');
}

// Ejecutar la verificación
checkFeatures().catch(console.error);